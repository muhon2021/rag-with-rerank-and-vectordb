# RAG Learning Lab — Aha Demo Questions (Pinecone)

These questions are chosen so that **Basic vs Chunked vs Hybrid vs Reranked** produce *visible* differences in the **debug panel** (retrieved chunks + scores) and in the final answer quality.

## Why your current example converged

Your query: **“Can contractors access production AWS access?”** is very specific and matches a compact, high-salience section in `aws-access-policy.md`.
So even the **Basic** retriever is likely to pull the same chunk(s), and the **LLM answers look similar** across stages.

For a bigger “aha”, ask questions that require:
- **Cross-document grounding** (joins across 2+ files)
- **Exact identifiers** (`POLICY-SEC-2025`, `AWS-ACCESS-REQUEST`)
- **Structured details** (tables/lists where chunk boundaries matter)

---

## Set A (Top impact, recommended order)

Run these in **Compare All** mode, then narrate:
“Only retrieval strategy changes — notice which chunks survive into the final context.”

### A1. Policy join + exact token
**Question:**  
“Which policy mandates MFA for VPN/email/admin consoles, and what are the password rules it defines (min length and rotation period)?”

**Best stage(s) to highlight:** Hybrid and Reranked  
**What to look for in debug panel:** security-related chunk selected; table fields (min length, 90-day rotation) included in final context.

### A2. AWS access process (structured steps + timelines)
**Question:**  
“How do I request AWS access? Include the Jira template name, manager approval timeline, and when access is provisioned.”

**Best stage(s) to highlight:** Chunked, then Hybrid/Reranked  
**What to look for:** fewer irrelevant chunks; final context includes all numbered steps from `aws-access-policy.md`.

### A3. “Exception” conditions + default outcome
**Question:**  
“Can contractors access production systems? If yes, list every exception condition; if not, what is the default outcome?”

**Best stage(s):** Reranked (usually best at extracting the complete list)  
**What to look for:** the exception bullet list and the “Default answer” sentence.

### A4. Cross-doc grounding for security + production access
**Question:**  
“In `POLICY-SEC-2025`, what are the password lockout rules after failed attempts, and how does that policy relate to the MFA requirement for initial AWS console login?”

**Best stage(s):** Hybrid and Reranked  
**What to look for:** retrieved chunks include both the security lockout table row and the AWS MFA sentence that references `POLICY-SEC-2025`.

---

## Set B (Secondary demos / bigger contrast)

### B1. Negative / anti-hallucination check (exact policy ID mismatch)
**Question:**  
“What is `POLICY-SEC-2024`?”

**Best stage(s):** Hybrid (often avoids returning near-matches) and Reranked  
**What to look for:** debug panel shows whether `POLICY-SEC-2025` chunks leak into the context even though the ID is different. The LLM should respond with “not enough information” if the exact policy isn’t present in retrieved context.

### B1b. Updated policy disambiguation (new data)
**Question:**  
“I found `POLICY-SEC-2024` in an old ticket. Is it still valid, and what control ID should we use now for AWS console MFA?”

**Best stage(s):** Hybrid and Reranked  
**What to look for:** high-quality answer should say `POLICY-SEC-2024` is retired and cite `SEC-CONTROL-MFA-A17`.

### B2. Leave rules: structured + multi-rule extraction
**Question:**  
“Full-time employees: how many annual leave days do they get, how does carryover work, and do sick leave days carry over?”

**Best stage(s):** Chunked and Reranked  
**What to look for:** final context contains both annual leave + sick leave sections (not just one).

### B3. Engineering guidelines: extract two policy-like bullets
**Question:**  
“According to the engineering guidelines, what is the production code peer review requirement, and what is the unit test coverage target?”

**Best stage(s):** Reranked  
**What to look for:** Reranked stage should keep the chunk(s) that contain both “peer review” and “80%” in the final context.

### B4. Security incident reporting: time + destination
**Question:**  
“If I suspect a security incident, where do I report it, and how fast do I need to report?”

**Best stage(s):** Hybrid and Reranked  
**What to look for:** context includes both the “within 1 hour” and the reporting destination (email/channel).

### B5. Multi-doc control mapping (new data)
**Question:**  
“Which documents mention `SEC-CONTROL-MFA-A17`, and what does each one say about MFA?”

**Best stage(s):** Hybrid then Reranked  
**What to look for:** retrieval should include both `security-policy.md` and `aws-access-policy.md`; weaker stages may return only one side.

---

## Demo narration tips (what to say during the workshop)

1. “Basic and Chunked both do vector retrieval, so they can converge when the query is easy.”
2. “Hybrid can outperform when the question includes exact identifiers like `POLICY-SEC-2025` or `AWS-ACCESS-REQUEST`.”
3. “Reranked often wins on extraction quality because it re-scores candidates and keeps the most relevant chunks for the final context window.”
