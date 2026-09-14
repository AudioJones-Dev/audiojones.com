/**
 * Reference and semantic validation for the journey registry (spec §9.4,
 * §8.11, §7.4). Pure: no filesystem access, so it can run anywhere the
 * registry is imported. Route existence is checked in test/journeys.test.ts.
 */

import { mainNav } from "@/config/nav";
import { OFFERS } from "@/content/offers";
import { TOOLS } from "@/content/tools";
import {
  JOURNEY_PAGES,
  JOURNEYS,
  stripQuery,
  type JourneyCta,
  type JourneyPage,
} from "./index";

const ROOT_ARCHETYPES = new Set<JourneyPage["archetype"]>(["brand-landing", "hub"]);
const GLOBAL_NAV = new Set(["primary", "dropdown", "footer"]);

function isInternal(destination: string): boolean {
  return destination.startsWith("/");
}

export function validateJourneyRegistry(): string[] {
  const errors: string[] = [];
  const byId = new Map<string, JourneyPage>();
  const byRoute = new Map<string, JourneyPage>();
  const toolById = new Map(TOOLS.map((t) => [t.id, t]));
  const offerIds = new Set(OFFERS.map((o) => o.id));

  for (const p of JOURNEY_PAGES) {
    if (byId.has(p.id)) errors.push(`duplicate page id "${p.id}"`);
    byId.set(p.id, p);
    if (byRoute.has(p.route)) errors.push(`duplicate route "${p.route}" (${p.id})`);
    byRoute.set(p.route, p);
    if (p.route.includes("?")) errors.push(`${p.id}: route carries a query string`);
  }

  const ref = (owner: string, field: string, id: string) => {
    if (!byId.has(id)) errors.push(`${owner}: ${field} references unknown page "${id}"`);
  };

  const inbound = new Map<string, Set<string>>();
  const noteInbound = (to: string, from: string) => {
    if (!inbound.has(to)) inbound.set(to, new Set());
    inbound.get(to)!.add(from);
  };

  const checkCta = (p: JourneyPage, cta: JourneyCta, role: string) => {
    const owner = `${p.id} ${role} "${cta.id}"`;
    if (/[?&]utm_/i.test(cta.destination)) errors.push(`${owner}: internal CTA carries utm_ parameters`);
    if (cta.toolId && !toolById.has(cta.toolId)) errors.push(`${owner}: unknown toolId "${cta.toolId}"`);
    if (cta.offerId && !offerIds.has(cta.offerId)) errors.push(`${owner}: unknown offerId "${cta.offerId}"`);
    if (cta.intent === "apply" && cta.offerId === undefined && p.archetype !== "pricing" && p.archetype !== "qualification") {
      errors.push(`${owner}: apply CTA declares no offerId`);
    }
    if (!isInternal(cta.destination)) return;
    const target = byRoute.get(stripQuery(cta.destination));
    if (!target) {
      errors.push(`${owner}: destination "${cta.destination}" is not a registered page`);
      return;
    }
    noteInbound(target.id, p.id);
    if (target.id === p.id) errors.push(`${owner}: points at its own page`);
    if (p.status === "live" && target.status !== "live") {
      errors.push(`${owner}: live page links to ${target.status} page "${target.id}"`);
    }
    if (cta.intent === "schedule" && target.archetype !== "booking") {
      errors.push(`${owner}: schedule CTA points to a non-booking page "${target.id}"`);
    }
    if (cta.intent === "apply" && stripQuery(cta.destination) !== "/apply" && target.archetype !== "confirmation") {
      errors.push(`${owner}: apply CTA does not land on /apply`);
    }
    if (target.canonicalRoute && target.canonicalRoute !== target.route) {
      errors.push(`${owner}: points at alias "${target.route}" instead of canonical "${target.canonicalRoute}"`);
    }
  };

  for (const p of JOURNEY_PAGES) {
    if (p.parentId) {
      ref(p.id, "parentId", p.parentId);
      if (p.parentId === p.id) errors.push(`${p.id}: is its own parent`);
    } else if (!ROOT_ARCHETYPES.has(p.archetype)) {
      errors.push(`${p.id}: child page lacks a parent hub`);
    }
    for (const id of p.relatedPageIds ?? []) ref(p.id, "relatedPageIds", id);
    for (const id of p.requiredInboundFrom ?? []) {
      ref(p.id, "requiredInboundFrom", id);
      noteInbound(p.id, id);
    }
    for (const id of p.requiredOutboundTo ?? []) {
      ref(p.id, "requiredOutboundTo", id);
      noteInbound(id, p.id);
      const target = byId.get(id);
      if (target && p.status === "live" && target.status !== "live") {
        errors.push(`${p.id}: requiredOutboundTo links to ${target.status} page "${id}"`);
      }
    }

    if (p.toolId) {
      const tool = toolById.get(p.toolId);
      if (!tool) {
        errors.push(`${p.id}: unknown toolId "${p.toolId}"`);
      } else {
        if (p.archetype === "tool-landing" && p.route !== tool.href) {
          errors.push(`${p.id}: tool-landing route "${p.route}" diverges from registry href "${tool.href}"`);
        }
        if (!p.route.startsWith(tool.href)) {
          errors.push(`${p.id}: route "${p.route}" is not under tool href "${tool.href}"`);
        }
        if (tool.status === "planned" && p.status === "live") {
          errors.push(`${p.id}: planned tool "${tool.id}" is registered as a live page`);
        }
      }
    }
    if (p.offerId && !offerIds.has(p.offerId)) errors.push(`${p.id}: unknown offerId "${p.offerId}"`);

    if (p.sitemapEligible && !p.indexable) errors.push(`${p.id}: sitemap-eligible but not indexable`);
    if (p.sitemapEligible && p.canonicalRoute && p.canonicalRoute !== p.route) {
      errors.push(`${p.id}: sitemap-eligible alias of "${p.canonicalRoute}"`);
    }
    if (p.status !== "live" && (p.navVisibility ?? []).some((v) => GLOBAL_NAV.has(v))) {
      errors.push(`${p.id}: ${p.status} page declares global navigation visibility`);
    }
    if (p.status === "live" && p.indexable && p.archetype === "result" && !p.primaryCta) {
      errors.push(`${p.id}: public result page has no declared next step`);
    }

    checkCta(p, p.primaryCta, "primaryCta");
    for (const cta of p.secondaryCtas ?? []) checkCta(p, cta, "secondaryCta");
    const ctaIds = [p.primaryCta, ...(p.secondaryCtas ?? [])].map((c) => c.id);
    if (new Set(ctaIds).size !== ctaIds.length) errors.push(`${p.id}: duplicate CTA ids`);
  }

  // Orphans: a live, indexable page must be reachable from global navigation
  // or from at least one declared edge (spec §7.4).
  for (const p of JOURNEY_PAGES) {
    if (p.status !== "live" || !p.indexable) continue;
    if ((p.navVisibility ?? []).some((v) => GLOBAL_NAV.has(v))) continue;
    if (p.archetype === "brand-landing" && p.route === "/") continue;
    const from = inbound.get(p.id);
    const parentLinks = p.parentId && byId.get(p.parentId)?.requiredOutboundTo?.includes(p.id);
    if ((!from || from.size === 0) && !parentLinks) {
      errors.push(`${p.id}: no inbound internal link declared (orphan)`);
    }
  }

  // Global navigation config must resolve to live, canonical, registered pages.
  for (const item of mainNav) {
    if (item.external) continue;
    const page = byRoute.get(stripQuery(item.href));
    if (!page) {
      errors.push(`nav "${item.label}": route "${item.href}" is not a registered page`);
      continue;
    }
    if (page.status !== "live") errors.push(`nav "${item.label}": page "${page.id}" is ${page.status}`);
    if (page.canonicalRoute && page.canonicalRoute !== page.route) {
      errors.push(`nav "${item.label}": points at an alias`);
    }
    for (const child of item.children ?? []) {
      if (child.external) continue;
      const childPage = byRoute.get(stripQuery(child.href));
      if (!childPage) errors.push(`nav child "${child.label}": route "${child.href}" is not a registered page`);
      else if (childPage.status !== "live") errors.push(`nav child "${child.label}": page is ${childPage.status}`);
    }
  }

  // Journeys reference known pages and declare a success event.
  const journeyIds = new Set<string>();
  for (const j of JOURNEYS) {
    if (journeyIds.has(j.id)) errors.push(`duplicate journey id "${j.id}"`);
    journeyIds.add(j.id);
    if (!j.successEvent) errors.push(`journey ${j.id}: no successEvent`);
    if (j.orderedPageIds.length === 0) errors.push(`journey ${j.id}: no ordered pages`);
    for (const id of j.entryPageIds) ref(`journey ${j.id}`, "entryPageIds", id);
    for (const id of j.orderedPageIds) ref(`journey ${j.id}`, "orderedPageIds", id);
    if (j.fallbackPageId) ref(`journey ${j.id}`, "fallbackPageId", j.fallbackPageId);
    const first = byId.get(j.orderedPageIds[0]);
    if (first && first.status !== "live") errors.push(`journey ${j.id}: starts on ${first.status} page "${first.id}"`);
  }

  return errors;
}
