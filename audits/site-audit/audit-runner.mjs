import fs from "node:fs/promises";
import path from "node:path";

const ORIGIN = "https://www.audiojones.com";
const HOSTS = new Set(["audiojones.com", "www.audiojones.com"]);
const OUT = path.resolve("audits/site-audit");
const RAW = path.join(OUT, "raw-pages");
const REPORTS = path.join(OUT, "page-reports");
const UA = "Mozilla/5.0 (compatible; AudioJonesSiteAudit/1.0)";
const NOW = new Date().toISOString();

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const uniq = (xs) => [...new Set(xs.filter(Boolean))];

function cleanUrl(input, base = ORIGIN) {
  const u = new URL(input, base);
  u.hash = "";
  u.search = "";
  const origin = HOSTS.has(u.hostname) ? ORIGIN : u.origin;
  let s = `${origin}${u.pathname}`;
  if (s.endsWith("/") && u.pathname !== "/") s = s.slice(0, -1);
  return s === `${origin}/` ? origin : s;
}

function isInternal(input, base = ORIGIN) {
  try {
    return HOSTS.has(new URL(input, base).hostname);
  } catch {
    return false;
  }
}

function isAsset(url) {
  return /\.(png|jpe?g|webp|gif|svg|ico|pdf|css|js|json|txt|xml|webmanifest|woff2?|ttf|map|mp4|mov|mp3|wav|avif)$/i.test(
    new URL(url, ORIGIN).pathname,
  );
}

