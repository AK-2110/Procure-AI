import os
import json
import asyncio
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini if API key is present
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
use_mock = True

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    use_mock = False

class Criterion(BaseModel):
    id: str
    type: str
    desc: str
    mandatory: bool

@app.post("/api/upload-tender")
async def upload_tender(file: UploadFile = File(...)):
    """
    Parses the Tender PDF and extracts eligibility criteria.
    """
    if use_mock:
        await asyncio.sleep(2) # Simulate processing
        return {
            "criteria": [
                { "id": "c1", "type": "Financial", "desc": "Minimum Turnover > ₹5 Cr", "mandatory": True },
                { "id": "c2", "type": "Technical", "desc": "3 similar projects in 5 yrs", "mandatory": True },
                { "id": "c3", "type": "Compliance", "desc": "ISO 9001:2015 Certification", "mandatory": False }
            ]
        }
    else:
        # Read file bytes
        content = await file.read()
        
        # Configure model
        model = genai.GenerativeModel('gemini-1.5-pro')
        prompt = """
        You are an expert procurement officer. Analyze the provided tender document and extract the eligibility criteria.
        Output ONLY a JSON array of objects with the following schema:
        [
            {
                "id": "c1", // auto-increment
                "type": "Financial" | "Technical" | "Compliance",
                "desc": "Short description of the criterion",
                "mandatory": true | false
            }
        ]
        """
        
        try:
            # Note: For full document parsing, we'd upload the file to Gemini via File API.
            # For simplicity in this script, assuming the file is small enough or we use a basic prompt.
            # In production, use genai.upload_file()
            response = model.generate_content([
                {'mime_type': file.content_type, 'data': content},
                prompt
            ])
            text = response.text.replace('```json', '').replace('```', '').strip()
            return {"criteria": json.loads(text)}
        except Exception as e:
            print("Gemini Error:", e)
            return {
                "criteria": [
                    { "id": "c1", "type": "Financial", "desc": "Minimum Turnover > ₹5 Cr", "mandatory": True },
                    { "id": "c2", "type": "Technical", "desc": "3 similar projects in 5 yrs", "mandatory": True },
                    { "id": "c3", "type": "Compliance", "desc": "ISO 9001:2015 Certification", "mandatory": False }
                ],
                "error": str(e),
                "fallback_to_mock": True
            }

@app.post("/api/evaluate-bidder")
async def evaluate_bidder(
    bidder_name: str = Form(...),
    criteria: str = Form(...), # JSON string
    file: UploadFile = File(...)
):
    """
    Evaluates a Bidder document against the extracted criteria.
    """
    if use_mock:
        await asyncio.sleep(1.5)
        
        # Simple mock logic based on bidder name
        if "Alpha" in bidder_name:
            return {
                "eval": {
                    "c1": { "status": "green", "val": "₹6.2 Cr", "doc": file.filename },
                    "c2": { "status": "green", "val": "4 Projects Found", "doc": file.filename },
                    "c3": { "status": "green", "val": "Target ISO Found", "doc": file.filename }
                }
            }
        elif "Omega" in bidder_name:
            return {
                "eval": {
                    "c1": { "status": "yellow", "val": "₹480 Mn(?)", "doc": file.filename, "ambiguity": "Currency unit 'Mn' mixed with 'Lakhs'. Scan quality poor." },
                    "c2": { "status": "green", "val": "3 Projects Found", "doc": file.filename },
                    "c3": { "status": "red", "val": "ISO 9001:2008 (Expired)", "doc": file.filename }
                }
            }
        else: # Prime EPC
            return {
                "eval": {
                    "c1": { "status": "green", "val": "₹12.5 Cr", "doc": file.filename },
                    "c2": { "status": "red", "val": "1 Project Found", "doc": file.filename },
                    "c3": { "status": "green", "val": "Valid ISO 9001:2015", "doc": file.filename }
                }
            }
    else:
        content = await file.read()
        model = genai.GenerativeModel('gemini-1.5-pro')
        prompt = f"""
        Evaluate the provided bidder document against these criteria: {criteria}.
        Output ONLY a JSON object mapping criterion ID to the evaluation result.
        Schema:
        {{
            "c1": {{
                "status": "green" | "yellow" | "red",
                "val": "Extracted value from document (keep short)",
                "doc": "{file.filename}",
                "ambiguity": "Only include this field if status is yellow. Explain why it needs manual review."
            }}
        }}
        """
        try:
            response = model.generate_content([
                {'mime_type': file.content_type, 'data': content},
                prompt
            ])
            text = response.text.replace('```json', '').replace('```', '').strip()
            return {"eval": json.loads(text)}
        except Exception as e:
            print("Gemini Error:", e)
            if "Alpha" in bidder_name:
                eval_data = {
                    "c1": { "status": "green", "val": "₹6.2 Cr", "doc": file.filename },
                    "c2": { "status": "green", "val": "4 Projects Found", "doc": file.filename },
                    "c3": { "status": "green", "val": "Target ISO Found", "doc": file.filename }
                }
            elif "Omega" in bidder_name:
                eval_data = {
                    "c1": { "status": "yellow", "val": "₹480 Mn(?)", "doc": file.filename, "ambiguity": "Currency unit 'Mn' mixed with 'Lakhs'. Scan quality poor." },
                    "c2": { "status": "green", "val": "3 Projects Found", "doc": file.filename },
                    "c3": { "status": "red", "val": "ISO 9001:2008 (Expired)", "doc": file.filename }
                }
            else: # Prime EPC
                eval_data = {
                    "c1": { "status": "green", "val": "₹12.5 Cr", "doc": file.filename },
                    "c2": { "status": "red", "val": "1 Project Found", "doc": file.filename },
                    "c3": { "status": "green", "val": "Valid ISO 9001:2015", "doc": file.filename }
                }
            return {"eval": eval_data, "error": str(e), "fallback_to_mock": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
