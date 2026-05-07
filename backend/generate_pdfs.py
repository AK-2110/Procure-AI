from fpdf import FPDF
import os

def create_pdf(filename, title, content):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", 'B', 16)
    pdf.cell(200, 10, txt=title, ln=True, align='C')
    
    pdf.set_font("Arial", size=12)
    pdf.ln(10)
    for line in content:
        pdf.multi_cell(0, 10, txt=line)
        
    pdf.output(filename)
    print(f"Created {filename}")

if __name__ == "__main__":
    os.makedirs("dummy_docs", exist_ok=True)
    
    # 1. Tender Document
    create_pdf(
        "dummy_docs/CRPF_Tender.pdf", 
        "Tender Document: CRPF-2026-X", 
        [
            "This document outlines the eligibility criteria for the procurement of IT hardware.",
            "",
            "1. Financial Criterion (Mandatory):",
            "The bidder must have a minimum average annual turnover of at least Rs. 5 Crores in the last three financial years.",
            "",
            "2. Technical Criterion (Mandatory):",
            "The bidder must have successfully completed at least 3 similar projects in the last 5 years.",
            "",
            "3. Compliance Criterion (Optional but preferred):",
            "The bidder should preferably hold a valid ISO 9001:2015 Certification."
        ]
    )

    # 2. Bidder Alpha (Perfect Match)
    create_pdf(
        "dummy_docs/Bidder_Alpha.pdf", 
        "Bid Submission: Alpha Buildworks Ltd", 
        [
            "Financial Statement:",
            "Our average annual turnover for the last three years is Rs. 6.2 Crores.",
            "",
            "Technical Experience:",
            "We have completed 4 similar IT hardware projects for state governments between 2022 and 2025.",
            "",
            "Compliance:",
            "We hold a valid ISO 9001:2015 certification (Attached separately as ISO_Alpha.pdf)."
        ]
    )

    # 3. Bidder Omega (Ambiguous / Yellow Flag)
    create_pdf(
        "dummy_docs/Bidder_Omega.pdf", 
        "Bid Submission: Omega Construct", 
        [
            "Financial Statement (Scanned from blurry original):",
            "Total earnings for the period: ~480 Mn (Note: Unit confusion between Millions and Lakhs).",
            "",
            "Technical Experience:",
            "Completed exactly 3 similar projects in 2021, 2023, and 2024.",
            "",
            "Compliance:",
            "We have an ISO 9001:2008 certification."
        ]
    )

    # 4. Bidder Prime (Ineligible / Red Flag)
    create_pdf(
        "dummy_docs/Bidder_Prime.pdf", 
        "Bid Submission: Prime EPC", 
        [
            "Financial Statement:",
            "Our annual turnover is Rs. 12.5 Crores.",
            "",
            "Technical Experience:",
            "We are a new startup and have completed 1 similar project so far.",
            "",
            "Compliance:",
            "Valid ISO 9001:2015 is present."
        ]
    )
