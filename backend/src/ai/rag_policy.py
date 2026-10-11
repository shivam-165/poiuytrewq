"""
ZephyrPulse AI — RAG Policy Engine with ChromaDB Vector Store
Implements the MANDATORY ChromaDB vector store from the Technology Stack doc.

Vector Store: ChromaDB saved to disk (chroma_store/ directory)
Embedding Model: sentence-transformers/all-MiniLM-L6-v2
Purpose: Semantic retrieval of Annex A fault/service policy clauses
"""
import os
import json
from typing import List, Dict, Any

# ─── Annex A Policy Knowledge Base (7 rules) ─────────────────────────────────

ANNEX_A_POLICY_KNOWLEDGE_BASE = [
    {
        "id": "ANNEX-A-R1",
        "title": "Curtailment First Policy",
        "rule": "Periods marked as curtailed are removed before judging turbine health.",
        "rationale": "Prevents false fault alerts caused by deliberate grid operator DSO setpoint throttling.",
        "keywords": ["curtailment", "curtailed", "dso", "setpoint", "grid", "clamp", "power loss"]
    },
    {
        "id": "ANNEX-A-R2",
        "title": "Aerodynamic Wake Verification",
        "rule": "A turbine whose power loss appears only in certain wind directions is checked for wake before it is called faulty.",
        "rationale": "Avoids needless service dispatches for turbines standing downwind of upstream neighbours (e.g., T-05 downwind of T-04 at 250-290 degrees).",
        "keywords": ["wake", "direction", "sector", "neighbour", "upstream", "downwind", "t-05", "t-04"]
    },
    {
        "id": "ANNEX-A-R3",
        "title": "Blade Icing Protocol",
        "rule": "Low power near freezing (ambient temp <= 0.5 degrees C) with high humidity is treated as possible aerodynamic icing rather than mechanical defect.",
        "rationale": "Avoids misclassifying aerofoil stalling caused by rime ice accretion as bearing or gearbox breakdown.",
        "keywords": ["icing", "ice", "freezing", "sub-zero", "temperature", "ambient", "t-22"]
    },
    {
        "id": "ANNEX-A-R4",
        "title": "Weather Limit and Safety Protocol",
        "rule": "No maintenance service when forecast wind speed exceeds crew safety limit (4.5 m/s for crane lifts; 10.0 m/s for nacelle climb). Zero service during storm windows.",
        "rationale": "Strict occupational safety protocol to prevent crane boom instability during gusts.",
        "keywords": ["weather", "wind limit", "safety", "storm", "crane", "gust", "4.5"]
    },
    {
        "id": "ANNEX-A-R5",
        "title": "Crew and Crane Resource Exclusivity",
        "rule": "A maintenance window requires both assigned crew and mobile crane (Crane 1) to be continuously available for the entire duration.",
        "rationale": "Ensures scheduled work is physically executable without multi-site crane conflicts.",
        "keywords": ["crew", "crane", "calendar", "availability", "double-booking", "resource"]
    },
    {
        "id": "ANNEX-A-R6",
        "title": "Site Manager Governance and Approval",
        "rule": "The AI service plan is a prioritized commercial proposal. The Site Manager reviews and formally approves major overhauls.",
        "rationale": "Maintains human-in-the-loop accountability for high-capex maintenance interventions.",
        "keywords": ["approval", "site manager", "proposal", "accountability", "human-in-the-loop"]
    },
    {
        "id": "ANNEX-A-R7",
        "title": "High-Severity Urgency Rule",
        "rule": "High-severity developing faults (gearbox bearing, generator wear) must be scheduled within 7 days of detection.",
        "rationale": "Mitigates catastrophic asset loss and avoids multi-week unpowered outages.",
        "keywords": ["high-severity", "urgency", "7 days", "gearbox", "generator", "t-07", "t-12"]
    }
]

# ─── ChromaDB Vector Store ────────────────────────────────────────────────────

# Path for persisted ChromaDB on disk (mandatory per tech stack doc)
_CHROMA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "chroma_store")
_COLLECTION_NAME = "annex_a_policies"
_chroma_client = None
_collection = None
_chroma_available = False


