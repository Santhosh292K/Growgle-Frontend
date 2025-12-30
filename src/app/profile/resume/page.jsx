"use client";

import React, { useEffect, useRef, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { compileLatex as compileLatexApi, uploadResume as uploadResumeApi, getResumeSource as getResumeSourceApi } from "@/lib/services/profileApi";

const DEFAULT_TEMPLATE = `\\documentclass[11pt]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage[hidelinks]{hyperref}
\\usepackage{lmodern}
\\begin{document}
\\begin{center}
  {\\LARGE Your Name}\\\\
  \\vspace{2pt}
  \\href{mailto:your@email.com}{your@email.com} \\textbar{}
  +1~234~567~8901 \\textbar{}
  LinkedIn: \\url{https://linkedin.com/in/your} \\textbar{}
  GitHub: \\url{https://github.com/your}
\\end{center}

\\section*{Summary}
Brief summary about your skills and experience.

\\section*{Experience}
\\textbf{Company}, Role \\hfill 2023--Present\\\\
\\begin{itemize}
  \\item Key achievement one
  \\item Key achievement two
\\end{itemize}

\\section*{Education}
University Name, Degree, Year

\\section*{Skills}
Language1, Language2, Tool1, Tool2

\\end{document}`;

export default function ResumeEditorPage() {
  const [template, setTemplate] = useState("template1.tex");
  const [latex, setLatex] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [livePreview, setLivePreview] = useState(false);
  const editorTextAreaRef = useRef(null);
  const debounceRef = useRef(null);
  const lastBlobUrlRef = useRef("");

  const loadUserLatex = async () => {
    try {
      const res = await getResumeSourceApi();
      const data = res?.data;
      if (!data) throw new Error("no data");
      if (typeof data === "string") {
        try {
          const j = JSON.parse(data);
          if (j?.latex && typeof j.latex === "string" && j.latex.trim()) return j.latex;
        } catch {
          if (data.trim()) return data;
        }
      }
      if (typeof data === "object" && data?.latex && typeof data.latex === "string") return data.latex;
    } catch {}
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem("resumeEditor.latex") : null;
      if (saved && saved.trim()) return saved;
    } catch {}
    return null;
  };

  const compileToBlob = async () => {    
    try {
      if (typeof compileLatexApi === "function") {
        const res = await compileLatexApi(buildLatexForCompile(latex));
        console.log("compileLatexApi response:", res);
        if (res?.data) return res.data;
      }
    } catch (_) {
    }
  };

  const buildLatexForCompile = (src) => {
    const hasDoc =
      /\\documentclass/.test(src) || /\\begin\{document\}/.test(src);
    if (hasDoc) return src;
    return `\\documentclass[11pt]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage[hidelinks]{hyperref}
\\usepackage{lmodern}
\\begin{document}
${src}
\\end{document}`;
  };

  useEffect(() => {
    const init = async () => {
      // Prefer user's stored LaTeX
      const userLatex = await loadUserLatex();
      if (userLatex) {
        setLatex(userLatex);
        return;
      }
      try {
        const res = await fetch(`/${template}`);
        const txt = res.ok ? await res.text() : DEFAULT_TEMPLATE;
        setLatex(txt);
      } catch {
        setLatex(DEFAULT_TEMPLATE);
      }
    };
    init();
    return () => {
      if (lastBlobUrlRef.current) URL.revokeObjectURL(lastBlobUrlRef.current);
    };
  }, [template]);

  const scheduleCompile = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => compileLatex(), 600);
  };

  useEffect(() => {
    if (livePreview) scheduleCompile();
    try {
      if (latex) localStorage.setItem("resumeEditor.latex", latex);
    } catch {}
  }, [latex, livePreview]);

  const compileLatex = async () => {
    try {
      setIsCompiling(true);
      const blob = await compileToBlob();
      if (lastBlobUrlRef.current) URL.revokeObjectURL(lastBlobUrlRef.current);
      const url = URL.createObjectURL(blob);
      lastBlobUrlRef.current = url;
      setPdfUrl(url);
    } catch (err) {
      alert(err?.message || "Compile failed");
    } finally {
      setIsCompiling(false);
    }
  };

  const downloadPdf = async () => {
    try {
      const blob = await compileToBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err?.message || "Compile failed");
    }
  };

  const uploadCompiledPdf = async () => {
    try {
      setIsUploading(true);
      const blob = await compileToBlob();
      const file = new File([blob], "resume.pdf", { type: "application/pdf" });
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("latex", latex);
      await uploadResumeApi(formData);
      window.location.href = "/profile";
    } catch (err) {
      alert(err?.message || "Upload failed. Please check your token or file.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex items-center gap-3">
            <button className="text-blue-600 hover:scale-110 transition">
              <a href="/profile">
                &larr; Back to Profile
              </a>
            </button>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="border rounded px-3 py-2 bg-white"
            >
              <option value="template1.tex">Classic Resume</option>
              <option value="template2.tex">Modern Resume</option>
            </select>
            <button
              onClick={compileLatex}
              disabled={isCompiling}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {isCompiling ? "Compiling..." : "Compile PDF"}
            </button>
            <button
              onClick={downloadPdf}
              className="border px-4 py-2 rounded bg-white"
            >
              Download PDF
            </button>
            <button
              onClick={uploadCompiledPdf}
              disabled={isUploading || isCompiling}
              className="border px-4 py-2 rounded bg-white disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Upload Compiled PDF"}
            </button>
            <label className="flex items-center gap-2 ml-auto text-sm">
              <input
                type="checkbox"
                checked={livePreview}
                onChange={(e) => setLivePreview(e.target.checked)}
              />
              Live preview
            </label>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white border rounded h-[75vh] flex flex-col">
              <div className="border-b p-2 text-sm text-gray-600">
                LaTeX Editor
              </div>
              <div className="flex-1 min-h-0 overflow-hidden">
                <textarea
                  ref={editorTextAreaRef}
                  value={latex}
                  onChange={(e) => setLatex(e.target.value)}
                  className="w-full h-full outline-none"
                />
              </div>
            </div>
            <div className="bg-white border rounded h-[75vh] flex flex-col">
              <div className="border-b p-2 text-sm text-gray-600">
                PDF Preview
              </div>
              {pdfUrl ? (
                <iframe
                  title="PDF Preview"
                  src={pdfUrl}
                  className="flex-1 w-full"
                />
              ) : (
                <div className="flex-1 w-full flex items-center justify-center text-gray-400 text-sm">
                  Compile to preview
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
