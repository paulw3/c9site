# C-9INE Website — Structure & Content Brief
*Working doc for the rebuild. Sourced from: GDC Saudi FSI pitch deck, MoC Implementation Plan, Enjaz Physical Segregation proposal, C-9INE Positioning Brief v2, live c9ine.com (About/Clients pages), and Alastair Sherriffs' Claude Code workshop guide and meeting notes.*

---

## 1. Positioning

Nav is organized by destination — what you're moving to — because that's what a visitor is actually searching for, and it avoids the same content getting split three ways. Confirmed against how Google Cloud's own consulting site and comparable migration firms structure theirs: the design/build/run journey lives as a narrative arc on the page, not as separate nav destinations.

> **We design. We build. We run.**

This is the methodology narrative that opens both pillar pages — same three-stage arc, applied to whichever destination the page is about.

**The two pillars (nav):**
- **Cloud Transformation & Migration** — moving workloads from on-prem or another hyperscaler onto Google Cloud, with security architecture, CISO-as-a-Service and aSaaS folded in as part of the offer
- **Google Distributed Cloud (GDC)** — designing and standing up a customer's GDC environment, then migrating workloads onto it

---

## 2. Proposed Sitemap

```
Home
├── Cloud Migration & Transformation   (pillar page)
├── Google Distributed Cloud            (pillar page — campaign destination)
├── Case Studies                        (static page, empty for now)
├── About
└── Contact
```

Static pages: Home, Cloud Migration & Transformation, Google Distributed Cloud, Case Studies, About, Contact — no CMS. Content lives in the codebase and is updated by prompting Claude Code with new copy, then reviewing and pushing to main. You're the sole publisher, so there's no need for a separate editing interface — a case study gets added by opening Claude Code, not by logging into a CMS.

### Why this shape
- Nav organized by destination, not delivery stage — matches how Google Cloud's own consulting site and other migration firms structure theirs
- Design → Build → Run runs as the opening narrative on each pillar page, not as duplicated nav items
- GDC gets a dedicated URL for summit/LinkedIn traffic, same nav billing as Cloud Migration
- Security & CISO-as-a-Service and aSaaS fold into Cloud Migration rather than getting their own pages
- Case Studies stays a static page, empty until engagements are cleared to publish, edited via Claude Code + git rather than a CMS collection — since you're the only one publishing, that's simpler than standing up editable-collection infrastructure for a single user

---

## 3. Technical build & workflow

**Stack:** Astro (static site), deployed via Cloudflare Pages connected to GitHub for auto-deploy. Custom-coded, not Webflow.

**Build tool:** Claude Code Desktop.

**Publishing model:** No CMS. You're the sole publisher — content updates happen by prompting Claude Code with new copy, reviewing the diff, and pushing to main. This applies to Case Studies too: adding an entry means giving Claude Code the write-up, not logging into an editor.

**Git workflow:** Solo version of standard practice — short-lived feature branches (`feature/`, `fix/`, `update/` naming), commit often, push, merge to main. The PR-review step from a team workflow isn't needed since there's no second reviewer, though opening PRs on yourself is still a fine habit as a self-check before merging. Preview locally via the Astro/Vite dev server before pushing.

**Getting Claude Code up to speed:** Claude Code has no access to this chat's history, so this document is the transfer mechanism. Save it into the repo (e.g. `docs/content-brief.md`) and point Claude Code at it at the very start of the build session — "read docs/content-brief.md before we start, that's the spec for this site."

**Design references** — dark-mode enterprise B2B sites worth screenshotting sections from, matched to the brand's existing dark-mode-required, Barlow Semi Condensed / Gunmetal–Aquamarine–Silver–White Smoke system:
- **Linear** — restrained dark UI, kinetic typography used sparingly
- **Stripe** — speaks to both technical and executive audiences on one page, relevant given the CISO-reads-detail / CTO-reads-summary split in the copy
- **Vercel** — terminal-panel, technical-credibility aesthetic
- **Palo Alto Networks' documentation site** (not their main marketing site) — relevant beyond aesthetics: it runs on the same git-commit-as-publish model as this build, across one themeable design system spanning marketing and technical content

