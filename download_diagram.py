import zlib
import base64
import urllib.request

mermaid_code = """flowchart TD
    %% Styles
    classDef start fill:#1f2937,stroke:#fff,color:#fff
    classDef ai_process fill:#8b5cf6,stroke:#fff,color:#fff
    classDef decision fill:#3b82f6,stroke:#fff,color:#fff
    classDef green fill:#10b981,stroke:#fff,color:#fff
    classDef red fill:#ef4444,stroke:#fff,color:#fff
    classDef yellow fill:#f59e0b,stroke:#fff,color:#000
    classDef human fill:#ec4899,stroke:#fff,color:#fff

    Start([1. Officer Uploads Tender PDF]):::start --> Extract[2. AI Extracts Criteria Matrix]:::ai_process
    Extract --> UploadBids([3. Officer Uploads Bidder Submissions]):::start
    
    UploadBids --> VLM[4. Multimodal AI Parses Bidder Docs]:::ai_process
    VLM --> Eval{5. Compare Bidder Data vs. Criteria}:::decision

    Eval -->|Clear Evidence Found| Green(Green: Eligible):::green
    Eval -->|Clear Violation/Missing| Red(Red: Ineligible):::red
    Eval -->|Ambiguity / Poor Scan| Yellow(Yellow: Needs Manual Review):::yellow

    Yellow --> HITL[6. Officer opens HITL Modal]:::human
    HITL --> ShowEvidence[Shows AI Extracted Value & Source Doc Snippet]:::ai_process
    ShowEvidence --> HumanDecision{7. Officer Overrides AI}:::human
    
    HumanDecision -->|Approves| Green
    HumanDecision -->|Rejects| Red

    Green --> Audit([8. Log Verdict to Audit Trail]):::start
    Red --> Audit
    Audit --> Export([9. Export Final CSV Report for Sign-off]):::start
"""

compressed = zlib.compress(mermaid_code.encode('utf-8'), 9)
encoded = base64.urlsafe_b64encode(compressed).decode('utf-8')
url = f"https://kroki.io/mermaid/png/{encoded}"

print(f"Downloading from Kroki API...")
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        with open("Working_Of_Features.png", "wb") as f:
            f.write(response.read())
    print("Downloaded successfully to Working_Of_Features.png")
except Exception as e:
    print(f"Error: {e}")
