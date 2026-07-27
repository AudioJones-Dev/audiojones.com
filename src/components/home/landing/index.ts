// Barrel file for homepage landing components.
//
// Scope: exports only the components currently
// imported by src/app/page.tsx. Other landing components on this branch
// (TrustedByStrip, ProblemReframeSplit, AgentSystemsOverview, etc.) are
// preserved on disk but intentionally not re-exported here — they were
// reduced out of the v1 redesign or staged for a later phase. Add an
// export back here only when src/app/page.tsx (or another consumer)
// actually imports the component.
//
// SignalSceneSection (Spline-based) was intentionally removed from the
// codebase in this PR — do not re-export it.

export { default as HeroAllSignal } from "./HeroAllSignal";
export {
  ProblemFramingSection,
  CapabilitiesSection,
  CommercialPathSection,
  TrustSection,
} from "./RI001Sections";
export { default as SystemModelLoop } from "./SystemModelLoop";
export { default as ResponseOSWedge } from "./ResponseOSWedge";
export { default as ProcessPipeline } from "./ProcessPipeline";
export { default as DiagnosticCTA } from "./DiagnosticCTA";
