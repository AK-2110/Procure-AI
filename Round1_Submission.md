# AI-Based Tender Evaluation and Eligibility Analysis Platform
**Hackathon Submission - Round 1**

---

## 1. Understanding the Problem and Context
Government procurement in India, particularly for critical security organizations like the Central Reserve Police Force (CRPF), operates under stringent regulations where fairness, transparency, and accountability are paramount. Tenders processed through portals like the Government e-Marketplace (GeM) generate massive volumes of unstructured, highly formal documents. 

The core challenge is not simply "reading text." Bidders submit highly heterogeneous documents—ranging from native PDFs to skewed, low-DPI scans and photographs of MSME/GST certificates. The language in these documents is legally careful, often ambiguous, and unstandardized across different companies. 

Currently, evaluation committees face a **"verification bottleneck"**. Manually cross-referencing hundreds of pages of bid submissions against multi-layered eligibility criteria (Financial, Technical, Legal) is incredibly error-prone and slow. The central goal of our solution is to bridge the "Trust Gap" between automated AI extraction and formal government decision-making. We propose a platform that acts as a powerful **decision-support system**—it does not silently disqualify bidders. Instead, it provides explainable recommendations, complete with source citations and a robust human-in-the-loop (HITL) workflow for ambiguous cases.

---

## 2. Extracting Eligibility Criteria from the Tender Document
To evaluate bids, the system must first deeply understand the requirements.

**Approach:**
1. **Document Structure Parsing:** Using a Layout-Aware Document Parser (e.g., LayoutLMv3 or Cloud Document AI), we segment the tender PDF into logical blocks (SCC, GCC, Technical Specs, Annexures).
2. **Criteria Categorization via LLM:** We process the parsed text through an instruction-tuned Large Language Model (e.g., Gemini 1.5 Pro). We prompt the LLM to extract requirements and classify them into:
   - **Financial:** (e.g., "Minimum Average Annual Turnover of ₹5 Crs")
   - **Technical:** (e.g., "3 similar projects in the last 5 years")
   - **Compliance/Legal:** (e.g., "Valid GST, ISO 9001:2015 Certification")
3. **Mandatory vs. Optional Differentiation:** The LLM uses semantic analysis to distinguish weightage. Keywords like *"Must"*, *"Shall"*, *"Mandatory"*, or *"Disqualification"* flag criteria as **Mandatory**. Keywords like *"Desirable"*, *"Preferred"*, or *"May"* flag them as **Optional**.
4. **JSON Structuring:** We convert the extracted criteria into a structured JSON schema representing the "Evaluation Matrix," allowing programmatic comparison downstream.

---

## 3. Parsing Heterogeneous Bidder Submissions
Bidder documents are notorious for their lack of uniformity. We must gracefully handle digital text, tables, and low-quality imagery.

**Approach:**
1. **Multimodal Data Ingestion Pipeline:** 
   - We utilize a unified Multimodal Vision-Language Model (VLM) like **Gemini 1.5 Pro**, which natively processes images, PDFs, and text simultaneously without relying purely on brittle cascaded OCR pipelines.
   - For highly degraded scans, we use an ensemble approach: enhancing the image (dewarping, contrast adjustment) and running enterprise-grade OCR (e.g., Tesseract or Google Cloud Vision) to supplement the VLM's understanding.
2. **Tabular Data Extraction:** Financials (balance sheets, P&L statements) are often in tables. We deploy specialized table extraction tools (like Deepdoctection or unstructured.io) to maintain row-column relationships before passing the context to the LLM.
3. **Value Harmonization:** The system normalizes extracted values to standard formats. For example, if a bidder states their turnover as "$600,000" and the tender requests "Crores INR", the evaluation logic will normalize currencies and units to ensure an apples-to-apples comparison.

---

## 4. Evaluation Logic and Explainable Verdicts
This is the core of the trust layer. The system must map the extracted Bidder JSON against the Tender Evaluation Matrix.

