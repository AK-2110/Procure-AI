# ProcureAI: AI-Powered Tender Evaluation Platform

ProcureAI is an AI-driven platform built to assist procurement officers in evaluating tender bids. It automates the parsing of heterogeneous tender documents, evaluates bidder eligibility based on predefined criteria, and provides a transparent, human-in-the-loop interface for review.

## Architecture

The project consists of two main components:
- **Backend**: A FastAPI Python application that uses Google Gemini AI for document processing and evaluation.
- **Frontend**: A React/Vite web application that provides the user interface for procurement officers.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Python](https://www.python.org/) (v3.9 or higher recommended)
- A Google Gemini API Key

## Setup & Installation

### 1. Backend Setup

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Set up your environment variables:
   - Create a `.env` file in the `backend` directory.
   - Add your Gemini API key:
     ```env
     GEMINI_API_KEY=your_actual_api_key_here
     ```

### 2. Frontend Setup

1. Open a new terminal and navigate to the `app` directory:
   ```bash
   cd app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

To run the application, you need to start both the backend server and the frontend development server.

### Start the Backend

1. Navigate to the `backend` directory and activate the virtual environment (if not already activated).
2. Run the FastAPI server using Uvicorn:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will typically start on `http://localhost:8000`.

### Start the Frontend

1. Navigate to the `app` directory.
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will typically start on `http://localhost:5173`. Open this URL in your browser to interact with the platform.

## Working with Dummy Data

For demonstration purposes, you can generate dummy tender and bidder PDF documents:

1. Navigate to the `backend` directory.
2. Run the generation script:
   ```bash
   python generate_pdfs.py
   ```
   This will create sample PDFs in the `backend/dummy_docs` folder which you can use to test the evaluation pipeline.
