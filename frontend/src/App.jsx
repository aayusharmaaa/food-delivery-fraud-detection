import React, { useState, useEffect } from 'react';
import { Upload, AlertTriangle, CheckCircle, XCircle, FileText, History } from 'lucide-react';
import { cn } from "@/lib/utils";

function App() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('http://localhost:8000/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (error) {
      console.error("Failed to fetch history", error);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (selectedFile) => {
    setFile(selectedFile);
    setLoading(true);
    setAnalysis(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setAnalysis(data);
        fetchHistory(); // Refresh history
      } else {
        alert("Analysis failed");
      }
    } catch (error) {
      console.error("Error analyzing file", error);
      alert("Error analyzing file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Fraud Detection Dashboard</h1>
            <p className="text-slate-500 mt-1">Analyze food delivery images for AI-generation fraud.</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            System Operational
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Upload & Analysis */}
          <div className="lg:col-span-2 space-y-6">

            {/* Upload Zone */}
            <div
              className={cn(
                "relative border-2 border-dashed rounded-xl p-12 transition-all duration-200 ease-in-out flex flex-col items-center justify-center text-center cursor-pointer bg-white",
                dragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload').click()}
            >
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleChange}
              />
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Upload Image Evidence</h3>
              <p className="text-slate-500 mt-2 text-sm">Drag and drop or click to browse</p>
              <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WEBP</p>
            </div>

            {/* Analysis Result */}
            {loading && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-600 font-medium">Analyzing Metadata & AI Patterns...</p>
              </div>
            )}

            {!loading && analysis && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-slate-500" />
                    Analysis Report
                  </h2>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-sm font-bold",
                    analysis.verdict === 'APPROVE' ? "bg-green-100 text-green-700" :
                      analysis.verdict === 'REVIEW' ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                  )}>
                    {analysis.verdict}
                  </span>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <img
                      src={`http://localhost:8000/uploads/${analysis.filename}`}
                      alt="Analyzed"
                      className="w-full h-64 object-cover rounded-lg border border-slate-200"
                    />
                    <p className="mt-2 text-xs text-slate-400 truncate">{analysis.filename}</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-500">Risk Score</span>
                        <span className="text-2xl font-bold text-slate-900">{analysis.risk_score}/100</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            analysis.risk_score < 30 ? "bg-green-500" :
                              analysis.risk_score < 70 ? "bg-yellow-500" : "bg-red-500"
                          )}
                          style={{ width: `${analysis.risk_score}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-3">Detection Flags</h4>
                      {analysis.reasons.length === 0 ? (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg text-sm">
                          <CheckCircle className="w-4 h-4" />
                          No suspicious patterns detected.
                        </div>
                      ) : (
                        <ul className="space-y-2">
                          {analysis.reasons.map((reason, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                              <AlertTriangle className="w-4 h-4 shrink-0" />
                              {reason}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: History */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-fit">
            <div className="p-4 border-b border-slate-100 flex items-center gap-2">
              <History className="w-5 h-5 text-slate-500" />
              <h3 className="font-semibold text-slate-900">Recent Scans</h3>
            </div>
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {history.map((item) => (
                <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex gap-4">
                  <img
                    src={`http://localhost:8000/uploads/${item.filename}`}
                    alt="Thumbnail"
                    className="w-16 h-16 object-cover rounded-md border border-slate-200 bg-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded",
                        item.verdict === 'APPROVE' ? "bg-green-100 text-green-700" :
                          item.verdict === 'REVIEW' ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                      )}>
                        {item.verdict}
                      </span>
                      <span className="text-xs text-slate-400">{new Date(item.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-700 truncate mb-1">{item.filename}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Score: {item.risk_score}</span>
                    </div>
                  </div>
                </div>
              ))}
              {history.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-sm">
                  No scan history yet.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
