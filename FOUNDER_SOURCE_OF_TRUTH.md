# Agent Air Direct Founder Source of Truth

**Document status:** Founder Approved  
**Founder:** Lisa Silva  
**Approved version:** 1.0  
**Approved date:** August 11, 2026  
**Approval status:** Founder approved by Lisa Silva

## Purpose of this document

This document records the founder's governing vision for Agent Air Direct. It exists so that developers, AI systems, contractors, partners, and future team members build one connected product instead of interpreting individual modules in isolation.

The present codebase does not yet implement every capability described here. This document defines the intended system, the product boundaries, and the standard against which features are retained, repaired, rewritten, or removed.

Lisa Silva approved version 1.0 on August 11, 2026. Material changes to the product vision require founder review and a documented revision.

## Founder thesis

Business information is fragmented across websites, directories, booking platforms, social profiles, pricing pages, documents, and legacy systems. AI systems must reconcile these inconsistent sources before they can describe, recommend, or act for a business.

Agent Air Direct is being created to transform that fragmented information into a verified, traceable, machine-readable business identity.

The long-term objective is to provide trusted identity infrastructure that websites, platforms, AI search systems, and future business agents can consume. The product begins with AI-search auditing, but it is not limited to an audit tool or an SEO service.

The governing product statement is:

> Agent Air Direct transforms fragmented business information into a verified, machine-readable identity that websites, platforms, AI systems, and future business agents can consistently consume.

## Origin and evolution

- Lisa began working intensively with AI in 2024 and used it to turn systems previously held in her mind into working products.
- She ran her first URL audit on January 28, 2026.
- That audit led to a URL and schema-fix auditing system and then a Streamlit application.
- While prospecting individual businesses, Lisa noticed that many websites were managed by agencies identified in their footers. This revealed the opportunity to help agencies serve entire client rosters and led to Bulk Mode, AUDITUS, and AuditVoice.
- Pricing Intelligence was inspired by business owners who were concerned that customers could receive AI-generated price expectations before the owner had an opportunity to quote the work.
- The Pricing Passport concept was created to give owners a structured, first-party way to publish approved pricing information and quoting boundaries.
- Platform Profile Optimizer was created after identifying the opportunity to improve business profiles already hosted by directories, booking platforms, marketplaces, and ranking platforms.
- These layers changed the company vision from a narrow AI Search Visibility Engine into an AI business strategy and identity-infrastructure company.

## Product position

Agent Air Direct has three connected roles:

1. **AI business strategy:** Help businesses and agencies understand how business information should be prepared for an AI-mediated market.
2. **Identity infrastructure:** Gather, verify, structure, version, publish, and synchronize business facts.
3. **Agent readiness:** Equip future business agents with trusted identity, service, operational, and pricing information.

AI-search auditing is the entry point. The canonical identity system is the foundation. The future business agent is the destination.

## Branded system stages

### Identity Process

The beginning of the system. It gathers scattered information, resolves conflicts, verifies ownership and evidence, and produces one canonical Business Identity Record.

The process must distinguish:

- Publicly detected information
- Third-party information
- Owner-provided information
- Owner-confirmed information
- Independently verified information
- Missing or conflicting information
- Modeled assumptions

### The synchronization layer

The synchronization layer. When an approved business fact changes, Agent Air Direct should propagate that change to destinations it controls or is authorized to update.

“Updated everywhere” means every connected and authorized destination. It does not mean Agent Air Direct can automatically control the entire internet or independent AI platforms.

The technical system must support versioning, destination status, retries, conflict handling, approvals, revocation, and an audit trail.

### Horizon

The long-term agent layer. A business agent consumes the verified Business Identity Record and uses it to represent or assist the business within explicitly authorized boundaries.

Possible capabilities include answering questions, providing verified service and pricing information, routing inquiries, scheduling, quoting within approved rules, and coordinating business operations. Each action must be permissioned, logged, and limited by owner-approved policies.

## Trusted Business Identity Platform

Agent Air Direct will build a platform that stores and serves canonical business identities. Its credibility must come from traceability, verification, freshness, transparent rules, and reliable machine access.

The platform should eventually provide:

- A durable identity for each business
- Owner and organization verification
- Public, machine-readable identity pages
- Structured API access
- Change history and superseded values
- Field-level provenance
- Verification and confidence states
- Correction and dispute procedures
- Controlled synchronization to connected destinations
- Agent-readable services, locations, policies, actions, and pricing
- Security, privacy, tenant isolation, and access controls

The standards strategy is to build on established vocabularies and protocols where possible, including:

