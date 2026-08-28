# Prana production UI/UX review — second pass

## Review posture

This review treats the existing redesign as another designer’s production candidate. The standard is daily professional use with large accounting datasets, not a polished presentation screenshot.

## System-level findings

| Severity | Finding | Why it fails in production | Correction |
| --- | --- | --- | --- |
| Critical | Several charts render every item or party with angled labels | Real datasets turn the chart into an unreadable wall and increase page height indefinitely | Cap visual rankings at ten, aggregate the remainder where useful, and keep full precision in searchable tables |
| Critical | Value and quantity are combined on dual-axis charts | Dual axes invite false correlation; customer item quantity can combine incompatible units | Chart monetary contribution only; retain quantities in registers where units are explicit |
| High | “Purchase/Sales mix by unit of measure” treats kg, pieces, and metres as comparable business categories | Units are measurement systems, not a meaningful revenue segmentation | Remove the donut entirely |
| High | KPI summaries are collections of separate bordered cards | Repeated borders, shadows, and gaps fragment one conceptual summary and waste vertical space | Group KPIs in a single surface with internal dividers and one dominant metric |
| High | The business overview repeats outstanding amounts in a large dark “morning focus” card and shows static data-coverage education every day | Repetition pushes actionable detail below the fold; onboarding content becomes permanent clutter | Replace with a compact action queue and remove data-coverage education from the daily surface |
| High | Item and item-transaction registers can render the full dataset | Slow scanning and DOM growth on real accounting histories | Add search, pagination, sticky headers, and responsive record cards |
| High | Sales/purchase summary stacks tax detail, monthly trend, net-by-party chart, returns chart, and a party table | Excessive scroll and repeated party information delay the register | Keep one trend chart and one top-party ranking; collapse tax detail; remove the secondary returns chart |
| High | Sidebar core reports sit behind accordions | A frequent report can require two clicks and collapsed state hides available destinations | Keep the six core report destinations visible whenever the full sidebar is open |
| Medium | “Party” language leaks internal accounting terminology into primary UI | New or occasional users must translate it to customer/supplier | Use customer/supplier in headings and keep party only where it is established source terminology |
| Medium | Some drill-down links unexpectedly open a new tab | Breaks browser history expectations and produces tab clutter in repeated review workflows | Navigate within the workspace by default |
| Medium | Dates use numeric `DD/MM/YYYY` | Dense tables are slower to scan and dates can be misread by mixed-locale teams | Use `28 Aug 2026` formatting |
| Medium | Search/sort/filter controls use inconsistent dimensions and locations | Users relearn each table and alignment drifts | Use 40–44px controls in the table header, with search left and sort/filter right |
| Medium | Transaction badges expose raw codes without explaining them | `SR`, `PR`, and other codes require recall | Keep the code for auditability but pair it with accessible Sale/Purchase/Return meaning |
| Medium | Exact currency is often repeated directly under compact currency | This creates visual noise without adding hierarchy | Show compact currency in KPI summaries and exact values on hover/detail or in registers |
| Medium | Loading skeleton always reserves a large chart | Some pages do not contain a chart and the state is visually oversized | Use a compact summary-plus-table skeleton that fits all report types |
| Medium | Registration ends with a blocking browser alert | It interrupts flow, is not style-consistent, and gives no durable next step | Replace with an in-product success state and explicit email-verification action |
| Medium | Data connection is a long conditional form without a visible overall sequence | Users cannot predict remaining work | Add a three-step progress indicator tied to credential and company state |
| Low | Green is used for all gross activity and red for all returns | Gross sales are neutral business activity; returns are not always an emergency | Reserve semantic color for status/risk; use neutral ink for standard financial values |
| Low | Several components mix `gray` and `slate`, rings and borders, and 12/14/16px radii | Small inconsistencies accumulate into visual noise | Consolidate on slate tokens, 14px surfaces, and border-based elevation |

## Route-level decisions

### Business overview

- Keep: net sales, net purchases, receivables, payables, net working position.
- Compress: collections/payables actions into a short queue.
- Remove: permanent data-coverage panel and invented bank placeholders.

### Sales and purchase performance

- Keep: net, gross, returns, invoice count, debtor/creditor days.
- Keep: one monthly trend and one top customer/supplier comparison.
- Collapse: tax-head detail.
- Remove: second customer returns chart; returns remain exact in the register.

### Outstanding

- Keep: outstanding total, 90+ amount, oldest invoice, payment timing, age composition, top balances, work queue.
- Keep invoice-age wording because contractual due dates are not available.
- Do not add reminder, calling, or payment-write actions until the backend supports them.

### Item summaries

- Keep: total value, item count, top item, top-ten value ranking, full register.
- Remove: unit-of-measure donut.
- Add: register search and pagination.

### Customer/supplier detail

- Keep: net activity, outstanding, invoices, payment time, transactions.
- Replace dual-axis item chart with top-item value ranking.
- Preserve full item quantity detail in the transaction register.

### Item detail

- Keep: net activity, returns, quantity, party contribution, transactions.
- Replace dual-axis party chart with top-party value ranking.
- Add transaction search and pagination.

### Authentication and connection

- Preserve backend-required fields.
- Reduce unsupported trust decoration, group registration fields semantically, replace alert feedback, and expose setup progress.

## Data and action constraints

True overdue status, reminders, phone actions, recording payments, payment status, categories, branches, gross profit, bank balance, targets, permissions, and saved views cannot be designed as working actions without corresponding data and endpoints. The interface should expose those only after the product can complete the workflow.

## Density rules applied

- One KPI surface per summary, not one surface per number.
- Maximum ten categories in a chart.
- One explanatory visualization before a precise register.
- Search and pagination for unbounded entity or transaction lists.
- Tables use tabular figures, right-aligned money and quantities, sticky headers, and readable dates.
- Mobile replaces wide tables with labeled records; it does not merely hide columns.

