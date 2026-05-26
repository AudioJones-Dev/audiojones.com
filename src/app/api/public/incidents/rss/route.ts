/**
 * RSS/JSON Feed for Incidents
 * 
 * Provides incident data in RSS XML format for external systems
 * like status page aggregators, monitoring tools, etc.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/server/legacyAdmin';
import { serializeIncidentsForFeed, applyFeedFilters } from '@/lib/server/incidentFeed';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'rss'; // 'rss' or 'json'
    const limit = Math.min(parseInt(searchParams.get('limit') || '25', 10), 50);
    
    // Fetch recent incidents
    const snapshot = await getDb()
      .collection('incidents')
      .orderBy('updated_at', 'desc')
      .limit(limit)
      .get();
    
    const incidents = serializeIncidentsForFeed(snapshot.docs);
    
    if (format === 'json') {
      // JSON Feed format (https://jsonfeed.org/)
      const jsonFeed = {
        version: 'https://jsonfeed.org/version/1.1',
        title: 'Audio Jones System Status',
        home_page_url: 'https://audiojones.com',
        feed_url: 'https://audiojones.com/api/public/incidents/rss?format=json',
        description: 'Current system status and incident updates for Audio Jones services',
        items: incidents.map(incident => ({
          id: incident.id,
          title: incident.title,
          content_text: incident.short_description || `Incident status: ${incident.status}`,
          url: `https://audiojones.com/status#${incident.id}`,
          date_published: incident.started_at,
          date_modified: incident.updated_at,
          tags: [
            incident.status,
            ...(incident.severity ? [incident.severity] : []),
            ...(incident.affected_components || [])
          ]
        }))
      };
      
      return new NextResponse(JSON.stringify(jsonFeed, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=300'
        }
      });
    }
    
    // RSS XML format
    const rssItems = incidents.map(incident => `
    <item>
      <title><![CDATA[${incident.title}]]></title>
      <description><![CDATA[${incident.short_description || `Status: ${incident.status}`}]]></description>
      <link>https://audiojones.com/status#${incident.id}</link>
      <guid>https://audiojones.com/incidents/${incident.id}</guid>
      <pubDate>${incident.started_at ? new Date(incident.started_at).toUTCString() : new Date().toUTCString()}</pubDate>
      <category>${incident.status}</category>
      ${incident.severity ? `<category>${incident.severity}</category>` : ''}
      ${incident.affected_components?.map(comp => `<category>${comp}</category>`).join('') || ''}
    </item>`).join('');
    
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Audio Jones System Status</title>
    <description>Current system status and incident updates for Audio Jones services</description>
    <link>https://audiojones.com/status</link>
    <atom:link href="https://audiojones.com/api/public/incidents/rss" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Audio Jones Status System</generator>
    ${rssItems}
  </channel>
</rss>`;
    
    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/rss+xml',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300'
      }
    });
    
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    
    const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Audio Jones System Status - Error</title>
    <description>Error generating status feed</description>
    <link>https://audiojones.com/status</link>
  </channel>
</rss>`;
    
    return new NextResponse(errorXml, {
      status: 500,
      headers: {
        'Content-Type': 'application/rss+xml',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