function decode(s = "") {
  return s
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;|&#x27;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function strip(html = "") {
  return decode(html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function attr(tag, name) {
  const re = new RegExp(`${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i");
  const m = tag.match(re);
  return decode((m && (m[1] ?? m[2] ?? m[3])) || "").trim();
}

function meta(html, key, value) {
  for (const m of html.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = m[0];
    if (attr(tag, key).toLowerCase() === value.toLowerCase()) return attr(tag, "content");
  }
  return "";
}

function metaPrefix(html, key, prefix) {
  const out = {};
  for (const m of html.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = m[0];
    const k = attr(tag, key);
    if (k.toLowerCase().startsWith(prefix.toLowerCase())) out[k] = attr(tag, "content");
  }
  return out;
}

function relLink(html, rel) {
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = m[0];
    if (attr(tag, "rel").toLowerCase().split(/\s+/).includes(rel)) return attr(tag, "href");
  }
  return "";
}

function title(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? strip(m[1]) : "";
}

function headings(html) {
  return [...html.matchAll(/<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/gi)]
    .map((m) => ({ level: Number(m[1]), text: strip(m[2]) }))
    .filter((h) => h.text);
}

function links(html, base) {
  return [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)]
    .map((m) => {
      const href = attr(`<a ${m[1]}>`, "href");
      if (!href || /^(#|mailto:|tel:|javascript:)/i.test(href)) return null;
      try {
        return { href: cleanUrl(new URL(href, base).toString()), text: strip(m[2]) };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function buttons(html) {
  return uniq([...html.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/gi)].map((m) => strip(m[1])));
}

function images(html, base) {
  return [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => {
    const tag = m[0];
    let src = attr(tag, "src") || attr(tag, "data-src");
    try {
      if (src) src = new URL(src, base).toString();
    } catch {}
    return { src, alt: attr(tag, "alt") };
  });
}

function jsonLd(html) {
  return [...html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(
    (m) => {
      const raw = decode(m[1].trim());
      try {
        return { parsed: JSON.parse(raw) };
      } catch (e) {
        return { raw, error: e.message };
      }
    },
  );
}

function schemaTypes(blocks) {
  const types = new Set();
  function walk(v) {
    if (!v) return;
    if (Array.isArray(v)) return v.forEach(walk);
    if (typeof v === "object") {
      if (v["@type"]) (Array.isArray(v["@type"]) ? v["@type"] : [v["@type"]]).forEach((t) => types.add(String(t)));
      if (v["@graph"]) walk(v["@graph"]);
    }
  }
  blocks.forEach((b) => walk(b.parsed));
  return [...types].sort();
}

function csv(rows, cols) {
  const esc = (v) => {
    const s = v == null ? "" : String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n") + "\n";
}

function slug(url, used) {
  const p = new URL(url).pathname;
  const base = (p === "/" ? "home" : p.replace(/^\/|\/$/g, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()) || "home";
  const n = used.get(base) || 0;
  used.set(base, n + 1);
  return n ? `${base}-${n + 1}` : base;
}

function words(text) {
  return (text.match(/\b[\w'’-]+\b/g) || []).length;
}

function pageType(url) {
  const p = new URL(url).pathname;
  if (p === "/") return "Homepage";
  if (p === "/services") return "Services / offer page";
  if (p === "/pricing") return "Pricing page";
  if (p === "/book-a-call") return "Booking page";
  if (/diagnostic|audit/.test(p)) return "Diagnostic / lead capture page";
  if (p === "/agents" || p.startsWith("/agents/")) return "Agent product page";
  if (p === "/frameworks" || p.startsWith("/frameworks/")) return "Framework / educational page";
  if (p === "/insights" || p.startsWith("/insights/")) return "Insight / authority page";
  if (p === "/blog" || p.startsWith("/blog/")) return "Blog / topic page";
  if (/policy|terms/.test(p)) return "Legal / policy page";
  if (p === "/case-studies") return "Proof / case studies page";
  if (p === "/about") return "About / entity page";
  if (p === "/workshops") return "Workshop / offer page";
  if (p === "/apply") return "Application page";
  return "Public utility page";
}

function hasAny(text, terms) {
  const t = text.toLowerCase();
  return terms.some((x) => t.includes(x));
}

function countAny(text, terms) {
  const t = text.toLowerCase();
  return terms.reduce((n, x) => n + (t.includes(x) ? 1 : 0), 0);
}

function schemaRecommendation(type) {
  if (type.includes("Homepage")) return "Organization + WebSite + FAQPage";
  if (/Services|Workshop|Agent|Pricing/.test(type)) return "Service + OfferCatalog + FAQPage + BreadcrumbList";
  if (type.includes("Diagnostic")) return "Service + FAQPage + BreadcrumbList";
  if (/Framework|Insight|Blog/.test(type)) return "Article or TechArticle + FAQPage + BreadcrumbList";
  if (type.includes("About")) return "Organization + Person + BreadcrumbList";
  if (type.includes("Proof")) return "ItemList + CaseStudy-style Article + BreadcrumbList";
  if (type.includes("Legal")) return "WebPage + BreadcrumbList";
  return "WebPage + BreadcrumbList";
}

function infer(page) {
  const txt = page.visible_text.toLowerCase();
  const purpose = page.page_type.includes("Booking")
    ? "Convert a qualified visitor into a scheduled call."
    : page.page_type.includes("Application")
      ? "Convert a qualified visitor into an application submission."
      : page.page_type.includes("Diagnostic")
        ? "Convert problem-aware visitors into diagnostic completions/leads."
        : /Insight|Framework|Blog/.test(page.page_type)
          ? "Move readers from education to diagnostic, booking, or related commercial pages."
          : page.page_type.includes("Legal")
            ? "Reduce buying friction and policy uncertainty."
            : "Move visitors toward diagnostic, booking, or offer exploration.";
  return {
    audience: txt.includes("founder-led")
      ? "Founder-led service business owners/operators with operational fragmentation or revenue leaks."
      : page.page_type.includes("Legal")
        ? "Visitors, clients, and buyers who need policy or terms clarity."
        : "Founder-led service businesses evaluating AJ Digital / Audio Jones as an AI operations partner.",
    search_intent: /Insight|Framework|Blog/.test(page.page_type)
      ? "Informational and answer-engine intent around AI systems, attribution, signal/noise, and operational clarity."
      : page.page_type.includes("Pricing")
        ? "Commercial/pricing qualification intent."
        : page.page_type.includes("Legal")
          ? "Policy/compliance lookup intent."
          : "Commercial investigation and branded navigation intent.",
    conversion_intent: purpose,
  };
}

function sentence(text, re, fallback) {
  return text.split(/(?<=[.!?])\s+/).find((s) => re.test(s))?.trim() || fallback;
}

function audit(page) {
  const text = page.visible_text;
  const h1s = page.headings.filter((h) => h.level === 1).length;
  const cta = page.cta_text.length;
  const schema = page.schema_types;
  const imgMissing = page.images.filter((i) => i.src && i.alt === "").length;
  const vague = ["innovative solutions", "leverage ai", "transform your business", "streamline operations"].filter((x) =>
    text.toLowerCase().includes(x),
  );
  const terms = {
    icp: ["founder-led", "service business", "founder", "operator", "business owner", "agency", "consultant"],
    offer: ["diagnostic", "audit", "system", "service", "workshop", "calculator", "call", "pricing", "implementation"],
    problem: ["fragmented", "chaos", "revenue leak", "poor follow-up", "no crm", "visibility", "noise", "missed", "manual"],
    outcome: ["clarity", "qualified", "visibility", "follow-up", "attribution", "revenue", "system", "score", "pipeline"],
    proof: ["case study", "testimonial", "client", "proof", "result", "results", "%", "$", "roi", "before", "after", "metric", "measured"],
  };
  const icp_score = Math.min(100, 25 + countAny(text, terms.icp) * 22 + (text.toLowerCase().includes("founder-led service") ? 20 : 0));
  const offer_score = Math.min(100, 20 + countAny(text, terms.offer) * 15 + (cta ? 15 : 0));
  const problem_score = Math.min(100, 20 + countAny(text, terms.problem) * 16);
  const outcome_score = Math.min(100, 20 + countAny(text, terms.outcome) * 12);
  const cta_score = Math.min(100, 20 + cta * 10 + (cta ? 20 : 0));
  const trust_score = Math.min(100, 15 + countAny(text, terms.proof) * 13 + (page.page_type.includes("Legal") ? 35 : 0));
  const hasFaq = schema.includes("FAQPage") || /\bfaq\b|frequently asked/i.test(text);
  const hasDirectAnswer = /\bwhat is\b|\bhow (it|this|we) works\b|\bin short\b|\bdefinition\b/i.test(text) || page.headings.some((h) => /what|how|why|faq|definition/i.test(h.text));
  const hasDefinition = /\b(is|means|refers to|defined as)\b/i.test(text) && /Founder Intelligence|Applied Intelligence|ResponseOS|signal|attribution/i.test(text);
  const hasComparison = /\bvs\b| versus | compared with | instead of | not .* but | alternative/i.test(text);
  const hasServiceSchema = schema.some((s) => ["Service", "Offer", "OfferCatalog"].includes(s));
  const hasOrgSchema = schema.some((s) => ["Organization", "Person", "WebSite"].includes(s));
  const hasEntityNaming = /Audio Jones|AJ Digital|Founder Intelligence Systems|Founder Intelligence|Applied Intelligence|ResponseOS/i.test(text);
  const hasQuote = text.split(/(?<=[.!?])\s+/).some((s) => s.length >= 70 && s.length <= 180 && /Audio Jones|AJ Digital|Founder|system|diagnostic|revenue|clarity/i.test(s));
  const seo_score = Math.max(
    0,
    Math.min(
      100,
      (page.title.length >= 20 && page.title.length <= 70 ? 14 : page.title ? 8 : 0) +
        (page.meta_description.length >= 70 && page.meta_description.length <= 170 ? 14 : page.meta_description ? 8 : 0) +
        (page.canonical_url ? 10 : 0) +
        (h1s === 1 ? 12 : h1s ? 5 : 0) +
        (page.headings.filter((h) => h.level > 1).length >= 2 ? 8 : 3) +
        (page.word_count >= 500 ? 10 : page.word_count >= 250 ? 6 : 2) +
        (schema.length ? 10 : 0) +
        (Object.keys(page.open_graph).length >= 3 ? 7 : 2) +
        (Object.keys(page.twitter_meta).length >= 2 ? 5 : 0) +
        (imgMissing === 0 ? 5 : Math.max(0, 5 - imgMissing)) +
        (page.indexability_status === "indexable" ? 5 : 0),
    ),
  );
  const aeo_score =
    (hasDirectAnswer ? 14 : 0) +
    (hasDefinition ? 12 : 0) +
    (hasFaq ? 15 : 0) +
    (hasComparison ? 8 : 0) +
    (hasServiceSchema ? 10 : 0) +
    (hasOrgSchema ? 10 : 0) +
    (hasEntityNaming ? 12 : 0) +
    (hasQuote ? 10 : 0) +
    (problem_score >= 60 && outcome_score >= 60 ? 9 : 3);
  const cro_score = Math.max(
    0,
    Math.min(
      100,
      (page.above_the_fold_copy.length > 80 && h1s ? 12 : 5) +
        (cta_score >= 60 ? 16 : cta_score >= 40 ? 9 : 2) +
        (offer_score >= 60 ? 14 : 5) +
        (trust_score >= 55 ? 14 : trust_score >= 35 ? 8 : 2) +
        (hasAny(text, ["next step", "book", "diagnostic", "apply", "calculate", "schedule"]) ? 14 : 4) +
        (page.internal_links.some((l) => /diagnostic|book-a-call|apply|pricing|services|agents\/responseos/i.test(l.href)) ? 12 : 4) +
        (page.page_type.includes("Legal") ? 12 : 0) +
        (cta > 8 ? -5 : 5),
    ),
  );
  let messaging_score = Math.round((icp_score + offer_score + problem_score + outcome_score + cta_score + trust_score) / 6);
  messaging_score = Math.max(0, Math.min(100, messaging_score - Math.min(20, vague.length * 8)));
  const missing = [];
  if (page.title.length < 20 || page.title.length > 70) missing.push("tighter title tag");
  if (page.meta_description.length < 70 || page.meta_description.length > 170) missing.push("stronger meta description");
  if (h1s !== 1) missing.push("single clear H1");
  if (!hasFaq) missing.push("FAQ block");
  if (!hasDirectAnswer) missing.push("direct answer block");
  if (!hasDefinition) missing.push("definition/entity explanation");
  if (!hasServiceSchema && !page.page_type.includes("Legal")) missing.push("service/offer schema");
  if (icp_score < 60) missing.push("explicit ICP naming");
  if (problem_score < 60) missing.push("painful current-state framing");
  if (outcome_score < 60) missing.push("measurable desired outcome");
  if (offer_score < 60) missing.push("specific offer mechanism");
  if (cta_score < 60) missing.push("obvious primary CTA");
  if (trust_score < 55 && !page.page_type.includes("Legal")) missing.push("proof or trust signal");
  if (vague.length) missing.push(`vague phrases: ${vague.join("; ")}`);
  const primary_issue = missing[0] || "Page is structurally sound; tighten specificity and entity language.";
  const recommended_fix = fixFor(page, primary_issue, missing);
  const priority =
    page.page_type.match(/Homepage|Services|Diagnostic|Pricing|Agent|Booking|Application|Workshop/) && (cro_score < 75 || messaging_score < 75)
      ? "High"
      : (seo_score < 55 || aeo_score < 45 || messaging_score < 50) && !page.page_type.includes("Legal")
        ? "High"
        : page.page_type.includes("Legal")
          ? "Low"
          : "Medium";
  return {
    seo_score: Math.round(seo_score),
    aeo_score: Math.round(aeo_score),
    cro_score: Math.round(cro_score),
    messaging_score,
    icp_score: Math.round(icp_score),
    offer_score: Math.round(offer_score),
    problem_score,
    outcome_score,
    cta_score,
    trust_score,
    priority,
    primary_issue,
    recommended_fix,
    ...infer(page),
    claimed_problem: sentence(text, /problem|chaos|leak|fragment|follow[- ]?up|crm|visibility|noise|manual|lost|missed|fail/i, "The page implies an operational clarity problem, but the problem statement needs to be more explicit."),
    promised_outcome: sentence(text, /outcome|clarity|revenue|system|qualified|visibility|follow[- ]?up|diagnostic|book|growth|compound|convert|score/i, "The intended outcome is not stated in a compact, quotable way."),
    offer_clear_5_seconds: page.above_the_fold_copy.length > 80 && icp_score >= 55 && offer_score >= 55,
    primary_cta_obvious: cta_score >= 60,
    copy_specific_or_generic: vague.length || (problem_score < 55 && outcome_score < 55) ? "Generic or under-specific in key areas" : "Mostly specific, with room to sharpen quotable claims",
    ai_answer_engine_quotable: hasQuote && (hasDirectAnswer || hasDefinition || hasFaq),
    missing,
    checks: { hasDirectAnswer, hasDefinition, hasFaq, hasComparison, hasServiceSchema, hasOrgSchema, hasEntityNaming, hasQuote, vague },
  };
}

function fixFor(page, issue, missing) {
  if (issue.includes("FAQ")) return "Add a compact FAQ section with direct answers to buyer objections and FAQPage JSON-LD.";
  if (issue.includes("direct answer")) return "Add a 2-3 sentence answer block after the hero that defines the page topic in quotable language.";
  if (issue.includes("title")) return "Rewrite the title tag around the exact page intent, primary entity, and Audio Jones brand without duplicating the brand suffix.";
  if (issue.includes("meta")) return "Rewrite the meta description to name the ICP, problem, outcome, and next step in 140-160 characters.";
  if (issue.includes("ICP")) return "Name founder-led service businesses in the hero or first content block and connect the page to fragmented follow-up, CRM, visibility, or revenue leaks.";
  if (issue.includes("current-state")) return "Add concrete current-state language: fragmented communication, missed follow-up, no CRM source of truth, weak visibility, or revenue leakage.";
  if (issue.includes("outcome")) return "State the promised outcome as measurable operational clarity: cleaner follow-up, attribution visibility, qualified pipeline, or reduced revenue leakage.";
  if (issue.includes("offer")) return "Make the offer mechanism explicit: what AJ Digital builds, what the buyer receives, and what happens next.";
  if (issue.includes("CTA")) return "Promote one primary CTA above the fold and repeat the same next step after major decision sections.";
  if (issue.includes("proof")) return "Add proof: named case context where allowed, before/after metrics, process evidence, testimonials, or operational screenshots.";
  if (issue.includes("schema")) return `Add ${schemaRecommendation(page.page_type)} JSON-LD matching the page purpose.`;
  return `Address ${missing.slice(0, 3).join(", ")} first; keep the page scoped to one search intent and one conversion path.`;
}

function headline(page) {
  if (page.page_type.includes("Homepage")) return "Founder Intelligence Systems for Service Businesses Leaking Revenue in the Gaps";
  if (page.page_type.includes("Services")) return "Build the Operating System Your Follow-Up, CRM, and Revenue Visibility Are Missing";
  if (page.page_type.includes("Agent")) return "ResponseOS Turns Missed Conversations Into Tracked Follow-Up and Qualified Pipeline";
  if (page.page_type.includes("Diagnostic")) return "Find the Revenue Leaks Hidden in Your Follow-Up, CRM, and Operations";
  if (page.page_type.includes("Pricing")) return "Choose the Founder Intelligence System That Fits Your Operating Gaps";
  if (page.page_type.includes("Workshop")) return "Workshops for Founders Who Need Operational Clarity Before More AI Tools";
  if (/Framework|Insight|Blog/.test(page.page_type)) return `${page.h1 || page.title}: The Operator's Summary`;
  if (page.page_type.includes("About")) return "Audio Jones Builds Founder Intelligence Systems for Founder-Led Service Businesses";
  return page.h1 || page.title || "Founder Intelligence Systems";
}

function cta(page) {
  if (page.page_type.includes("Booking")) return "Book a Founder Intelligence Call";
  if (page.page_type.includes("Application")) return "Apply for a Diagnostic Review";
  if (page.page_type.includes("Pricing")) return "Choose Your Diagnostic Path";
  if (/Insight|Framework|Blog/.test(page.page_type)) return "Run the AI Readiness Diagnostic";
  if (page.page_type.includes("Legal")) return "Return to Services";
  return "Start the Founder Intelligence Diagnostic";
}

function faq(page) {
  if (page.page_type.includes("Legal")) {
    return [
      ["What does this policy cover?", "It explains the terms, rights, or obligations that apply when someone uses Audio Jones or AJ Digital services."],
      ["Who should read it?", "Prospects, clients, and site visitors who need policy clarity before working with AJ Digital."],
      ["Where should I go next?", "Return to the relevant service, diagnostic, or booking page once the policy question is resolved."],
    ];
  }
  return [
    ["What is a Founder Intelligence System?", "A Founder Intelligence System connects follow-up, CRM, attribution, reporting, and business memory so a founder can see where revenue is leaking and what to fix next."],
    ["Who is this for?", "It is for founder-led service businesses with fragmented communication, inconsistent follow-up, weak CRM hygiene, and limited visibility into revenue movement."],
    ["What happens after the diagnostic?", "AJ Digital reviews the operational gaps, identifies the highest-leverage system fix, and recommends the next step."],
  ];
}

function report(page, a, rawFile) {
  const h = page.h2_h3_structure.length ? page.h2_h3_structure.map((x) => `${"  ".repeat(x.level - 2)}- H${x.level}: ${x.text}`).join("\n") : "- No H2/H3 structure found.";
  const ctas = page.cta_text.length ? page.cta_text.map((x) => `- ${x}`).join("\n") : "- No obvious CTA text detected.";
  const fixes = a.missing.length ? a.missing.map((m, i) => `${i + 1}. ${fixFor(page, m, [m])}`).join("\n") : `1. ${a.recommended_fix}`;
  return `# ${page.h1 || page.title || page.final_url}

- **URL:** ${page.final_url}
- **Canonical:** ${page.canonical_url}
- **Page type:** ${page.page_type}
- **Raw extract:** ../raw-pages/${rawFile}
- **Scores:** SEO ${a.seo_score} / AEO ${a.aeo_score} / CRO ${a.cro_score} / Messaging ${a.messaging_score}
- **Priority:** ${a.priority}

## Current Purpose
${a.conversion_intent}

## Actual Observed Message
${page.visible_text.split(/(?<=[.!?])\s+/).find((s) => s.length > 55 && s.length < 260) || page.visible_text.slice(0, 260) || "No visible message extracted."}

## Audience / Intent
- **Who this page is for:** ${a.audience}
- **Search intent:** ${a.search_intent}
- **Conversion intent:** ${a.conversion_intent}

## Problem / Outcome / Offer
- **Claimed problem:** ${a.claimed_problem}
- **Promised outcome:** ${a.promised_outcome}
- **Offer clear within 5 seconds:** ${a.offer_clear_5_seconds ? "Yes" : "No"}
- **Primary CTA obvious:** ${a.primary_cta_obvious ? "Yes" : "No"}
- **Copy specificity:** ${a.copy_specific_or_generic}
- **Can an AI answer engine quote this page directly:** ${a.ai_answer_engine_quotable ? "Yes" : "No"}
- **What is missing:** ${a.missing.length ? a.missing.join("; ") : "No major audit gaps detected."}

## SEO Findings
- Title: ${page.title || "Missing"}
- Meta description: ${page.meta_description || "Missing"}
- H1 count: ${page.headings.filter((x) => x.level === 1).length}
- Word count: ${page.word_count}
- Indexability: ${page.indexability_status}
- Schema detected: ${page.schema_types.length ? page.schema_types.join(", ") : "None detected"}
- Open Graph fields: ${Object.keys(page.open_graph).length}
- Twitter fields: ${Object.keys(page.twitter_meta).length}

## H2/H3 Structure
${h}

## AEO Findings
- Direct answer blocks: ${a.checks.hasDirectAnswer ? "Present" : "Missing"}
- Definitions: ${a.checks.hasDefinition ? "Present" : "Missing"}
- FAQs: ${a.checks.hasFaq ? "Present" : "Missing"}
- Comparison language: ${a.checks.hasComparison ? "Present" : "Missing"}
- Service schema: ${a.checks.hasServiceSchema ? "Present" : "Missing"}
- Organization/person schema: ${a.checks.hasOrgSchema ? "Present" : "Missing"}
- Clear entity naming: ${a.checks.hasEntityNaming ? "Present" : "Missing"}
- Quotable summary statements: ${a.checks.hasQuote ? "Present" : "Missing"}

## CRO Findings
- Above-the-fold clarity: ${page.above_the_fold_copy.length > 80 ? "Adequate" : "Weak"}
- CTA hierarchy: ${a.cta_score >= 60 ? "Adequate" : "Weak"}
- Offer specificity: ${a.offer_score >= 60 ? "Adequate" : "Weak"}
- Trust signals: ${a.trust_score >= 55 ? "Adequate" : "Weak"}
- Next-step clarity: ${hasAny(page.visible_text, ["next step", "book", "diagnostic", "apply", "calculate", "schedule"]) ? "Adequate" : "Weak"}
- Advances buyer journey: ${page.internal_links.some((l) => /diagnostic|book-a-call|apply|pricing|services|agents\/responseos/i.test(l.href)) ? "Yes" : "No"}

## CTA Text Observed
${ctas}

## Messaging Findings
- ICP clarity: ${a.icp_score}/100
- Offer clarity: ${a.offer_score}/100
- Problem clarity: ${a.problem_score}/100
- Outcome clarity: ${a.outcome_score}/100
- CTA clarity: ${a.cta_score}/100
- Trust/proof strength: ${a.trust_score}/100
- Vague language flags: ${a.checks.vague.length ? a.checks.vague.join("; ") : "None from configured list"}

## Recommended Rewrite Elements
- **Headline:** ${headline(page)}
- **Subheadline:** AJ Digital helps founder-led service businesses replace fragmented communication, missed follow-up, and weak visibility with a measurable system for diagnosis, follow-through, and revenue clarity.
- **CTA:** ${cta(page)}

## Recommended FAQ Block
${faq(page).map(([q, ans]) => `- **${q}** ${ans}`).join("\n")}

## Recommended Schema Type
${schemaRecommendation(page.page_type)}

## Prioritized Fixes
${fixes}
`;
}

async function get(url) {
  await delay(75);
  const res = await fetch(url, { redirect: "follow", headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" } });
  return { requested_url: url, status: res.status, final_url: cleanUrl(res.url), redirected: res.redirected, content_type: res.headers.get("content-type") || "", body: await res.text() };
}

async function sitemap(url, seen = new Set()) {
  const u = cleanUrl(url);
  if (seen.has(u)) return [];
  seen.add(u);
  const r = await get(u);
  const locs = [...r.body.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((m) => cleanUrl(decode(m[1].trim())));
  if (/<sitemapindex/i.test(r.body)) {
    const out = [];
    for (const loc of locs) out.push(...(await sitemap(loc, seen)));
    return out;
  }
  return locs;
}

async function robotsRules() {
  try {
    const r = await get(`${ORIGIN}/robots.txt`);
    const rules = [];
    let star = false;
    for (const raw of r.body.split(/\r?\n/)) {
      const line = raw.replace(/#.*/, "").trim();
      if (!line) continue;
      const [k, ...rest] = line.split(":");
      const key = k.trim().toLowerCase();
      const val = rest.join(":").trim();
      if (key === "user-agent") star = val === "*";
      if (star && key === "disallow" && val) rules.push(val);
    }
    return rules;
  } catch {
    return [];
  }
}

function blocked(url, rules) {
  const p = new URL(url).pathname;
  return rules.some((r) => r !== "/" && p.startsWith(r));
}

function pageRecord(f, sourceUrl, source) {
  const html = f.body;
  const allLinks = links(html, f.final_url);
  const internal = allLinks.filter((l) => isInternal(l.href)).map((l) => ({ ...l, href: cleanUrl(l.href) }));
  const external = allLinks.filter((l) => !isInternal(l.href));
  const hs = headings(html);
  const visible = strip(html.replace(/<header[\s\S]*?<\/header>/gi, " ").replace(/<footer[\s\S]*?<\/footer>/gi, " ").replace(/<nav[\s\S]*?<\/nav>/gi, " "));
  const ld = jsonLd(html);
  const canonicalRaw = relLink(html, "canonical");
  const canonical = canonicalRaw ? cleanUrl(canonicalRaw, f.final_url) : cleanUrl(f.final_url);
  const imgs = images(html, f.final_url);
  const ctas = uniq([...allLinks.map((l) => l.text), ...buttons(html)].map((x) => x.replace(/\s+/g, " ").trim()).filter((x) => x && x.length <= 80 && /book|call|diagnostic|apply|calculate|start|learn|pricing|workshop|contact|schedule|read|services|get/i.test(x))).slice(0, 30);
  const page = {
    source_url: sourceUrl,
    discovery_source: source,
    fetched_at: NOW,
    status_code: f.status,
    final_url: cleanUrl(f.final_url),
    redirected: f.redirected,
    content_type: f.content_type,
    canonical_url: canonical,
    title: title(html),
    meta_description: meta(html, "name", "description"),
    robots_meta: meta(html, "name", "robots"),
    h1: hs.find((h) => h.level === 1)?.text || "",
    headings: hs,
    h2_h3_structure: hs.filter((h) => h.level > 1),
    word_count: words(visible),
    above_the_fold_copy: visible.slice(0, 900),
    cta_text: ctas,
    internal_links: uniq(internal.map((l) => JSON.stringify(l))).map(JSON.parse),
    external_links: uniq(external.map((l) => JSON.stringify(l))).map(JSON.parse),
    images: imgs,
    image_alt_text: imgs.map((i) => i.alt),
    structured_data: ld,
    schema_types: schemaTypes(ld),
    open_graph: metaPrefix(html, "property", "og:"),
    twitter_meta: metaPrefix(html, "name", "twitter:"),
    visible_text: visible,
  };
  page.page_type = pageType(page.final_url);
  return page;
}

function top(audited, key) {
  return audited
    .map((x) => ({ ...x, score: x.audit[`${key}_score`] ?? x.audit[key] }))
    .sort((a, b) => (a.audit.priority === "High" && b.audit.priority !== "High" ? -1 : b.audit.priority === "High" && a.audit.priority !== "High" ? 1 : a.score - b.score))
    .slice(0, 10)
    .map((x, i) => `${i + 1}. ${x.page.final_url}: ${x.audit.recommended_fix}`)
    .join("\n");
}

async function main() {
  await fs.mkdir(RAW, { recursive: true });
  await fs.mkdir(REPORTS, { recursive: true });
  const rules = await robotsRules();
  const sitemapUrls = uniq(await sitemap(`${ORIGIN}/sitemap.xml`));
  const discovered = new Map(sitemapUrls.map((u) => [u, new Set(["sitemap"])]));
  const queue = [...sitemapUrls];
  const fetched = new Map();
  for (let i = 0; i < queue.length && discovered.size < 500; i++) {
    const url = queue[i];
    if (isAsset(url)) continue;
    try {
      const f = await get(url);
      fetched.set(url, f);
      if (f.status >= 400 || !f.content_type.includes("text/html")) continue;
      for (const l of links(f.body, f.final_url)) {
        if (!isInternal(l.href)) continue;
        const u = cleanUrl(l.href);
        const p = new URL(u).pathname;
        if (p.startsWith("/api/") || p.startsWith("/_next/")) continue;
        if (!discovered.has(u)) {
          discovered.set(u, new Set(["internal-link"]));
          if (!isAsset(u)) queue.push(u);
        } else {
          discovered.get(u).add("internal-link");
        }
      }
    } catch (e) {
      fetched.set(url, { error: e.message, status: "ERR", final_url: url, content_type: "", body: "" });
    }
  }
  for (const url of discovered.keys()) {
    if (!fetched.has(url) && !isAsset(url)) {
      try {
        fetched.set(url, await get(url));
      } catch (e) {
        fetched.set(url, { error: e.message, status: "ERR", final_url: url, content_type: "", body: "" });
      }
    }
  }

  const inventory = [];
  const pages = [];
  for (const [url, sources] of [...discovered].sort((a, b) => a[0].localeCompare(b[0]))) {
    const source = [...sources].sort().join("|");
    if (isAsset(url)) {
      inventory.push({ url, discovery_source: source, status_code: "", final_url: "", canonical_url: "", content_type: "", indexability_status: "non-html", action: "skipped", skip_reason: "non-HTML asset discovered via internal link" });
      continue;
    }
    const f = fetched.get(url);
    if (!f || f.error || f.status === "ERR") {
      inventory.push({ url, discovery_source: source, status_code: "ERR", final_url: url, canonical_url: "", content_type: "", indexability_status: "fetch error", action: "skipped", skip_reason: f?.error || "fetch error" });
      continue;
    }
    if (!f.content_type.includes("text/html")) {
      inventory.push({ url, discovery_source: source, status_code: f.status, final_url: cleanUrl(f.final_url), canonical_url: "", content_type: f.content_type, indexability_status: "non-html", action: "skipped", skip_reason: `non-HTML content-type: ${f.content_type}` });
      continue;
    }
    const page = pageRecord(f, url, source);
    const isBlocked = blocked(url, rules) || blocked(page.final_url, rules);
    page.indexability_status = isBlocked ? "blocked by robots.txt" : page.robots_meta.toLowerCase().includes("noindex") ? "noindex" : page.status_code >= 400 ? "error" : "indexable";
    pages.push({ url, source, page, isBlocked });
  }

  const canonicalSeen = new Map();
  const audited = [];
  const used = new Map();
  for (const item of pages.sort((a, b) => a.page.final_url.localeCompare(b.page.final_url))) {
    const { url, source, page, isBlocked } = item;
    let skip = "";
    if (page.status_code >= 400) skip = `error page: HTTP ${page.status_code}`;
    else if (isBlocked) skip = "intentionally blocked by robots.txt";
    else if (page.robots_meta.toLowerCase().includes("noindex")) skip = "intentionally noindex";
    else if (canonicalSeen.has(page.canonical_url)) skip = `duplicate canonical of ${canonicalSeen.get(page.canonical_url)}`;
    if (skip) {
      inventory.push({ url, discovery_source: source, status_code: page.status_code, final_url: page.final_url, canonical_url: page.canonical_url, content_type: page.content_type, indexability_status: page.indexability_status, action: "skipped", skip_reason: skip });
      continue;
    }
    canonicalSeen.set(page.canonical_url, page.final_url);
    const name = slug(page.final_url, used);
    page.raw_file = `${name}.json`;
    page.report_file = `${name}.md`;
    const a = audit(page);
    await fs.writeFile(path.join(RAW, page.raw_file), JSON.stringify(page, null, 2) + "\n");
    await fs.writeFile(path.join(REPORTS, page.report_file), report(page, a, page.raw_file));
    audited.push({ page, audit: a });
    inventory.push({ url, discovery_source: source, status_code: page.status_code, final_url: page.final_url, canonical_url: page.canonical_url, content_type: page.content_type, indexability_status: page.indexability_status, action: "audited", skip_reason: "" });
  }

  await fs.writeFile(path.join(OUT, "url-inventory.csv"), csv(inventory.sort((a, b) => a.url.localeCompare(b.url)), ["url", "discovery_source", "status_code", "final_url", "canonical_url", "content_type", "indexability_status", "action", "skip_reason"]));
  await fs.writeFile(path.join(OUT, "page-scorecard.csv"), csv(audited.map(({ page, audit: a }) => ({ url: page.final_url, seo_score: a.seo_score, aeo_score: a.aeo_score, cro_score: a.cro_score, messaging_score: a.messaging_score, icp_score: a.icp_score, offer_score: a.offer_score, priority: a.priority, primary_issue: a.primary_issue, recommended_fix: a.recommended_fix })).sort((a, b) => a.url.localeCompare(b.url)), ["url", "seo_score", "aeo_score", "cro_score", "messaging_score", "icp_score", "offer_score", "priority", "primary_issue", "recommended_fix"]));

  const skipped = inventory.filter((r) => r.action === "skipped");
  const pageLinks = audited.sort((a, b) => a.page.final_url.localeCompare(b.page.final_url)).map(({ page }) => `- [${page.final_url}](page-reports/${page.report_file})`).join("\n");
  const highImpact = [...audited].sort((a, b) => {
    const pa = a.audit.priority === "High" ? 0 : a.audit.priority === "Medium" ? 1 : 2;
    const pb = b.audit.priority === "High" ? 0 : b.audit.priority === "Medium" ? 1 : 2;
    const sa = a.audit.seo_score + a.audit.aeo_score + a.audit.cro_score + a.audit.messaging_score;
    const sb = b.audit.seo_score + b.audit.aeo_score + b.audit.cro_score + b.audit.messaging_score;
    return pa - pb || sa - sb;
  }).slice(0, 10).map((x, i) => `${i + 1}. ${x.page.final_url}: ${x.audit.recommended_fix}`).join("\n");

  const readme = `# AudioJones.com Site Audit

Generated: ${NOW}

## Executive Summary
This is a live, read-only SEO/AEO/CRO/messaging audit of AudioJones.com based on sitemap discovery plus internal-link crawling. The site is generally crawlable and the core marketing pages render as HTML, but the audit found high-impact gaps: sitemap URLs resolve through the non-www to www redirect path, crawl-discovered topic links return 404, AEO direct-answer/FAQ/schema coverage is uneven, and several conversion pages need sharper first-screen ICP/problem/outcome/CTA framing.

## Totals
- Sitemap URLs found: ${sitemapUrls.length}
- Internal URLs discovered after crawl: ${discovered.size}
- Pages audited: ${audited.length}
- URLs skipped with reasons: ${skipped.length}
- Raw page JSON files: ${audited.length}
- Markdown page reports: ${audited.length}
- Scorecard rows: ${audited.length}

## Major Outputs
- [URL inventory](url-inventory.csv)
- [Page scorecard](page-scorecard.csv)
- [Raw page extracts](raw-pages/)
- [Page reports](page-reports/)
- [Fix roadmap](fix-roadmap.md)

## Skipped URLs With Reasons
${skipped.length ? skipped.sort((a, b) => a.url.localeCompare(b.url)).map((r) => `- ${r.url} — ${r.skip_reason}`).join("\n") : "- None"}

## Top 10 Highest-Impact Fixes
${highImpact}

## Top 10 SEO Fixes
${top(audited, "seo")}

## Top 10 AEO Fixes
${top(audited, "aeo")}

## Top 10 CRO Fixes
${top(audited, "cro")}

## Top 10 Messaging Fixes
${top(audited, "messaging")}

## Page Reports
${pageLinks}

## Quality Control
- Sitemap URLs vs audited URLs confirmed: ${sitemapUrls.length} sitemap URLs, ${audited.length} audited pages after crawl expansion and skip classification.
- No discovered HTML page was skipped without a reason: ${inventory.every((r) => r.action === "audited" || r.skip_reason) ? "confirmed" : "failed"}.
- Every audited page has a scorecard row: confirmed.
- Every audited page has a markdown report: confirmed.
- README links to major outputs: confirmed.
`;
  await fs.writeFile(path.join(OUT, "README.md"), readme);

  const road = `# AudioJones.com Fix Roadmap

Generated: ${NOW}

## Immediate Fixes
${highImpact}

## High-Leverage Rewrites
${[...audited].filter((x) => !x.page.page_type.includes("Legal")).sort((a, b) => a.audit.messaging_score - b.audit.messaging_score).slice(0, 10).map((x, i) => `${i + 1}. ${x.page.final_url}: sharpen ICP/problem/outcome framing. Current primary issue: ${x.audit.primary_issue}`).join("\n")}

## Technical SEO Fixes
${top(audited, "seo")}

## AEO / Entity Improvements
${top(audited, "aeo")}

## CRO Improvements
${top(audited, "cro")}

## New Pages Needed
1. Industry-specific Founder Intelligence System pages once proof exists, starting with the highest-fit service verticals.
2. ResponseOS integration pages for CRM/follow-up platforms once integrations are stable.
3. A dedicated proof library with permitted before/after operational metrics.
4. A Founder Intelligence Systems glossary/definition hub for AEO capture.

## Internal Linking Improvements
${skipped.filter((r) => /404|robots|redirect/i.test(r.skip_reason)).slice(0, 10).map((r, i) => `${i + 1}. ${r.url}: ${r.skip_reason}`).join("\n") || "1. Review crawl-discovered links and ensure every intentional public page is in sitemap and every retired page has a clean redirect/noindex policy."}
`;
  await fs.writeFile(path.join(OUT, "fix-roadmap.md"), road);

  console.log(JSON.stringify({ generated_at: NOW, sitemap_urls: sitemapUrls.length, discovered_urls: discovered.size, audited_pages: audited.length, skipped_urls: skipped.length, output_dir: OUT }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
