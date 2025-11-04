import React, { useState, useEffect } from "react";
import {
  Sparkles,
  BookOpen,
  FileText,
  Upload,
  Loader2,
  Save,
  Trash2,
  Edit2,
  X,
  Download,
  ChevronRight,
} from "lucide-react";

const EasyAssessment = () => {
  const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
  const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;

  const chaptersStructure = [
    {
      id: 0,
      title: "Chapter 0: The Beginning",
      units: [{ id: 0, name: "Introduction" }],
    },
    {
      id: 1,
      title: "Chapter 1: About Me",
      units: [
        { id: 1, name: "Unit 1: Galang from Kalimantan" },
        { id: 2, name: "Unit 2: I Love Fishing" },
        { id: 3, name: "Unit 3: My Friends and I" },
      ],
    },
    {
      id: 2,
      title: "Chapter 2: Culinary and Me",
      units: [
        { id: 1, name: "Unit 1: My Favorite Food" },
        { id: 2, name: "Unit 2: My Favorite Snack" },
        { id: 3, name: "Unit 3: A Secret Recipe" },
      ],
    },
    {
      id: 3,
      title: "Chapter 3: Home Sweet Home",
      units: [
        { id: 1, name: "Unit 1: My House" },
        { id: 2, name: "Unit 2: My House Chores" },
        { id: 3, name: "Unit 3: Let's Clean Up!" },
      ],
    },
    {
      id: 4,
      title: "Chapter 4: My School Activities",
      units: [
        { id: 1, name: "Unit 1: My Class Schedule" },
        { id: 2, name: "Unit 2: My Online Class" },
        { id: 3, name: "Unit 3: My Study Habits" },
      ],
    },
    {
      id: 5,
      title: "Chapter 5: This is My School",
      units: [
        { id: 1, name: "Unit 1: School Buildings" },
        { id: 2, name: "Unit 2: Extracurricular Activities" },
        { id: 3, name: "Unit 3: School Festival" },
      ],
    },
  ];

  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState(1);
  const [materialInput, setMaterialInput] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfText, setPdfText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAssessments, setGeneratedAssessments] = useState([]);
  const [savedAssessments, setSavedAssessments] = useState([]);
  const [showSavedList, setShowSavedList] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("easyAssessments");
    if (saved) {
      setSavedAssessments(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("easyAssessments", JSON.stringify(savedAssessments));
  }, [savedAssessments]);

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPdfFile(file);

    try {
      const text = await extractTextFromPdf(file);
      setPdfText(text);
      alert("PDF berhasil di-upload dan di-extract!");
    } catch (error) {
      alert("Gagal extract PDF. Coba file lain atau input manual.");
      console.error(error);
    }
  };

  const extractTextFromPdf = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const typedarray = new Uint8Array(e.target.result);
          // Simple text extraction - in production use pdf.js or similar
          const text = new TextDecoder().decode(typedarray);
          resolve(text);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const generateAssessments = async () => {
    if (!materialInput && !pdfText) {
      alert("Input deskripsi materi atau upload PDF dulu bre!");
      return;
    }

    if (!GROQ_API_KEY) {
      alert("Groq API Key belum di-set! Check .env file lo bre.");
      return;
    }

    setIsGenerating(true);
    setGeneratedAssessments([]);

    const currentChapter = chaptersStructure.find(
      (c) => c.id === selectedChapter
    );
    const currentUnit = currentChapter?.units.find(
      (u) => u.id === selectedUnit
    );

    const materialContext = pdfText || materialInput;

    const prompt = `You are an expert English teacher for Grade 7 students in Indonesia using the Kurikulum Merdeka.

Chapter: ${currentChapter.title}
Unit: ${currentUnit.name}

Material Context:
${materialContext}

Generate 5-7 diverse assessment ideas suitable for this material. For each assessment, provide:

1. Assessment Type (Quiz/Speaking/Writing/Listening/Project/Performance)
2. Title (catchy and specific)
3. Description (detailed explanation of the assessment)
4. Learning Objectives (what students will demonstrate)
5. Instructions (step-by-step for students)
6. Rubric/Criteria (clear scoring guidelines)
7. Estimated Time
8. Difficulty Level (Easy/Medium/Hard)
9. Materials Needed

Format your response as a JSON array of assessment objects with these exact keys:
type, title, description, objectives, instructions, rubric, estimatedTime, difficulty, materials

Return ONLY the JSON array, no other text.`;

    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are an expert English teacher assistant. Always respond with valid JSON only.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      // Parse JSON response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const assessments = JSON.parse(jsonMatch[0]);
        setGeneratedAssessments(assessments);
      } else {
        throw new Error("Invalid JSON response from AI");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal generate assessment. Check console untuk detail error.");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveAssessment = (assessment) => {
    const saved = {
      id: Date.now(),
      chapter: selectedChapter,
      unit: selectedUnit,
      chapterTitle: chaptersStructure.find((c) => c.id === selectedChapter)
        .title,
      unitName: chaptersStructure
        .find((c) => c.id === selectedChapter)
        .units.find((u) => u.id === selectedUnit).name,
      ...assessment,
      savedAt: new Date().toISOString(),
    };

    setSavedAssessments([...savedAssessments, saved]);
    alert("Assessment saved!");
  };

  const deleteAssessment = (id) => {
    if (window.confirm("Yakin mau hapus assessment ini?")) {
      setSavedAssessments(savedAssessments.filter((a) => a.id !== id));
    }
  };

  const exportAssessment = (assessment) => {
    const text = `
ASSESSMENT PLAN
================

Chapter: ${assessment.chapterTitle}
Unit: ${assessment.unitName}

Type: ${assessment.type}
Title: ${assessment.title}
Difficulty: ${assessment.difficulty}
Estimated Time: ${assessment.estimatedTime}

DESCRIPTION
-----------
${assessment.description}

LEARNING OBJECTIVES
-------------------
${assessment.objectives}

INSTRUCTIONS
------------
${assessment.instructions}

RUBRIC/CRITERIA
---------------
${assessment.rubric}

MATERIALS NEEDED
----------------
${assessment.materials}

Generated by EasyAssessment
Date: ${new Date(assessment.savedAt).toLocaleDateString("id-ID")}
    `;

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${assessment.title.replace(/[^a-z0-9]/gi, "_")}.txt`;
    a.click();
  };

  const currentChapter = chaptersStructure.find(
    (c) => c.id === selectedChapter
  );
  const currentUnit = currentChapter?.units.find((u) => u.id === selectedUnit);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="text-gray-700" size={28} />
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  EasyAssessment
                </h1>
                <p className="text-sm text-gray-500">
                  AI-Powered Assessment Generator
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSavedList(!showSavedList)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <FileText size={18} />
              Saved Assessments ({savedAssessments.length})
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {!showSavedList ? (
          <div className="grid grid-cols-12 gap-6">
            {/* Input Section */}
            <div className="col-span-5">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Generate Assessment Ideas
                </h2>

                {/* Chapter & Unit Selection */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chapter
                    </label>
                    <select
                      value={selectedChapter}
                      onChange={(e) => {
                        setSelectedChapter(parseInt(e.target.value));
                        const chapter = chaptersStructure.find(
                          (c) => c.id === parseInt(e.target.value)
                        );
                        setSelectedUnit(chapter.units[0].id);
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900">
                      {chaptersStructure.map((ch) => (
                        <option key={ch.id} value={ch.id}>
                          {ch.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <select
                      value={selectedUnit}
                      onChange={(e) =>
                        setSelectedUnit(parseInt(e.target.value))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900">
                      {currentChapter?.units.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Material Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material Description (Manual Input)
                  </label>
                  <textarea
                    value={materialInput}
                    onChange={(e) => setMaterialInput(e.target.value)}
                    placeholder="Describe the material: grammar points, vocabulary, topics, learning objectives..."
                    rows={6}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>

                {/* OR Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                {/* PDF Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload PDF Material
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handlePdfUpload}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label htmlFor="pdf-upload" className="cursor-pointer">
                      <Upload
                        size={32}
                        className="mx-auto mb-2 text-gray-400"
                      />
                      <p className="text-sm text-gray-600">
                        {pdfFile ? pdfFile.name : "Click to upload PDF"}
                      </p>
                      {pdfText && (
                        <p className="text-xs text-green-600 mt-2">
                          ✓ PDF extracted successfully
                        </p>
                      )}
                    </label>
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateAssessments}
                  disabled={isGenerating || (!materialInput && !pdfText)}
                  className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed">
                  {isGenerating ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Generate Assessment Ideas
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results Section */}
            <div className="col-span-7">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Generated Assessments
                  {generatedAssessments.length > 0 && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({generatedAssessments.length} ideas)
                    </span>
                  )}
                </h2>

                {generatedAssessments.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
                    <p>No assessments generated yet</p>
                    <p className="text-sm mt-1">
                      Fill in the material info and click generate
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {generatedAssessments.map((assessment, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                                {assessment.type}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  assessment.difficulty === "Easy"
                                    ? "bg-green-50 text-green-700"
                                    : assessment.difficulty === "Medium"
                                    ? "bg-yellow-50 text-yellow-700"
                                    : "bg-red-50 text-red-700"
                                }`}>
                                {assessment.difficulty}
                              </span>
                              <span className="text-xs text-gray-500">
                                {assessment.estimatedTime}
                              </span>
                            </div>
                            <h3 className="font-semibold text-gray-900">
                              {assessment.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {assessment.description}
                            </p>
                          </div>
                          <button
                            onClick={() => saveAssessment(assessment)}
                            className="ml-4 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Save Assessment">
                            <Save size={18} />
                          </button>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">
                              Objectives:
                            </span>
                            <p className="text-gray-600 mt-1">
                              {assessment.objectives}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">
                              Instructions:
                            </span>
                            <p className="text-gray-600 mt-1 whitespace-pre-wrap">
                              {assessment.instructions}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">
                              Rubric:
                            </span>
                            <p className="text-gray-600 mt-1 whitespace-pre-wrap">
                              {assessment.rubric}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">
                              Materials Needed:
                            </span>
                            <p className="text-gray-600 mt-1">
                              {assessment.materials}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Saved Assessments List */
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Saved Assessments
              </h2>
              <button
                onClick={() => setShowSavedList(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            {savedAssessments.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <FileText size={48} className="mx-auto mb-4 opacity-30" />
                <p>No saved assessments yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedAssessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                            {assessment.type}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              assessment.difficulty === "Easy"
                                ? "bg-green-50 text-green-700"
                                : assessment.difficulty === "Medium"
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-red-50 text-red-700"
                            }`}>
                            {assessment.difficulty}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900">
                          {assessment.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {assessment.chapterTitle} - {assessment.unitName}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Saved:{" "}
                          {new Date(assessment.savedAt).toLocaleDateString(
                            "id-ID"
                          )}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => exportAssessment(assessment)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Export">
                          <Download size={18} />
                        </button>
                        <button
                          onClick={() => deleteAssessment(assessment.id)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EasyAssessment;
