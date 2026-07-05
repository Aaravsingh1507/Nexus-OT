# NEXUS-OT — Unified Asset & Operations Brain

**ET AI Hackathon 2026 — Problem Statement 8: AI for Industrial Knowledge Intelligence**

NEXUS-OT is a working prototype of an industrial knowledge intelligence platform. It unifies
maintenance logs, engineering drawings, safety SOPs, regulatory guidance, incident reports and
OEM manuals into one queryable, cross-linked knowledge layer — so that a question that today
requires checking 3+ separate systems can be answered in one place, with sources.

## Live demo

Open `index.html` directly in any browser. No build step, no install.

The Knowledge Copilot makes a real call to the Anthropic API for reasoning — retrieval happens
client-side against a synthetic 7-document corpus, and the model answers only from the retrieved
source excerpts, with clickable citations.

## What it does

- **Expert Knowledge Copilot** — ask any question across the document corpus and get a grounded,
  cited answer. Click a citation to see the exact source excerpt.
- **Unified Knowledge Graph** — equipment, incidents, procedures, regulations and facility zones,
  auto-linked. Click any node to trace its connections and source documents.
- **Compliance Gap Detection** — current procedures cross-checked against regulatory requirements,
  with the specific evidence behind each flagged gap.

## Demo scenario

The prototype ships with a synthetic corpus from a fictional plant ("Unit-3 Coke Oven Battery")
designed to demonstrate genuine cross-document reasoning. Try asking:

> "Why did the gas alarm trigger near GL-12 in February 2025, and is CB-204 compliant now?"

The answer synthesises a maintenance log, an incident report and a regulatory standard into one
response — and independently surfaces a compliance gap that no single document would reveal alone.

## Repository structure

```
index.html                       — the working prototype (open directly in a browser)
docs/architecture.svg            — system architecture diagram
docs/pitch-and-demo-script.md    — pitch deck outline and demo video script
```

## Architecture

Four layers: heterogeneous document sources → ingestion & knowledge graph construction →
agentic reasoning (retrieval, copilot, compliance, RCA agents) → interfaces (mobile copilot,
graph console, compliance dashboard). See `docs/architecture.svg` for the full diagram.

## Tech stack

- Anthropic Claude API for grounded reasoning
- Client-side retrieval (keyword/entity overlap scoring over chunked source documents)
- Vanilla HTML/CSS/JavaScript — single file, no dependencies, no build step
- SVG-rendered interactive knowledge graph

## Suggested technologies from the brief covered in this build

- RAG over heterogeneous industrial document corpora
- Knowledge graphs & industrial ontology engineering
- Quality Management System (QMS) integration (via the compliance gap detector)
- Agentic AI for maintenance and compliance workflows

## Roadmap

- Computer-vision-based P&ID parsing
- Dense vector + hybrid graph search at production scale
- Multi-plant knowledge graph federation
- Auto-generated audit-ready compliance evidence packages

## Team

Aarav Singh — B.Tech CSE (AI), Noida Institute of Engineering and Technology (NIET)
