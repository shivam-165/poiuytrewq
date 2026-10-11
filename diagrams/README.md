# Diagrams — Wind Fleet Health & Maintenance Window Optimizer

All diagrams are written in **D2 language** — a modern diagramming-as-code tool.

---

## How to Render These Diagrams

### Option 1 — D2 Playground (Online, Instant)
1. Go to **https://play.d2lang.com**
2. Open the `.d2` file in a text editor
3. Copy all content → paste into the playground
4. The diagram renders live on the right

### Option 2 — D2 CLI (Local, Generates SVG/PNG)
```bash
# Install D2
curl -fsSL https://d2lang.com/install.sh | sh

# Render each diagram
d2 01_ER_Diagram.d2        er_diagram.svg
d2 02_API_Endpoint_Map.d2  api_map.svg
d2 03_DFD.d2               data_flow.svg
d2 04_HLD.d2               hld_architecture.svg
d2 05_Timeline.d2          dev_timeline.svg

# Or render as PNG
d2 --format png 01_ER_Diagram.d2 er_diagram.png
```

---

## Diagram Index

| File | Diagram | What It Shows |
|---|---|---|
| `01_ER_Diagram.d2` | Entity-Relationship Diagram | All 10 DB tables, attributes, PKs, FKs, and cardinality |
| `02_API_Endpoint_Map.d2` | API Endpoint Map | All 6 REST endpoints, request/response schemas, service wiring |
| `03_DFD.d2` | Data Flow Diagram | End-to-end data movement from CSV ingest to API response |
| `04_HLD.d2` | High-Level Design | 4-layer architecture + Docker Compose infrastructure |
| `05_Timeline.d2` | Development Timeline | 1-day hackathon sprint plan with owners and milestones |

---

## Color Legend

| Color | Meaning |
|---|---|
| Blue (`#3b82f6`) | Domain data layer / external sources |
| Purple (`#8b5cf6`) | AI / ML / LLM components |
| Green (`#10b981`) | API layer / outputs |
| Cyan (`#38bdf8`) | Frontend / presentation |
| Orange (`#f97316`) | Database / storage |
| Red (`#ef4444`) | Late data drop / critical events |
| Yellow (`#fbbf24`) | Milestones |

---

*Generated for HCLTech Future Ready AI Engineer Hackathon*
