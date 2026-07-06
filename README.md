# NEXUS-OT — Unified Asset & Operations Brain

NEXUS-OT is a working prototype of an industrial knowledge intelligence platform. It unifies
maintenance logs, engineering drawings (P&IDs), safety SOPs, regulatory guidance, incident
reports and OEM manuals into one queryable, cross-linked knowledge layer — so that a question
that today requires checking 3+ separate systems can be answered in one place, with sources.

---

## Quick Start

```bash
# Clone the repo
git clone https://github.com/Aaravsingh1507/Nexus-OT.git
cd nexus-ot

# Option 1 — npm (starts a local dev server on port 3000)
npm start

# Option 2 — just open it
# Open index.html directly in any browser. No build step, no install.
```

The Knowledge Copilot makes a real call to the Anthropic API for reasoning — retrieval happens
client-side against a synthetic 7-document corpus, and the model answers only from the retrieved
source excerpts, with clickable citations.

---

## What It Does

### 1. Expert Knowledge Copilot
Ask any question across the document corpus and get a grounded, cited answer.
Click a citation to see the exact source excerpt in the side drawer.

### 2. Unified Knowledge Graph
Equipment, incidents, procedures, regulations and facility zones — auto-linked
from the document corpus. Click any node to trace its connections and source
documents. Compliance gaps are visualised as dashed amber edges.

### 3. Compliance Gap Detection
Current procedures cross-checked against regulatory requirements (OISD / Factory Act),
with the specific evidence behind each flagged gap.

---

## Demo Scenario

The prototype ships with a synthetic corpus from a fictional plant
("Bhilwara Steel & Alloys — Unit-3 Coke Oven Battery") designed to demonstrate
genuine cross-document reasoning. Try asking:

> *"Why did the gas alarm trigger near GL-12 in February 2025, and is CB-204 compliant now?"*

The answer synthesises a maintenance log, an incident report and a regulatory standard
into one response — and independently surfaces a compliance gap that no single document
would reveal alone.

---

## Repository Structure

```
nexus-ot/
├── index.html                          → Clean app shell (HTML only)
├── css/
│   └── style.css                       → Full design system & component styles
├── js/
│   ├── data.js                         → Document corpus, graph nodes/edges, compliance rules
│   └── app.js                          → Retrieval engine, copilot chat, graph renderer, UI logic
├── docs/
│   ├── architecture.svg                → System architecture diagram
│   └── pitch-and-demo-script.md        → Pitch deck outline & demo video script
├── package.json                        → npm start for local dev server
├── .gitignore
├── LICENSE                             → MIT
└── README.md
```

---

## Architecture

Four layers:

1. **Heterogeneous Document Sources** — maintenance logs, P&IDs, SOPs, regulatory
   standards, incident reports, OEM manuals, inspection reports
2. **Ingestion & Knowledge Graph Construction** — chunked document parsing, entity
   extraction, relationship linking, graph topology building
3. **Agentic Reasoning** — retrieval (keyword/entity overlap scoring), copilot
   (grounded Q&A with source citations), compliance gap detection, root cause analysis
4. **Interfaces** — knowledge copilot chat, interactive SVG knowledge graph,
   compliance dashboard with gap/compliant status chips

See [`docs/architecture.svg`](docs/architecture.svg) for the full diagram.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Reasoning | Anthropic Claude API (grounded, citation-backed responses) |
| Retrieval | Client-side keyword/entity overlap scoring over chunked documents |
| Knowledge Graph | SVG-rendered interactive graph with force-positioned nodes |
| Frontend | Vanilla HTML / CSS / JavaScript — zero dependencies, no build step |
| Typography | Oswald + Inter + IBM Plex Mono (Google Fonts) |
| Dev Server | `npx serve` via `npm start` |

---

## Problem Statement Coverage

| Suggested Technology | How NEXUS-OT Addresses It |
|---------------------|--------------------------|
| RAG over heterogeneous industrial corpora | ✅ 7-document synthetic corpus with keyword retrieval + LLM-grounded answers |
| Knowledge graphs & industrial ontology | ✅ 9-node interactive graph linking equipment, procedures, regulations, incidents |
| QMS integration | ✅ Compliance gap detector cross-checking SOPs against OISD standards |
| Agentic AI for maintenance/compliance | ✅ Copilot reasons across documents; surfaces gaps no single document reveals |

---

## Roadmap

- [ ] Computer-vision-based P&ID parsing
- [ ] Dense vector + hybrid graph search at production scale
- [ ] Multi-plant knowledge graph federation
- [ ] Auto-generated audit-ready compliance evidence packages
- [ ] Real-time equipment telemetry integration
- [ ] Mobile-first copilot interface for field engineers

---

## Team

**Aarav Singh** — B.Tech CSE (AI), Noida Institute of Engineering and Technology (NIET)

---

## License

[MIT](LICENSE)