- Schema.org business vocabularies: <https://schema.org/LocalBusiness>
- W3C provenance vocabulary: <https://www.w3.org/TR/prov-o/>
- W3C Verifiable Credentials where appropriate: <https://www.w3.org/TR/vc-data-model-2.0/>

Agent Air Direct's innovation is the business-specific verification, synchronization, pricing-authority, platform-optimization, and agent-delivery layer built on top of recognized foundations.

## Canonical Business Identity Record

Every module must ultimately read from and write to one canonical record keyed by one stable business identity and audit context. Competing copies of the same audit or business state are not acceptable architecture.

Each business fact should be capable of recording:

- Field name and value
- Business identity
- Source URL, document, integration, or person
- Source type
- Detection method
- Observed date and time
- Verification status
- Verifier and verification method
- Owner-confirmation status
- Confidence level
- Effective date
- Expiration or review date
- Previous value
- Reason for change
- Publishing destinations
- Destination synchronization status
- Visibility and access classification

The record must never convert unknown information into an invented fact. Unknown, unavailable, conflicting, and owner-verification-required are valid states.

## Trust model

Trust is not created by storing a fact in a database. It is earned through a consistent evidence system.

The platform must maintain clear separation between:

- **Fact:** Supported by an identified source.
- **Owner assertion:** Supplied or confirmed by an authorized owner.
- **Independent verification:** Confirmed through an external or documented method.
- **Third-party observation:** Reported by a directory, review source, or platform.
- **Recommendation:** A proposed improvement, not a current fact.
- **Modeled scenario:** An illustrative calculation, not a prediction.
- **Promotional claim:** Marketing language that requires evidence.

Paid optimization must not allow a customer to purchase false verification. Commercial services and factual truth must remain distinguishable.

For recommendation queries such as “best pizza near me,” the registry can provide verified facts and evidence. It must not label a business “best” without a transparent, supportable ranking methodology. Independent AI systems remain responsible for their own selection and ranking decisions.

## Owner control and Pricing Passport

Owners should be able to control and approve the first-party information Agent Air Direct publishes on their behalf.

The Pricing Passport is the owner-approved pricing-authority layer. It may contain:

- Explicit service prices
- Price ranges
- Starting prices
- Included and excluded items
- Conditions and geographic limitations
- Quote-required services
- Expiration and review dates
- Approved refusal language when no reliable price is available

The Pricing Passport is designed to reduce ambiguity and prevent Agent Air Direct integrations from inventing or substituting prices. It cannot force an independent third-party AI system to ignore every other source or guarantee the price that system will present.

## Agency Audit-to-Close workflow

Agent Air Direct should give agencies one connected workflow rather than a collection of disconnected tools.

The intended journey is:

1. Upload or connect a client roster.
2. Validate every business and URL.
3. Run isolated audits without one failed URL terminating the batch.
4. Preserve the complete audit record for every client, not only summary scores.
5. Prioritize opportunities using verified findings.
6. Select a client and continue without re-entering information.
7. Explain findings through AUDITUS.
8. Gather and verify missing owner information.
9. Generate approved schema and profile improvements.
10. Produce AuditVoice outreach and sales materials based on actual findings.
11. Create an implementation quote.
12. Deliver branded reports.
13. Track implementation and before-versus-after evidence.
14. Maintain and synchronize the resulting business identity.

Bulk Mode must eventually support up to 50 businesses in a controlled batch. “Batch” does not require all 50 network requests to occur at the same instant. Reliability, rate limits, progress visibility, retries, and failure isolation take priority.

White-label capability must be real before it is advertised. It should include approved agency identity, logo, contact information, report styling, and clear disclosure of any required Agent Air Direct attribution.

## Platform Profile Optimization

Directories, booking platforms, ranking platforms, marketplaces, and other profile hosts may already hold thousands of fragmented business profiles. Agent Air Direct can become the infrastructure that helps those platforms normalize and improve their records.

The intended platform workflow is:

1. Ingest profiles through CSV, batch processing, or API.
2. Normalize business identity, services, locations, contact information, actions, and pricing.
3. Detect gaps, conflicts, and unsupported claims.
4. Request owner verification when required.
5. Generate improved profile language without inventing facts.
6. Produce machine-readable profile packages.
7. Return approved changes through export, API, or authorized integration.
8. Track versions, approvals, and publishing status.

Potential commercial models include per-profile processing, usage-based API fees, platform licensing, subscriptions, and revenue sharing. Commercial terms must not compromise verification integrity.

## Module responsibilities

### Signal Audit

Detect public website signals and verified gaps. It must clearly separate product errors from legitimate client findings.

