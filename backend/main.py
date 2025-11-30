# ... (imports remain the same)
from fastapi.staticfiles import StaticFiles
import uuid

# ... (logging and app setup remain the same)

# Mount uploads directory
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# ... (CORS and DB setup remain the same)

@app.post("/analyze")
async def analyze_endpoint(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Save the file locally
        file_ext = os.path.splitext(file.filename)[1] or ".jpg"
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = os.path.join("uploads", unique_filename)
        
        # Reset cursor to save
        image.save(file_path)
        
        # Ensure image is RGB for analysis
        if image.mode != "RGB":
            image = image.convert("RGB")

        risk_score = 0
        reasons = []
        
        # ... (Analysis logic remains the same) ...

        # Verdict
        if risk_score < 30:
            verdict = "APPROVE"
        elif risk_score <= 70:
            verdict = "REVIEW"
        else:
            verdict = "REJECT"

        # Save to DB (Store the unique filename/path)
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute("INSERT INTO scans (filename, risk_score, verdict, reasons) VALUES (?, ?, ?, ?)",
                  (unique_filename, risk_score, verdict, json.dumps(reasons)))
        conn.commit()
        conn.close()

        return {
            "filename": unique_filename,
            "risk_score": risk_score,
            "verdict": verdict,
            "reasons": reasons,
            "ai_confidence": ai_confidence
        }

    except Exception as e:
        logger.error(f"Analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ... (History endpoint remains the same)
