# Prana dashboard UI/UX audit

## Executive assessment

The current application exposes useful reporting data, but behaves like a collection of individual reports rather than a daily business workspace. Its strongest foundation is the clear sales/purchase split and reliable drill-down routes. Its main usability risk is that every metric, chart, and report is presented with nearly equal emphasis, so users must interpret the page before they can act.

The redesign uses one hierarchy across the product:

1. Business position and primary KPIs
2. Changes, risks, and next actions
3. Explanatory charts
4. Searchable, sortable transaction detail

## Findings and design response

| Area | Existing issue | User impact | Redesign response |
| --- | --- | --- | --- |
| Information architecture | Report names and nested labels expose the implementation model (for example, “party-wise summary”) | Users must translate accounting/report terminology into tasks | Navigation is grouped by Overview, Sales, Purchases, and Money due with plain-language labels |
| Visual hierarchy | KPI cards use the same size, container, and weight | Business health is not understandable in five seconds | Primary revenue/position metrics receive stronger type; risk and supporting metrics use restrained semantic treatments |
| Filters | Company and financial-year controls sit in a loose row above every page | Filters feel detached from the data they affect and consume vertical space | Controls move into a persistent workspace toolbar with explicit labels and status |
| Outstanding | Balances lack urgency, age, search, and follow-up cues | Users can see money due but cannot quickly decide whom to chase first | Add priority summary, invoice-age bands, search, urgency filters, sorting, and direct ledger drill-down |
| Tables | Most tables have no search, inconsistent row height, click-only headers, and no sticky header | Slow scanning, poor keyboard discoverability, and friction on long lists | Shared table treatment, real buttons for sorting, sticky headers, right-aligned figures, hover/focus states, and responsive cards |
| Charts | Charts are visually separated from the question they answer | Users see graphics but not why they matter | Titles and descriptions state the business question; category counts are deliberately limited |
| Loading | Full-screen spinner cards replace the complete page | Layout jumps and users lose system context | In-page skeletons preserve the shell and communicate what is loading |
| Errors | Generic red text and “Retry” omit recovery context | Users cannot distinguish a data issue from a lost session or filter issue | Calm in-context error state explains that filters are preserved and offers a clear retry action |
| Empty states | Empty copy reports absence but gives no next step | Users reach a dead end | Empty states explain whether filters or data availability are responsible and suggest recovery |
| Mobile | Desktop filters and tables are mainly shrunk or hidden | Core data is usable but primary actions and context are fragmented | Sidebar becomes a drawer, controls remain reachable, KPI hierarchy stacks, and tables become labeled records |
| Accessibility | Focus treatment is inconsistent; some clickable table headers are not buttons; small text is overused | Keyboard and low-vision users lose location and meaning | Global visible focus, 44px control targets, explicit labels, semantic buttons, non-color urgency labels, and higher muted-text contrast |
| Consistency | `gray`/`slate`, blue/teal, several radii, and multiple card recipes are mixed | The product feels assembled screen by screen | One token-driven palette, spacing rhythm, radius scale, surface treatment, and numeric typography |
| Forms and auth | Auth forms are long and visually separate from dashboard styling | Higher cognitive load and weaker trust continuity | Global tokens unify typography, inputs, buttons, feedback, and focus states; field structure remains intact to avoid changing validation behavior |
| Feedback | Logout uses a blocking browser alert and several controls lack pressed/busy feedback | Interruption and uncertain system status | Shell provides restrained live status patterns; destructive/async flows should use inline toast/dialog patterns in the next functional iteration |

## Screen-level notes

- Business overview: purchase totals were absent even though the application already has purchase data. The redesign includes them and makes the receivable–payable position explicit.
- Sales and purchase summaries: strong base data, but gross, returns, net, invoices, and payment days were indistinguishable in importance. Net activity is now the anchor metric.
- Item summaries and item details: sortable detail is useful; sort interaction needs semantic buttons and an explicit empty state.
- Party details: drill-down is valuable, but opening every detail link in a new tab was unexpected. Existing behavior is retained for workflow continuity, with clearer link affordance.
- Outstanding: highest-value redesign area. The invoice date is available but contractual due dates are not, so the UI deliberately labels its buckets as **invoice age**, not “overdue,” to avoid making a false accounting claim.
- Data connection: information-dense setup is a distinct administrative workflow. It inherits the shared typography, controls, focus, and surfaces without changing credential or sync logic.
- Marketing and authentication: already structurally clear. Shared tokens remove the blue/teal inconsistency and improve focus, input, and type rendering.

## Product constraints and follow-ups

The API currently does not expose contractual due dates, payment terms, reminders, customer phone numbers, product categories, salespeople, branch/location, bank balances, gross profit, or targets. The interface must not fabricate them. Recommended backend additions are:

- `dueDate`, `creditTerms`, and reminder history for true overdue workflows
- customer/supplier contact methods for call and reminder actions
- ledger/bank balances and payment transactions for cash position
- cost-of-goods data for gross profit
- user roles and permissions for role-specific defaults
- saved filters/views and a server-backed global entity search

## Success criteria

- An owner can identify net sales, purchases, receivables, payables, and net working position without scrolling.
- A collections user can find a party or invoice and identify the oldest balances in two interactions or fewer.
- All primary controls are keyboard reachable with visible focus.
- Tables remain useful at 375px, 768px, 1280px, and larger widths.
- Empty, loading, and error states preserve context and always provide a next step.