### Signal Audit Bulk Mode

Run isolated audits across an agency roster and retain the complete per-client records required by every downstream module.

### Schema Intelligence

Convert verified facts and audit findings into conservative, install-ready structured data. It must identify missing required data rather than invent it.

### Platform Profile Optimizer

Normalize and improve hosted business profiles for human and machine consumption while preserving provenance and owner approval.

### AUDITUS

Explain technical findings in plain language without exaggerating risk, certainty, or platform outcomes.

### Website Trust & Readiness Review — ARCHON

Review visible public-policy, security, accessibility, and business-trust signals. It is not legal advice or a GDPR, ADA, or WCAG certification.

### Near Me Discovery Engine

Review verified local-identity, location, service-area, directory, and action-readiness signals.

### AuditVoice

Create outreach based on actual audit findings and the selected business. It must not mix client records or invent individualized claims.

### AI Identity Transformation Dashboard

Show traceable before-versus-after changes using the same canonical record as the audit and implementation modules. A dashboard must not replace measured data with a convenient fallback.

### Client Quote Calculator

Translate confirmed scope into transparent implementation pricing. It must distinguish the free audit, case-study participation pricing, selected implementation scope, and modeled value.

### Pricing Intelligence Engine and Pricing Passport

Extract and publish explicit first-party pricing while refusing unsupported price inference.

### Golden River Connect

Serve as the governed data flow between modules. It must become a real canonical-context and synchronization layer rather than a marketing label over disconnected session state.

### Product and Category Audits

Measure product capabilities against documented standards and identify absent, incomplete, or unverified functionality without fabricating success.

## Streamlit, API, registry, and agent surfaces

The product will require different delivery surfaces:

- **Streamlit:** Private human operating interface for auditing, verification, workflow, and review.
- **Partner API:** Programmatic operations for authenticated agencies and platform partners.
- **Public identity registry:** Machine-readable, crawlable, appropriately public business facts.
- **Synchronization services:** Authorized connectors, exports, and update tracking.
- **Agent runtime:** Permissioned actions based on verified identity and operational policies.

The current Streamlit application and public API are separate delivery paths. They must not be casually merged. A deliberate canonical-data contract and migration plan must precede shared production use.

## Perplexity and other independent AI platforms

Agent Air Direct should make verified business identity easy for AI systems to access. It cannot unilaterally make an independent platform designate Agent Air Direct as authoritative.

Perplexity currently documents that `PerplexityBot` is intended to surface and link websites in search results and that `Perplexity-User` may visit pages in response to user questions. Agent Air Direct should provide crawlable, high-quality identity pages, allow legitimate crawlers when appropriate, monitor access, and publish stable machine-readable records.

Official crawler guidance: <https://docs.perplexity.ai/docs/resources/perplexity-crawlers>

Citation, ranking, recommendation, partnership, or preferred-source status requires independent platform decisions. Agent Air Direct must not imply affiliation or preferred status without written authorization.

The appropriate path is:

1. Build a functioning registry and specification.
2. Demonstrate accuracy, provenance, correction, and freshness.
3. Publish reference implementations and conformance tests.
4. Measure crawler access and case-study results.
5. Earn independent platform and partner adoption.
6. Pursue formal relationships with evidence rather than aspiration alone.

## Evidence and marketing doctrine

Agent Air Direct may communicate confidently, but the strength of a claim must match the strength of its evidence.

### Capability evidence

Demonstrates that the product reliably performs a defined operation under tested conditions.

Example after validation: “Audit up to 50 client websites in one controlled batch.”

### Case-study evidence

Documents what happened for one identified implementation, including baseline, changes, timeframe, and measurement method.

Example: “In this case study, the measured foundation score changed from X to Y after the documented implementation.”

### Outcome evidence

Requires direct measurement of platform citations, inquiries, bookings, customers, or owner-confirmed revenue with appropriate attribution limits.

### Modeled scenarios

Revenue and ROI calculations must be labeled illustrative, disclose their assumptions, require owner-confirmed inputs where applicable, and never be presented as predictions or guarantees.

An earnings disclaimer supports financial disclosures but does not make an unbuilt feature or unsupported performance claim acceptable.

The product should prefer wording such as:

- Designed to
- Helps businesses
- Identifies verified gaps
- Produces machine-readable information
- Demonstrated in this case study
- May improve clarity or discoverability
- Results depend on implementation, market conditions, and independent platform behavior

It must not promise guaranteed rankings, citations, recommendations, leads, earnings, compliance certification, or universal synchronization unless that exact promise becomes demonstrably and contractually supportable.

## Case-study requirements

