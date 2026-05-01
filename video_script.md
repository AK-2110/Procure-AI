# 🎥 ProcureAI: 5-Minute Video Walkthrough Script

**Theme 3: AI-Based Tender Evaluation and Eligibility Analysis for Government Procurement by CRPF**

---

## 0:00 - 0:45 | Introduction & Problem Statement
**(Visuals: Team introduction slide -> Slide showing the "Verification Bottleneck" in government procurement)**

**Speaker:**
"Hello everyone, we are presenting ProcureAI. Government procurement, especially for critical organizations like the CRPF, is built on strict eligibility criteria. Today, a committee can spend days manually cross-checking hundreds of pages of highly varied bidder submissions—from PDFs to skewed mobile phone scans—just to see if a bidder meets basic financial or technical thresholds. 

This process is slow, error-prone, and inconsistent. The core problem isn't just reading text; it's about making a high-stakes, legally-binding decision based on that text. 

ProcureAI bridges this gap. It's a transparent, auditable platform that extracts tender criteria, analyzes heterogeneous bid documents using Multimodal AI, and most importantly—it never silently disqualifies a bidder. It empowers the procurement officer with a robust Human-in-the-Loop workflow."

## 0:45 - 1:45 | Platform Walkthrough: Tender Ingestion
**(Visuals: Screen recording of the ProcureAI Dashboard. The user clicks "Upload Tender PDF")**

**Speaker:**
"Let's look at the platform in action. The procurement officer starts by uploading a Tender Document. 

Behind the scenes, our system uses a Layout-Aware Document Parser and an Instruction-Tuned Large Language Model, such as Gemini 1.5 Pro. It automatically segments the document and extracts the eligibility matrix—separating Financial, Technical, and Compliance requirements, and semantically differentiating between 'Mandatory' and 'Optional' criteria."

**(Visuals: The UI shows the "Processing" scanning bar, then transitions to the Evaluation Matrix view)**

"Once the tender is parsed, the multimodal engine evaluates the bidders' submissions. Because we use a Vision-Language Model, the system handles native text, tables, and even low-quality scanned images simultaneously without relying on brittle OCR pipelines."

## 1:45 - 3:15 | The Evaluation Matrix & Human-In-The-Loop
**(Visuals: The camera pans across the Evaluation Matrix showing Green, Red, and Yellow cells.)**

**Speaker:**
"Here is the Evaluation Matrix. ProcureAI uses a 'Traffic Light' verdict system. 
Green means clear evidence of eligibility. Red means clear violation or a missing document. 

But the real magic happens in the Yellow cells. Our system flags ambiguous or uncertain cases for **Manual Review**. Let's click on this yellow flag for 'Omega Construct' under the Financial Turnover criterion."

**(Visuals: The presenter clicks the Yellow cell. The HITL Modal opens.)**

"The system extracted a value of '~480 Mn', but flagged it because the unit 'Millions' mixed with 'Lakhs' in the tender, and the scan quality was very poor. 

To build trust, ProcureAI provides Explainable AI (XAI). Notice on the right—the exact page of the scanned source document is displayed, with a bounding box precisely highlighting where the AI found the figure. The procurement officer can clearly read it themselves, verify the context, and make a final call to either 'Confirm Eligible' or 'Mark Ineligible'."

## 3:15 - 4:15 | Auditability & Government Compliance
**(Visuals: The presenter clicks 'Confirm Eligible', the cell turns green. Then navigates to 'System Logs' and 'Profile' tabs.)**

**Speaker:**
"For government procurement, auditability is non-negotiable. Every AI inference, every parsed document, and every human override—like the one we just did—is captured in an immutable, tamper-evident audit log. 

As you can see in the System Logs tab, it shows exactly who took the action, when, and on what document."

**(Visuals: The presenter clicks 'Export CSV Audit Log')**

"Finally, the officer can export a consolidated evaluation report. This comprehensive CSV includes the bidder names, criteria, values found, source document citations, and final verdicts. It serves as the official artifact ready for committee sign-off."

## 4:15 - 5:00 | Architecture, Risks, & Conclusion
**(Visuals: High-level Architecture Diagram showing Frontend, Backend, Gemini 1.5 Pro, and Vector DB)**

**Speaker:**
"Under the hood, we built this prototype using React and Vite, with a proposed Python FastAPI backend. The core intelligence relies on Multimodal LLMs capable of massive context windows to handle 100-page tenders. 

We mitigated the risk of 'AI Hallucinations' by enforcing strict extractive answering prompts—if the model can't quote the document, it defaults to a Yellow manual review. 

In Round 2, we are fully prepared to deploy this inside the hackathon sandbox, integrate with the provided mock documents, and prove that ProcureAI can drastically reduce evaluation time while maintaining 100% auditability and trust. Thank you."
