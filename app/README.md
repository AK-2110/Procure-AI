# ProcureAI: AI-Based Tender Evaluation Platform

**Hackathon Submission: Theme 3 - AI-Based Tender Evaluation and Eligibility Analysis for Government Procurement by CRPF**

## 🚀 Overview

ProcureAI is a robust, Human-In-The-Loop (HITL) platform designed to automate the extraction and evaluation of eligibility criteria from government tender documents. It addresses the "verification bottleneck" faced by procurement officers by providing a transparent, explainable, and auditable solution.

Our platform does **not** silently disqualify bidders. Instead, it utilizes advanced Multimodal Vision-Language Models (VLMs) to process heterogeneous bid submissions (PDFs, scans, photographs) and surfaces ambiguous cases for manual review via a Traffic Light evaluation matrix.

## 🎯 Key Features

1. **Automated Criteria Extraction**: Parses Tender PDFs to extract mandatory and optional requirements (Financial, Technical, Compliance).
2. **Multimodal Document Understanding**: Handles digital text, degraded scans, and photographs without relying purely on brittle OCR.
3. **Explainable AI (XAI)**: Every verdict is linked directly to the source document, highlighting the exact value and location of the extracted data.
4. **Traffic Light System**:
   - 🟢 **Eligible**: Clear evidence found.
   - 🔴 **Ineligible**: Clear violation or missing document.
   - 🟡 **Needs Review**: Ambiguous data surfaced for the human officer.
5. **Immutable Audit Trail**: End-to-end tracking of all AI inferences and manual overrides, exportable as a CSV for official sign-off.

## 💻 Working Prototype (Frontend Demo)

This repository contains a high-fidelity React (Vite) prototype demonstrating the end-to-end user journey of a Procurement Officer using ProcureAI.

### Getting Started

To run the prototype locally:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`.

### Demo Workflow

1. **Dashboard**: Click on "Upload Tender PDF" to simulate the ingestion of a tender document.
2. **Processing**: Watch the multimodal parser simulate the extraction of evaluation criteria and bidder analysis.
3. **Evaluation Matrix**: Review the results for 3 mock bidders across different criteria.
4. **Human-In-The-Loop (HITL)**: Click on the yellow "⚠ Review Required" cell for Omega Construct to see how the system surfaces ambiguity (e.g., confusing currency units on a scanned document). Resolve it by overriding the AI.
5. **Export Audit**: Click "Export CSV Audit Log" to download the finalized decisions.

## 🛠️ Technology Stack (Proposed Architecture)

- **Frontend**: React (Vite), Tailwind-inspired CSS for glassmorphism UI.
- **Backend (Proposed)**: Python FastAPI.
- **AI/ML Layer**: Gemini 1.5 Pro (Multimodal LLM), LayoutLMv3, Tesseract OCR.
- **Database**: PostgreSQL with pgvector for semantic retrieval.

## 🛡️ Hackathon Non-Negotiables Met

- ✅ Every verdict is explainable at the criterion level.
- ✅ The system never silently disqualifies a bidder (surfaces Yellow flags).
- ✅ Handles heterogeneous document types (scans, tables, text).
- ✅ Fully auditable for government procurement contexts.