Case studies are part of the evidence system, not decorative testimonials.

Each case study should document:

- Starting baseline
- Business and audit identity
- Public evidence used
- Owner-confirmed inputs
- Detected gaps
- Approved implementation scope
- Exact changes implemented
- Implementation date
- Before-and-after measurements
- Observation period
- Platform citations or inquiries actually observed
- Owner-confirmed leads or revenue, if provided
- Known limitations and confounding factors
- Reproducible artifacts and reports

The current first-five case-study participation price is $997 unless the founder approves a change. The audit itself is free. Revenue projections remain blank until required owner inputs are supplied.

## Product quality doctrine

Lisa's governing rule is:

> If something is not working, we either rewrite it or terminate it.

This rule must be applied with an important distinction:

- A **client finding** is a legitimate gap detected on a business website or profile.
- A **product defect** is a crash, data leak, incorrect calculation, broken workflow, false output, or disagreement between modules.

Failed client signals can prove the audit is working. Product defects must be repaired before the affected capability is marketed or sold.

A module remains in the suite only if it:

- Contributes to the connected identity process
- Uses the canonical business and audit identity
- Preserves tenant and client isolation
- Does not invent business facts
- Produces traceable outputs
- Meets defined acceptance tests
- Has an understandable user purpose
- Can be supported responsibly

## Engineering principles

1. One canonical business identity; no silent competing records.
2. One stable audit identity across downstream modules.
3. Full provenance and owner-verification states.
4. Unknown data remains unknown.
5. No cross-client state leakage.
6. Every module has an explicit input and output contract.
7. Batch failures are isolated and recoverable.
8. Reports and dashboards use the same underlying values.
9. Implementation claims require automated and live workflow tests.
10. Security, privacy, authorization, and auditability are architectural requirements.
11. Reversible changes are preferred while product behavior is being validated.
12. Working Streamlit and API paths are not incidentally rewritten during unrelated repairs.

## Build sequence

### Foundation

- Approve this source-of-truth document.
- Define the canonical Business Identity Record and module-result contract.
- Map current state stores and remove competing identities through a planned migration.
- Establish product-level end-to-end tests.

### Agency workflow

- Test Bulk Mode exactly as an agency would use it.
- Preserve complete per-client audit results.
- Implement selection and handoff through AUDITUS, Schema Intelligence, AuditVoice, Quote, and reports.
- Add real agency branding only after its acceptance criteria are defined.

### Platform workflow

- Validate one profile through Platform Profile Optimizer.
- Add verified batch ingestion and export.
- Define partner API contracts and tenant boundaries.
- Pilot with a willing platform partner.

### Trusted-source MVP

- Publish one verified reference business identity.
- Provide public HTML, JSON-LD, and API representations.
- Add provenance, versioning, corrections, and crawler access.
- Measure access and independently observable outcomes.

### Synchronization and agent horizon

- Add authorized destination connectors and change propagation.
- Implement approval, retry, conflict, and revocation controls.
- Build limited business-agent actions on top of verified records.
- Expand permissions only after safety and reliability testing.

## Intellectual-property language

The founder reports filing patent-related protection concerning the system. The precise filing type, claims, jurisdiction, status, and permitted public wording must be confirmed from official records and qualified counsel before using “patented,” “patent pending,” or similar language in marketing or partner materials.

## Open founder decisions

The following require explicit founder decisions or verification before final technical and legal specifications:

- Final public brand styling: “Agent Air Direct” versus “AgentAirDirect”
- Legal entity name and governing jurisdiction
- Public versus private identity fields
- Owner-verification methods
- Registry governance model
- Correction, dispute, and revocation policies
- White-label attribution requirements
- Platform-partner commercial models
- Public specification name and licensing
- Case-study measurement periods
- Privacy, retention, and consent requirements
- Final terminology for external technical audiences

## Approval and change control

This document becomes founder approved only when Lisa Silva explicitly approves a specific version.

After approval:

1. The approved version must be committed to the repository.
2. Material product changes must cite the affected section.
3. Changes to the vision require a revision note and founder approval.
4. Technical specifications may add detail but may not contradict this document.
5. If current code conflicts with this document, the conflict must be documented and resolved deliberately; the code is not automatically treated as the intended product.

## Revision history

| Version | Date | Status | Summary |
|---|---|---|---|
| 0.1 | August 11, 2026 | Draft — Founder Review Required | Initial consolidation of the founder vision, product architecture, trust model, module responsibilities, evidence doctrine, and build sequence. |
| 1.0 | August 11, 2026 | Founder Approved | Lisa Silva approved the initial source of truth as the governing product standard. |
