# Homepage principal UI/UX audit

## Context and conversion objective

Assumption: approximately 500 new prospective customers arrive each day. At that volume, the homepage is an acquisition funnel. Its job is to help a qualified visitor answer four questions quickly:

1. What is this?
2. Is it for a business like mine?
3. What useful outcome will I get?
4. What is the safest next step?

The primary conversion is **open the synthetic product demo**. This is lower commitment than registration and gives the product a chance to prove itself. The secondary conversion is **create a workspace**. Sign-in is a utility action for existing customers.

## Friction inventory

| Journey stage | Friction | Why it matters at 500 new visitors/day | Redesign decision |
| --- | --- | --- | --- |
| Page discovery | Browser title is “dashboard-frontend”; there is no meaningful meta description | Weak search snippet, low trust, and poor tab recognition | Add product-specific title, description, theme color, and social metadata |
| First five seconds | “Know what your business is saying…” is evocative but does not name the product category or core task | Visitors must infer whether Prana is accounting software, analytics, consulting, or banking | Lead with sales, purchases, and outstanding payments in plain language |
| Audience fit | No explicit signal for owners, accountants, sales teams, or purchase teams | Qualified visitors cannot self-identify quickly | Add role-based use cases without inventing customer testimonials |
| CTA hierarchy | Signup is primary, sign-in is secondary, and the demo is a small tertiary text link | New visitors are asked for commitment before receiving proof | Make the no-login synthetic demo primary and workspace creation secondary |
| CTA language | “Start with Prana” does not describe what happens next | Creates uncertainty and weakens click confidence | Use destination-specific labels: “Explore the live demo” and “Create a workspace” |
| CTA repetition | The page has only one conversion moment near the top | Visitors who need more context reach the end with no next step | Repeat a contextual conversion block after objections are answered |
| Product comprehension | The hero visual says “Business pulse” and “live view” but is static synthetic data | Risks a trust break and does not demonstrate the actual information architecture | Present an explicitly illustrative product preview matching the real overview and receivables screens |
| Product value | Three feature cards use broad outcomes (“whole picture”, “confidence”) | Benefits overlap and do not answer concrete business questions | Organize value around revenue performance, receivable risk, and supplier commitments |
| Trust | No testimonials, customer logos, product facts, setup explanation, or transparent demo labeling | Visitors have no evidence beyond brand copy | Use product-led proof, truthful capability facts, clear synthetic-data labeling, and a transparent setup sequence |
| Claims | “Track cash flow” is stronger than the current data coverage, which lacks bank/ledger movement | Overpromising damages trust after signup | Limit claims to implemented sales, purchase, party, invoice, return, and outstanding reporting |
| Setup anxiety | No explanation of how data reaches Prana | Integration uncertainty becomes a silent exit reason | Show the three-step path: create workspace, connect accounting computer, review dashboards |
| Objections | No answers about multiple companies, demo data, product scope, or whether Prana replaces accounting software | High-intent visitors must leave the page or guess | Add a concise native FAQ with truthful answers |
| Navigation | Header contains only the logo and account actions | Visitors cannot jump to product detail or setup explanation | Add Product, Outcomes, and How it works anchors on desktop |
| Existing customers | Authenticated header offers only “Logout” | A returning user cannot resume the product from the homepage | Add “Open dashboard” as the primary returning-user action |
| Content depth | Page ends immediately after three generic cards | The page is too shallow for considered B2B evaluation | Add business questions, product preview, role fit, setup, FAQ, and final CTA |
| Mobile scanning | Hero consumes substantial vertical space before proof; all CTAs stack without hierarchy context | Mobile users see claims before evidence and may not discover the demo | Tighten spacing, keep touch targets at least 44px, put the demo first, and surface product proof immediately |
| Accessibility | No skip link; chart relies heavily on visual encoding; page landmarks are minimal | Keyboard and assistive-technology users receive a weaker journey | Add skip navigation, semantic headings/sections, text alternatives, visible focus, and non-color labels |
| Performance | Recharts is loaded for a decorative homepage preview; every dashboard/auth screen is statically included in the initial route bundle | Slower first render and more abandonment, especially on mobile networks | Replace the preview with lightweight HTML/SVG and lazy-load all non-home routes |
| Measurement | No analytics events or funnel instrumentation | At 500 visitors/day, decisions cannot be based on conversion evidence | Define an event plan below; implementation awaits the analytics provider and consent model |

## Redesign hierarchy

1. Specific positioning and demo-first CTA
2. Immediate product preview and truthful synthetic-data label
3. Concrete business questions Prana answers
4. Detailed product proof
5. Role fit
6. Transparent three-step setup
7. FAQ and objection handling
8. Final CTA

## Recommended measurement plan

No analytics SDK is currently configured, so the redesign does not silently introduce tracking. When a consent and analytics provider are selected, capture:

- `homepage_view`
- `hero_demo_click`
- `hero_workspace_click`
- `nav_demo_click`
- `product_demo_click`
- `faq_open` with question identifier
- `final_demo_click`
- `final_workspace_click`
- demo-to-registration conversion
- registration completion and data-connection completion

Segment by device, acquisition source, new/returning visitor, and landing-page experiment. The first experiment should test **demo-first** versus **workspace-first**, using completed registration—not clicks alone—as the decision metric.

## Guardrails

- Do not invent customer counts, testimonials, security certifications, time-to-value, or savings claims.
- Do not call static example data “live customer data.”
- Do not claim bank cash flow, profit, reminders, or write-back automation until those capabilities exist.
- Keep one dominant CTA per viewport and make every CTA label describe its destination.

