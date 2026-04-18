---
title: "A pragmatic RAG stack for teams that already have a database"
description: "You don't need a vector database startup to build production RAG. If you already run Postgres, you're closer than you think. Here's the stack I use."
date: 2025-09-21
tags: ["ai", "engineering", "rag"]
---

Every RAG tutorial starts the same way: pick a vector database. Pinecone, Weaviate, Qdrant, Chroma. The assumption is that you need a specialized system for embeddings, separate from everything else.

Maybe you do. If you're indexing billions of documents, if you need real time updates at millisecond latency, if vector search is the core of your product, then sure. Reach for the specialized tool.

But most teams I work with are not in that situation. They have a Postgres database with a few hundred thousand records. They want to add semantic search or build an internal Q&A tool. They don't want to manage another database, another deployment, another set of credentials, another thing that can go down at 3am.

For those teams, the stack I use is boring and it works.

## The stack

**Postgres + pgvector** for storage and search. Your embeddings live in the same database as the rest of your data. Same backups, same monitoring, same access patterns. If your team already knows Postgres, they already know how to operate this.

**OpenAI's embedding API** (or whatever model you prefer) for generating embeddings. I've used Cohere and Voyage too. The model matters less than people think, as long as you pick one and stick with it. Don't mix embedding models in the same index.

**A thin Python service** (FastAPI usually) that handles the query pipeline: embed the question, search pgvector, rerank if needed, pass to the LLM with context.

**A simple evaluation harness** (see my other post on evals). Without this, you're guessing.

That's it. No vector database. No orchestration framework. No LangChain if you don't want it (I sometimes use it, sometimes don't, depending on the complexity of the retrieval pipeline).

## Setting up pgvector

If you're on Postgres 14+, pgvector is an extension you can enable with one command:

```sql
CREATE EXTENSION vector;
```

Then add a vector column to your table:

```sql
ALTER TABLE documents ADD COLUMN embedding vector(1536);
```

The `1536` matches OpenAI's `text-embedding-3-small` dimension. If you use a different model, adjust accordingly.

Create an index:

```sql
CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

The `lists` parameter matters for performance. The pgvector docs suggest `lists = sqrt(row_count)` as a starting point. For 100K documents, that's about 316. I usually round to the nearest hundred and tune from there.

That's the setup. Your existing Postgres deployment now does vector search.

## The query pipeline

Here's the actual flow when a user asks a question:

1. Embed the question using the same model you used for documents
2. Query pgvector for the nearest neighbors
3. (Optional) rerank the results using a cross-encoder
4. Build a prompt with the retrieved context
5. Call the LLM
6. Return the response with citations

Steps 1 through 3 are where the quality lives. The LLM is the easy part. If you feed it good context, it gives good answers. If you feed it garbage, no amount of prompt engineering saves you.

```python
async def query(question: str, k: int = 8):
    # Step 1: embed
    q_embedding = await embed(question)

    # Step 2: vector search
    results = await db.fetch("""
        SELECT id, title, content,
               1 - (embedding <=> $1) AS similarity
        FROM documents
        WHERE embedding IS NOT NULL
        ORDER BY embedding <=> $1
        LIMIT $2
    """, q_embedding, k * 3)  # overfetch for reranking

    # Step 3: rerank
    reranked = rerank(question, results, top_k=k)

    return reranked
```

The overfetch in step 2 is important. Vector search gives you approximate nearest neighbors. Some of them are false positives. Reranking with a cross-encoder is slower but more accurate. Pulling 3x candidates and reranking down to k is a good tradeoff.

## Hybrid search: the part everyone skips

Pure vector search has a blind spot: exact matches. If someone searches for "error code PG-4012" and that exact string exists in your documents, vector search might not surface it because the embedding captures meaning, not exact tokens.

The fix is hybrid search: combine vector similarity with full text search and blend the scores. Postgres gives you both in the same query:

```sql
SELECT id, title, content,
    (0.7 * (1 - (embedding <=> $1))) +
    (0.3 * ts_rank(tsv, plainto_tsquery($2)))
    AS score
FROM documents
WHERE embedding IS NOT NULL
ORDER BY score DESC
LIMIT $3
```

The weights (0.7 vector, 0.3 lexical) are a starting point. Tune them based on your eval dataset. On the e-commerce engagement, we ended up at 0.6/0.4 because exact SKU matches were critical. On the healthcare project, 0.8/0.2 worked better because the queries were conversational and rarely contained exact terminology.

## What about scale?

The question I always get: "Does this scale?"

It depends on what you mean. For the projects I've worked on:

- 40K documents with 1536-dimension embeddings: queries return in under 50ms
- 200K documents: queries return in under 100ms with an IVFFlat index
- 500K documents: queries return in under 200ms, and at this point you should think about HNSW indexes instead of IVFFlat

Beyond 500K, pgvector still works, but you start making tradeoffs. Indexing time increases. Memory usage increases. You might need to shard or partition.

For most internal tools, knowledge bases, and product search use cases, you'll hit these limits long before you outgrow pgvector. And if you do outgrow it, the migration path is clear: export your embeddings, load them into a dedicated vector database, and point your query pipeline at the new backend. The rest of your stack stays the same.

## Chunking: the boring problem that matters most

I've spent more time debugging chunking strategies than any other part of the RAG pipeline. The embedding model has a token limit. Your documents are longer than that limit. You need to split them into chunks. How you split them determines what your retrieval can and can't find.

My current approach:

- Split on paragraph boundaries first, not on token count
- Target chunk size of 300 to 500 tokens (for 1536-dim embeddings)
- Overlap of 50 tokens between chunks
- Keep metadata with every chunk (document title, section heading, URL, date)
- Store the chunk's position in the document so you can reconstruct context

The overlap matters because relevant information often spans paragraph boundaries. Without it, you get chunks where the answer starts at the end of one chunk and continues at the beginning of the next, and neither chunk alone is sufficient for the LLM to answer correctly.

I've tried recursive splitting, semantic splitting, even LLM-based splitting. For most use cases, paragraph-boundary splitting with overlap gets you 90% of the way there. Start simple.

## Why not LangChain?

I use LangChain sometimes. On the healthcare project, where the retrieval pipeline had multiple stages, tool calls, and agent routing, LangChain's abstractions were helpful. On simpler projects, it's overhead.

The question to ask is: how many moving parts does your retrieval pipeline have? If it's "embed, search, rerank, generate," you don't need a framework. That's fifty lines of Python. If it's "embed, search, rerank, check permissions, call three different LLMs depending on the query type, fall back to keyword search if vector search returns low confidence results, and log everything to a monitoring dashboard," then a framework helps.

Most projects start as the first kind and grow into the second kind. My advice: start without a framework. Add it when the complexity justifies it. You'll understand your pipeline better, and you'll know exactly which parts of the framework you actually need.

## The bottom line

You don't need a new database to build RAG. If you have Postgres, enable pgvector, generate some embeddings, and write a query pipeline. You can have a working prototype in an afternoon and a production system in a week.

The engineering is not in the infrastructure. It's in the chunking, the eval dataset, the hybrid scoring weights, and the prompt design. Focus your time there.