def _init_chroma():
    """Initialize ChromaDB with sentence-transformers embedding model saved to disk."""
    global _chroma_client, _collection, _chroma_available
    if _chroma_available:
        return True
    try:
        import chromadb
        from chromadb.utils import embedding_functions

        # sentence-transformers/all-MiniLM-L6-v2 as specified in tech stack doc
        embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )

        # Persistent ChromaDB on disk — mandatory: "ChromaDB saved to disk"
        os.makedirs(_CHROMA_DIR, exist_ok=True)
        _chroma_client = chromadb.PersistentClient(path=_CHROMA_DIR)

        # Get or create the collection
        _collection = _chroma_client.get_or_create_collection(
            name=_COLLECTION_NAME,
            embedding_function=embedding_fn,
            metadata={"hnsw:space": "cosine"}
        )

        # Seed if collection is empty (only runs once — never re-ingests on restart)
        if _collection.count() == 0:
            _seed_collection()

        _chroma_available = True
        print(f"[RAG] ChromaDB initialized at {_CHROMA_DIR} | {_collection.count()} policy docs indexed")
        return True

    except Exception as e:
        print(f"[RAG] ChromaDB init failed (using keyword fallback): {e}")
        _chroma_available = False
        return False


def _seed_collection():
    """Seed the ChromaDB collection with Annex A policy documents. Runs only once."""
    documents = []
    metadatas = []
    ids = []
    for item in ANNEX_A_POLICY_KNOWLEDGE_BASE:
        # Rich document text combining rule, rationale, and title for embedding
        doc_text = (
            f"{item['title']}: {item['rule']} "
            f"Rationale: {item['rationale']} "
            f"Keywords: {', '.join(item['keywords'])}"
        )
        documents.append(doc_text)
        metadatas.append({
            "id": item["id"],
            "title": item["title"],
            "rule": item["rule"],
            "rationale": item["rationale"],
            "keywords_json": json.dumps(item["keywords"])
        })
        ids.append(item["id"])

    _collection.add(documents=documents, metadatas=metadatas, ids=ids)
    print(f"[RAG] Seeded {len(documents)} Annex A policy documents into ChromaDB")


def _keyword_fallback(query: str, top_k: int) -> List[Dict[str, Any]]:
    """Keyword-based fallback when ChromaDB is unavailable."""
    q_tokens = set(query.lower().split())
    scored = []
    for item in ANNEX_A_POLICY_KNOWLEDGE_BASE:
        overlap = sum(1 for kw in item["keywords"] if any(kw in token or token in kw for token in q_tokens))
        scored.append((overlap, item))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [item for _, item in scored[:top_k]]


def search_policy_guidelines(query: str, top_k: int = 2) -> List[Dict[str, Any]]:
    """
    Retrieves relevant Annex A policy clauses using ChromaDB semantic vector search.
    Falls back to keyword search if ChromaDB is unavailable.

    Tech Stack Compliance:
    - Vector Store: ChromaDB saved to disk (chroma_store/)
    - Embedding Model: sentence-transformers/all-MiniLM-L6-v2
    """
    # Try ChromaDB semantic search first
    if _init_chroma() and _collection is not None:
        try:
            n = min(top_k, _collection.count())
            if n == 0:
                return _keyword_fallback(query, top_k)
            results = _collection.query(
                query_texts=[query],
                n_results=n,
                include=["metadatas", "distances"]
            )
            retrieved = []
            if results and results["metadatas"] and results["metadatas"][0]:
                for meta in results["metadatas"][0]:
                    retrieved.append({
                        "id": meta["id"],
                        "title": meta["title"],
                        "rule": meta["rule"],
                        "rationale": meta["rationale"],
                        "keywords": json.loads(meta.get("keywords_json", "[]"))
                    })
            if retrieved:
                return retrieved
        except Exception as e:
            print(f"[RAG] ChromaDB query failed, using keyword fallback: {e}")

    # Keyword fallback
    return _keyword_fallback(query, top_k)


def get_vector_store_status() -> Dict[str, Any]:
    """Returns ChromaDB health status for /health endpoint."""
    is_ready = _init_chroma()
    doc_count = _collection.count() if is_ready and _collection else 0
    return {
        "vector_store": "chromadb_persistent" if is_ready else "keyword_fallback",
        "chroma_dir": _CHROMA_DIR,
        "collection": _COLLECTION_NAME,
        "documents_indexed": doc_count,
        "embedding_model": "sentence-transformers/all-MiniLM-L6-v2",
        "available": is_ready
    }

