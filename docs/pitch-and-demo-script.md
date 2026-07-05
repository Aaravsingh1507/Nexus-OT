# NEXUS-OT — Pitch Deck Outline & Demo Script

## Slide-by-slide outline (use in Canva or PowerPoint)

**1. Title**
NEXUS-OT — Unified Asset & Operations Brain
Team [name] · ET AI Hackathon 2026 · Problem Statement 8

**2. The cost of fragmentation (open with the brief's own numbers)**
- Professionals in asset-intensive industries lose ~35% of working hours searching for information (McKinsey, 2024)
- Indian plants run across 7-12 disconnected document systems (NASSCOM-EY)
- 18-22% of unplanned downtime traces back to this fragmentation (BIS Research)
- 25% of India's experienced industrial engineers retire within a decade, taking undocumented knowledge with them

**3. The real problem**
Not a missing tool — a missing *connective layer*. Maintenance logs, P&IDs, SOPs, regulations, and incident reports all exist. Nothing links them, and nobody can query them as one brain.

**4. What we built — NEXUS-OT**
One platform, three surfaces:
- Expert Knowledge Copilot — ask anything, get grounded answers with citations
- Unified Knowledge Graph — equipment, incidents, procedures, regulations, auto-linked
- Compliance Gap Detector — procedures cross-checked against regulatory requirements automatically

**5. Live demo moment (screenshot or embed a GIF)**
Show the single question that proves the thesis:
"Why did the gas alarm trigger near GL-12 in Feb 2025, and is CB-204 compliant now?"
→ One answer, three source documents, one exposed compliance gap. No human had to know which of 7 systems to check.

**6. Architecture** (insert `nexus-ot-architecture.svg`)
Four layers: heterogeneous sources → ingestion & knowledge graph → agentic reasoning → interfaces. Continuous feedback loop keeps the graph current as new documents arrive.

**7. Why this wins on the judging criteria**
- Innovation: cross-document reasoning surfaces gaps no single-system search would find
- Business impact: ties directly to the brief's own downtime and safety statistics
- Technical excellence: real retrieval + real LLM reasoning, not a static chatbot
- Scalability: same pipeline works for any plant, any document type, any regulation set
- UX: mobile-first copilot for field technicians, not just a desktop tool for engineers

**8. What's next**
- Expand ingestion to P&ID computer vision (drawing parsing)
- Multi-plant knowledge graph federation
- Auto-generated compliance evidence packages for audits

---

## 60-90 second demo video script

**[0:00-0:10] Hook**
"Eight workers died at a steel plant in January 2025 when gas sensor data existed — but nothing connected it to the maintenance work happening 20 metres away. That's not a sensor problem. That's a knowledge problem."

**[0:10-0:20] Problem**
"The average Indian industrial plant runs 7 to 12 disconnected document systems. Engineers lose over a third of their week just searching for information that already exists — somewhere."

**[0:20-0:45] Solution + live demo**
"We built NEXUS-OT — a unified operations brain. Watch: I ask one question — 'why did the gas alarm trigger near GL-12, and is the equipment compliant now?' NEXUS pulls from a maintenance log, an incident report, and a regulatory standard — three different systems — and gives one grounded answer, with sources. It also surfaces something no single system would catch on its own: a compliance gap between our permit process and the regulatory requirement."

**[0:45-0:55] Graph + compliance view**
"Every equipment, incident, procedure and regulation is linked in a live knowledge graph — click any node to trace exactly why a decision was flagged."

**[0:55-1:10] Close**
"This isn't a chatbot bolted onto a file server. It's a knowledge layer that gets smarter with every document it ingests — and it's built to scale from one plant to an entire industrial group. NEXUS-OT — the unified asset and operations brain."

---

## Notes for you
- The prototype (`nexus-ot.html`) uses a real Claude API call for the copilot — open it in a browser and it works live, no setup needed.
- If you want an actual narrated demo video generated automatically (not just a script), Motion can build one from this script and the architecture diagram — just say the word and I'll set that up.
- If you want a full Canva slide deck built from this outline (not just markdown), I can generate that directly too.