**Approach:**
1. **Criterion-by-Criterion Matching:** Each bidder gets an isolated evaluation loop against every criterion. It utilizes a zero-shot or few-shot LLM prompt to answer: *"Based on Document X, does the bidder satisfy Criterion Y?"*
2. **The "Traffic Light" Verdict System:**
   - **Green (Eligible):** Clear evidence found mathematically and semantically fulfilling the requirement.
   - **Red (Not Eligible):** Clear evidence found that violates the requirement, or complete absence of the required document.
   - **Yellow (Needs Manual Review):** The system encounters ambiguity. Examples: Poor scan quality where the "Turnover" figure is illegible; the bidder uploaded "ISO 9001:2008" but "ISO 9001:2015" is required; or edge-case legal phrasing.
3. **Explainability Engine (XAI):** *No silent disqualifications.* Every verdict includes:
   - **Criterion:** "Minimum Turnover > ₹5 Cr"
   - **Verdict:** "Eligible"
   - **Extracted Value:** "₹6.2 Cr"
   - **Evidence Citation:** "CA Certificate.pdf, Page 3, Paragraph 2" (Includes a bounding box coordinate over the source document to visually highlight the evidence in the UI).

---

## 5. Auditability and Government Compliance
For use by a formal committee like the CRPF, the platform must guarantee an unbreakable audit trail.

**Approach:**
1. **Immutable Action Logging:** Every AI inference, data extraction, and subsequent human action is logged in an append-only, tamper-evident database table.
2. **Full Data Lineage:** A procurement officer can trace the end-to-end journey. If the Final Report says "Bidder A meets Turnover", the UI allows the officer to click the value, which opens the exact page of the Bidder's CA Certificate with the number highlighted.
3. **Sign-off Workflow:** Officers review the consolidated evaluation matrix. They must explicitly resolve any "Yellow" (Manual Review) flags by inspecting the highlighted ambiguity. Once reviewed, the officer generates a digitally signed PDF report, capturing the state of the AI decisions and their manual overrides.

---

## 6. Architecture & Technology Stack
*   **Frontend:** React / Next.js (For a responsive, PDF-viewer integrated Procurement Dashboard).
*   **Backend:** Python FastAPI (High-performance API handling concurrent bidder evaluations).
*   **LLM Core:** 
    *   **Gemini 1.5 Pro:** Chosen for its massive context window (ideal for 100+ page tenders) and native multimodal capabilities (handling images directly).
*   **Document Processing:** LayoutLMv3, Unstructured.io (for chunking and parsing layout).
*   **Database:** 
    *   **PostgreSQL:** For structured relational data (users, tender metadata, audit logs).
    *   **pgvector (Vector DB):** For semantic search and RAG implementation during criteria matching.

---

## 7. Risks and Trade-offs
1. **Risk: Hallucination of Values.** 
   * **Mitigation:** We enforce strict "Extractive Answering" prompts. The LLM is instructed to output exact string quotes from the source document as evidence. If a quote cannot be found, it defaults to the "Manual Review" state.
2. **Risk: Illegible Scans/Handwriting.**
   * **Mitigation:** If the confidence score of the vision model drops below a predefined threshold, the system automatically flags that criterion for "Manual Review" rather than guessing.
3. **Trade-off: Cost & Speed vs. Accuracy.**
   * Processing using large multimodal models (like Gemini Pro) is compute-intensive and slower than classical regex matching. We accept higher latency in favor of superior accuracy, as procurement evaluations are high-stakes and not strictly real-time.

---

## 8. Round 2 Implementation Plan (Sandbox)
If selected for Round 2, our development plan is as follows:

*   **Week 1: Document Processing Pipeline Setup:**
    *   Set up FastAPI backend and integrate with Unstructured.io to ingest the provided mock tender and bidder documents.
    *   Develop the prompt engineering required to reliably extract the Evaluation Matrix.
*   **Week 2: Multimodal Matching Engine:**
    *   Integrate the Vision LLM to parse bidder documents. 
    *   Implement the core comparator logic (Green/Red/Yellow).
*   **Week 3: Explainability UI and Audit Layer:**
    *   Build the frontend dashboard with an embedded PDF viewer.
    *   Implement bounding box mapping so users can click an AI verdict and see the exact region on the source document.
    *   Implement the database audit log.
*   **Week 4: End-to-End Testing & Refinement:**
    *   Run the platform against all sandbox test cases.
    *   Fine-tune prompts to minimize False Positives/Negatives. Ensure edge cases (like photographs of documents) gracefully trigger the manual review loop.
