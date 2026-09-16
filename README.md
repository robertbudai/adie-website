# ADIE — Adaptive Decision Intelligence Engine

**Decision intelligence with evidence, uncertainty, verification and traceability.**

ADIE is an independently developed decision-intelligence platform prototype created by Robert Budai.

Its objective is to make complex decisions more understandable, testable and auditable by connecting evidence, decision logic, uncertainty and verification.

**[Explore the public ADIE website](https://robertbudai.github.io/adie-website/)**

---

## 1. The problem

Organizations often have access to substantial amounts of data but still struggle to answer important decision questions:

* What is happening?
* What evidence supports a proposed decision?
* What alternatives exist?
* How uncertain is the estimated outcome?
* How can the decision be verified?
* What is the potential business impact?

ADIE is being developed to address these questions through a structured decision process.

## 2. Decision framework

The platform's central decision narrative is:

**Problem → Evidence → Decision → Uncertainty → Verification → Business Impact**

The intended workflow connects decision context with evidence, estimated effects, constraints, verification and subsequent observations.

The long-term objective is a system that supports human decision-makers rather than replacing their accountability.

## 3. Public interactive demo

The website includes a browser-based interactive demonstration using a frozen historical estimate from the Hillstrom marketing experiment.

Visitors can:

* Enter an illustrative campaign size.
* Specify an assumed delivery cost per customer.
* Calculate estimated incremental gross revenue.
* Examine a historical 95% estimate interval.
* Compare the estimate with assumed delivery costs.

The demo uses the following frozen historical figures:

| Measure                                          |           Value |
| ------------------------------------------------ | --------------: |
| Estimated incremental gross revenue per customer |         $0.9694 |
| Historical 95% estimate interval per customer    | $0.3543–$1.5845 |
| Reserved holdout records                         |          12,788 |

**Important limitation:** This public demonstration performs arithmetic using previously calculated historical estimates. It does not connect to the private ADIE engine, execute live inference, estimate new causal effects or process customer data.

The displayed results are illustrative estimates, not realized revenue, audited profit or guaranteed future performance.

## 4. Validation and evidence

ADIE has undergone internal prototype testing and historical-data validation.

The public website presents a Hillstrom validation walkthrough and explains the stated evidence boundaries.

Historical validation is not equivalent to prospective performance in a new organization or business environment.

Internal test results should not be interpreted as independent certification, a completed customer pilot or proof of production readiness.

Additional independent evaluation and real-world pilot testing are required before making broader performance claims.

## 5. Security and responsible deployment

Security and auditability are central development objectives.

The broader private ADIE prototype includes work on access control, tenant separation, integrity, audit records and security verification.

However, internal security tests do not constitute an independent penetration test, regulatory approval or certification.

The public GitHub repository contains the presentation website only. It is not the private decision engine or its production infrastructure.

**Do not submit confidential business information, personal data, credentials or sensitive datasets through the public demo.**

## 6. Current project status

ADIE is an independently developed enterprise-oriented prototype.

Current work focuses on:

* Product validation for a defined business use case.
* Objective decision benchmarking against an appropriate baseline.
* Measurement of potential business value.
* An understandable demonstration for enterprise decision-makers.
* Real-world pilot evaluation.
* Production infrastructure, operational reliability and independent security assessment.

The public website is a demonstration and project presentation, not a production decision service.

## 7. Collaboration

ADIE is open to discussions with organizations, researchers and technical partners interested in evaluating decision intelligence through a clearly scoped, evidence-based pilot.

Potential collaboration areas include decision benchmarking, causal evaluation, operational risk, auditability and enterprise integration.

A pilot would require an agreed use case, success criteria, data-governance arrangements, security review and defined human oversight.

For inquiries, use the contact information provided on the public ADIE website.

## 8. Repository scope

This repository contains the public-facing website:

* `index.html` — website structure and content.
* `style.css` — visual design and responsive presentation.
* `app.js` — website interactions and browser-only public demo.
* `assets/` — public visual assets.
* `inquiry-config.js` and `inquiry.js` — public inquiry interface components.

The private ADIE engine, internal datasets, credentials and enterprise infrastructure are not included.

## 9. Evidence and disclosure

The project distinguishes between:

**Demonstrated:** Browser-based public functionality and the historical estimates explicitly presented in the demo.

**Internally tested:** Prototype capabilities and validation procedures assessed within the development environment.

**Not yet established:** Independent certification, generalizable prospective performance, completed enterprise pilot outcomes and production readiness.

These distinctions are intentional and should be maintained in any evaluation of the project.

---

**Creator:** Robert Budai

**Project:** ADIE — Adaptive Decision Intelligence Engine

**Status:** Enterprise-oriented prototype and public demonstration.