**Avoiding generic AI-generated design:** load a front-end design skill (this environment's `frontend-design` skill, or an equivalent) at the start of the Claude Code session, before any code is written — this is what stops output defaulting to templated AI-website patterns.

---

## 4. Page-by-page content brief

### Home
Job: 10-second read that says "we take you from legacy to Google Cloud — or GDC — safely, and you end up owning it."

**Hero:**
> **Google Cloud, engineered for institutions that cannot get it wrong.**
>
> We design, build, and run cloud transformation and Google Distributed Cloud for banks, government and critical-infrastructure organisations across Saudi Arabia and beyond.
>
> [Talk to us]

*(Adapted from the positioning brief's hero draft, updated for the two-pillar structure — the original was written for a four-pillar version. Deliberately doesn't use "SOVEREIGNTY, ENGINEERED." here, per the brief's own logic: that line lands harder on the GDC page than diluted into the company-level headline.)*

**Trust bar:**
> Google Cloud Premier Partner · Google Distributed Cloud · Riyadh, Saudi Arabia

**Two-pillar cards:**
- **Cloud Migration & Transformation** — "Move to Google Cloud from on-premise or another hyperscaler. We design the target state, build it in governed waves, and run it with you after go-live." → links to pillar page
- **Google Distributed Cloud** — "SOVEREIGNTY, ENGINEERED. We turn Google Distributed Cloud into a secure, production-ready operating platform, covering everything from readiness to capability transfer." → links to pillar page

**Methodology strip — Design / Build / Run, one line each:**
- **Design:** Target-state architecture, mapped before a single workload moves.
- **Build:** Governed execution: migration factory or GDC deployment, whichever the destination needs.
- **Run:** Documentation, knowledge transfer and support to keep it running, or we hand you the keys entirely.

**CTA:** → Contact ("Talk to us")

### Cloud Migration & Transformation (pillar page)

**Hero:**
> Whether you're moving from on-premise or another hyperscaler, we design the target state, build it in governed waves, and run it with you after go-live. Across every domain the workload touches, not just the landing zone.
>
> [Talk to us about your migration]

**Design**

We map the target Google Cloud landing zone across every domain before a single workload moves: network architecture (VPC design, hub-and-spoke or shared-VPC), identity (IAM, Zero Trust, privileged access management), security (encryption and key management, compliance controls mapped to SAMA, NCA ECC and PDPL), data platform selection (Cloud SQL, AlloyDB), and container and compute strategy (GKE topology). Security is designed in from day one, not bolted on once the architecture is already built.

**Build**

The migration factory runs across domains, not as one generic lift-and-shift: container orchestration on GKE, database migration and high-availability setup (Cloud SQL, AlloyDB), networking and API layers (Apigee, VPC Service Controls), data integration and pipelines (Pub/Sub, Cloud Data Fusion, Dataflow), serverless compute (Cloud Run, Cloud Functions), and observability (Cloud Logging and Monitoring, SecOps). Security moves with every wave, not after it: encryption and key management (Cloud KMS, customer-managed keys), IAM enforcement, and threat detection are validated in the target before a workload cuts over, not audited afterward. Everything moves in governed waves: pilot first, then entry and exit criteria at every gate, rollback readiness, and validation before and after each cutover. Infrastructure-as-Code from day one. aSaaS (أساس), our Marketplace-listed automation, accelerates the landing zone piece of this work.

**Run**

We operationalize and hand over across the same domains: documentation, knowledge transfer, hypercare, a managed transition to steady state, and ongoing monitoring. For organisations without in-house security leadership, we continue as CISO-as-a-Service, built on two decades of security leadership across global banks.

**No lock-in.** Code, diagrams, evidence and documentation are delivered into your own repositories. When we're done, your team can operate what we built without depending on us to keep it running.

[Talk to us about your migration]

### Google Distributed Cloud (pillar page — priority for summit)

**Hero:**
> # SOVEREIGNTY, ENGINEERED.
>
> ### Sovereign cloud is not a location. It is an operating model.
>
> C-9INE helps banks, government institutions and critical-infrastructure organisations turn Google Distributed Cloud into a secure, production-ready operating platform, covering readiness and deployment, workload transformation, resilience, day-two operations and capability transfer.
>
> [Book a GDC pilot scoping call]

⚠️ This line was signed off by Ali to ship *identical* across LinkedIn, proposals, sales decks and the website — the redraft above changes the approved wording (removes the dash) per your latest edit. Worth a quick check that it's fine to diverge from the other channels, or that you'll update those too, so the campaign doesn't end up with two versions in circulation. Positioning otherwise unchanged: **global** (banks, government, critical infrastructure — no geography named), with the Saudi work used as evidence of delivering under the hardest regulatory conditions, not as the whole story.

**The gap**

Installing Google Distributed Cloud is not the hard part. Governing it, operating it, recovering it, and evolving it is. That's the gap between a platform being *installed* and an organisation being ready to *govern, operate, recover and evolve* it. It's the gap C-9INE occupies.

**Why now**

Most FSI estates we see run VMware, Nutanix, Hyper-V and Kubernetes side by side, each with its own licensing, monitoring, lifecycle and security evidence to maintain. GDC gives you one platform, one policy model, one fleet view, without forcing every workload to modernise on day one.

**Design: Readiness**

We assess the estate, map it against your regulatory requirements, and define the target operating model before any hardware is touched.

**Build: Deployment and workload transformation**

GDC is software-only: GKE-based Kubernetes running on your own supported servers, connected or air-gapped depending on what your regulator requires. VM Runtime means it's not a containers-only platform: traditional VM workloads run on it too, migrated in alongside containers as real regulated workloads move onto the platform. C-9INE has deployed VM Runtime on GDC 1.35 and is running Linux VMs at a Saudi bank today.

The fastest way to prove this for your organisation is a focused pilot: 4–6 weeks, install and register GDC, migrate a handful of representative VM and container workloads, and walk away with a reference pack and feasibility evidence before committing to anything larger.

**Run: Resilience, day-two operations, capability transfer**

Recovery, continuity and failure testing designed in, not tested for the first time in production. Genuine day-two operations: running the platform, not just standing it up. And capability transfer: your team can operate it without us. That's the most commercially counter-intuitive thing we say, and the most credible.

**Proof**

Deployed for tier-one Saudi banks and a financial regulator, in the region's strictest regulatory environment, including Google Cloud's own Dammam region (me-central2) and the Class C licence CST granted it there. *(Anonymised references, pending client approval to name.)*

**Where we're headed**

*(Removed per review — MGP designation line cut.)*

[Book a GDC pilot scoping call]

*(CTA tracked separately from the general Contact form, to measure summit conversion.)*

### Case Studies
Leave empty for now, per your decision. Template for when you add one: client type, challenge, approach, outcome, 150-300 words per entry. Adding a case study means giving Claude Code the write-up and having it commit the new page/section, then you review and push to main — no separate CMS login or collection interface needed.

### About

**Hero:**
> **On your side, in your team.**
>
> C-9INE is a Google Cloud specialist delivering to banks, government institutions and critical-infrastructure organisations across Saudi Arabia and beyond. We design, we build, and we run, embedding with your team rather than handing over a deck and leaving.

**Leadership** (condensed from the real bios on the live site, repositioned away from the old startup-accelerator framing):

- **Ali Aktar — CEO**: Twenty-six years in technology: development, engineering, architecture, cloud, agile and DevOps. Ali has built software and platform engineering teams from scratch, holding Head of Engineering and CTO roles across private and public sector organisations worldwide, in telecoms, ISPs, oil and gas, satellite, military and defence, banking and national health services. He's an Agile, cloud and DevOps evangelist, and a long-standing contributor to open-source projects.
- **Irfan — CTO**: *(No bio on file. None of the source documents or the live site's current About page mention Irfan in a C-9INE leadership capacity. Need his background before this can be drafted.)*
- **Tahir Haque — COO**: Fifteen years as a project and programme management specialist, including senior Director roles across UK government: the Ministry of Justice, HM Revenue & Customs, and the Cabinet and Prime Minister's Office. Tahir has led large, multifunctional teams delivering multi-billion-pound programmes, with deep expertise in strategy, transformation, organisational design, governance and stakeholder engagement up to ministerial level. He holds a degree and master's from UCL, is a certified programme specialist and change management practitioner, and holds a Level 5 CIPD Diploma in HR Management.
- **Paul Wagenaar — CISO**: Two decades in cybersecurity, with a career spanning Australia, the UK, South Africa and the UAE. Paul has held security leadership positions at global banks and major corporations, building security strategy and capability from the ground up in some of the most regulated environments in the world.

*(These are condensed from the live site's longer bios — trim further or keep closer to source length depending on page real estate.)*

**The team behind the team** — draft roles aligned to the two pillars (the live site's current list — Head of iOS, Head of Android, Head of Java Backend, etc. — reads as the old product-dev team and has been dropped):

- Head of Cloud Migration & Landing Zone Engineering
- Head of Google Distributed Cloud
- Head of Security & Compliance
- Head of Data & Platform Engineering
- Head of DevOps & Automation (aSaaS)

⚠️ These are drafted to fit the new positioning, not confirmed against your actual team roster or titles — I have no source for who holds these roles or what they're actually called. Needs a final pass from Ali/Tahir before publishing.

**Why C-9INE:** "We hand you the keys. Every engagement, migration or GDC, ends with your team fully able to operate what we built, without depending on us to keep it running. Code, diagrams, evidence and documentation live in your repositories, not ours." (The ownership guarantee from the Cloud Migration page, restated here as a company value rather than a service proof point.)

### Contact

> **Talk to us.**
>
> Whether you're planning a migration or starting your Google Distributed Cloud journey, tell us where you are and we'll take it from there.

Form fields: Name · Email · Company · What are you looking to do? (dropdown or short text) · Message
Buttons: "Send" (general enquiry) and a separately tracked "Book a GDC pilot scoping call" — the latter also lives on the GDC page itself, for summit-conversion tracking.

Address block:
> Sahaba Tissa (Cloud 9)
> 7586 King Fahad Road, Ar Rahmaniyah, Riyadh 12341, Saudi Arabia
> [registration number: confirm which of the two on file is current]

---

## 5. Cleanup carried over from the earlier audit
- Fix og:site_name / og:description at template level — still describes the old accelerator positioning
- Kill duplicate product listings and orphaned pages, 301-redirect into the new structure
- Confirm aSaaS is visible somewhere pre-launch — it's currently missing from the live site entirely

---

## 6. Open questions for you before build
- Irfan's background/bio — nothing on file to draft his About section from
- Team title list on About — draft suggestions only (see note above), needs Ali/Tahir confirmation against the real roster
- Company registration number mismatch on the live site (1009037941 vs 1010736412) — needs one confirmed number
- Google Cloud partner tier — Home's trust bar and proof line now state "Premier Partner" unqualified per your edit; confirm this is current before publish
- GDC hero wording now diverges from what Ali signed off as identical-everywhere — confirm you're OK with that divergence, or update the other channels (LinkedIn, proposals, decks) to match
- Case Studies confirmed: launches empty, per your review
