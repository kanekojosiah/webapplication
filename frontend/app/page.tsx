"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"

export default function Home() {
  const [equation, setEquation] = useState("")
  const [result, setResult] = useState("")
  const [question, setQuestion] = useState("")
  const [steps, setSteps] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [questionType, setQuestionType] = useState("random")
  const [animateResult, setAnimateResult] = useState(false)
  const [visibleSteps, setVisibleSteps] = useState<number[]>([])
  const cardRef = useRef<HTMLDivElement>(null)

  const solveEquation = async () => {
    if (!equation.trim()) {
      setResult("Please enter a question or equation.")
      setSteps([])
      return
    }

    setLoading(true)
    setResult("")
    setSteps([])
    setVisibleSteps([])
    setAnimateResult(false)

    try {
      const response = await axios.post(
        "http://localhost:5000/api/math/solve",
        { equation }
      )

      setResult(response.data.result)
      setSteps(response.data.steps || [])
      setTimeout(() => setAnimateResult(true), 50)
    } catch {
      setResult("Failed to solve equation")
      setSteps([])
      setTimeout(() => setAnimateResult(true), 50)
    }

    setLoading(false)
  }

  const generateQuestion = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/math/generate",
        { type: questionType }
      )
      setQuestion(response.data.question)
    } catch {
      setQuestion("Failed to generate question")
    }
  }

  useEffect(() => {
    if (steps.length > 0) {
      steps.forEach((_, i) => {
        setTimeout(() => {
          setVisibleSteps(prev => [...prev, i])
        }, i * 120)
      })
    }
  }, [steps])

  const examples = [
    "2 + 2",
    "x² - 9 = 0",
    "2x + 5 = 15",
    "What is two plus two?",
  ]

  return (
    <main className="min-h-screen text-white" style={{ background: "#08091A" }}>
      {/* Ambient background orbs */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: "-20%", left: "-10%",
          width: "60vw", height: "60vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,92,252,0.12) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: "-10%", right: "-5%",
          width: "50vw", height: "50vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)",
        }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16" style={{ zIndex: 1 }}>

        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase"
            style={{
              background: "rgba(124,92,252,0.15)",
              border: "1px solid rgba(124,92,252,0.3)",
              color: "#A78BFA",
              letterSpacing: "0.1em",
            }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#7C5CFC",
              display: "inline-block",
              animation: "pulse 2s ease-in-out infinite",
            }} />
            AI-Powered Learning
          </div>

          <h1 className="font-bold mb-4" style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            background: "linear-gradient(135deg, #fff 40%, #A78BFA 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Math Solver
          </h1>

          <p style={{ color: "#64748B", fontSize: "1.1rem", maxWidth: "38ch", lineHeight: 1.6 }}>
            Solve equations, understand solutions, and generate practice problems — step by step.
          </p>
        </div>

        {/* Solver Card */}
        <div
          ref={cardRef}
          className="rounded-3xl p-6 sm:p-8 mb-6"
          style={{
            background: "rgba(15,17,35,0.8)",
            border: "1px solid rgba(124,92,252,0.2)",
            backdropFilter: "blur(12px)",
            boxShadow: loading
              ? "0 0 0 1px rgba(124,92,252,0.5), 0 0 60px rgba(124,92,252,0.2)"
              : "0 0 0 1px rgba(124,92,252,0.15), 0 24px 48px rgba(0,0,0,0.4)",
            transition: "box-shadow 0.4s ease",
          }}
        >
          <h2 className="text-xl font-semibold mb-1" style={{ color: "#E2E8F0" }}>
            Enter a problem
          </h2>
          <p className="mb-5 text-sm" style={{ color: "#475569" }}>
            Equations, expressions, or plain English — all work.
          </p>

          <textarea
            placeholder={"e.g. x² - 9 = 0\nor: What is two plus two?"}
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) solveEquation()
            }}
            rows={4}
            style={{
              width: "100%",
              padding: "1rem 1.25rem",
              borderRadius: "1rem",
              background: "rgba(8,9,26,0.7)",
              border: "1px solid rgba(124,92,252,0.25)",
              color: "#E2E8F0",
              fontSize: "1rem",
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
              outline: "none",
              resize: "none",
              lineHeight: 1.6,
              transition: "border-color 0.2s ease",
              boxSizing: "border-box",
            }}
            onFocus={e => (e.target.style.borderColor = "rgba(124,92,252,0.6)")}
            onBlur={e => (e.target.style.borderColor = "rgba(124,92,252,0.25)")}
          />

          {/* Example pills */}
          <div className="flex flex-wrap gap-2 mt-3">
            {examples.map((ex) => (
              <button
                key={ex}
                onClick={() => setEquation(ex)}
                style={{
                  background: "rgba(124,92,252,0.08)",
                  border: "1px solid rgba(124,92,252,0.2)",
                  color: "#A78BFA",
                  padding: "4px 12px",
                  borderRadius: "999px",
                  fontSize: "0.78rem",
                  fontFamily: "'JetBrains Mono', monospace",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={e => {
                  (e.target as HTMLButtonElement).style.background = "rgba(124,92,252,0.2)"
                  ;(e.target as HTMLButtonElement).style.borderColor = "rgba(124,92,252,0.5)"
                }}
                onMouseLeave={e => {
                  (e.target as HTMLButtonElement).style.background = "rgba(124,92,252,0.08)"
                  ;(e.target as HTMLButtonElement).style.borderColor = "rgba(124,92,252,0.2)"
                }}
              >
                {ex}
              </button>
            ))}
          </div>

          {/* Question type + buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6 items-start sm:items-end">
            <div className="flex-1 min-w-0">
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-widest" style={{ color: "#475569" }}>
                Practice type
              </label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.65rem 1rem",
                  borderRadius: "0.75rem",
                  background: "rgba(8,9,26,0.7)",
                  border: "1px solid rgba(124,92,252,0.25)",
                  color: "#E2E8F0",
                  fontSize: "0.9rem",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="random">Random</option>
                <option value="algebra">Algebra</option>
                <option value="arithmetic">Arithmetic</option>
                <option value="wordProblem">Word Problem</option>
              </select>
            </div>

            <div className="flex gap-3 shrink-0">
              <button
                onClick={solveEquation}
                disabled={loading}
                style={{
                  padding: "0.7rem 1.6rem",
                  borderRadius: "0.875rem",
                  background: loading
                    ? "rgba(124,92,252,0.4)"
                    : "linear-gradient(135deg, #7C5CFC, #6D28D9)",
                  border: "none",
                  color: "#fff",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "all 0.2s ease",
                  boxShadow: loading ? "none" : "0 4px 20px rgba(124,92,252,0.4)",
                  whiteSpace: "nowrap",
                }}
              >
                {loading ? (
                  <>
                    <SpinnerIcon />
                    Solving…
                  </>
                ) : "Solve  ↵"}
              </button>

              <button
                onClick={generateQuestion}
                style={{
                  padding: "0.7rem 1.4rem",
                  borderRadius: "0.875rem",
                  background: "rgba(34,211,238,0.1)",
                  border: "1px solid rgba(34,211,238,0.25)",
                  color: "#22D3EE",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => {
                  const btn = e.currentTarget
                  btn.style.background = "rgba(34,211,238,0.18)"
                  btn.style.boxShadow = "0 0 20px rgba(34,211,238,0.2)"
                }}
                onMouseLeave={e => {
                  const btn = e.currentTarget
                  btn.style.background = "rgba(34,211,238,0.1)"
                  btn.style.boxShadow = "none"
                }}
              >
                Generate ✦
              </button>
            </div>
          </div>

          <p className="mt-3 text-xs" style={{ color: "#334155" }}>
            Tip: press ⌘ + Enter to solve quickly
          </p>
        </div>

        {/* Answer + Practice Question */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

          {/* Answer */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(15,17,35,0.8)",
              border: animateResult && result
                ? "1px solid rgba(34,211,238,0.35)"
                : "1px solid rgba(255,255,255,0.06)",
              transition: "all 0.4s ease",
              boxShadow: animateResult && result
                ? "0 0 40px rgba(34,211,238,0.12)"
                : "none",
            }}
          >
            <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "#475569" }}>
              Answer
            </p>
            <p
              className="font-bold wrap-break-words"
              style={{
                fontSize: result && result.length < 20 ? "2.25rem" : "1.4rem",
                fontFamily: "'JetBrains Mono', monospace",
                color: result ? "#22D3EE" : "#1E293B",
                opacity: animateResult ? 1 : 0,
                transform: animateResult ? "translateY(0)" : "translateY(8px)",
                transition: "all 0.4s ease",
                lineHeight: 1.3,
              }}
            >
              {result || "—"}
            </p>
          </div>

          {/* Practice Question */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(15,17,35,0.8)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "#475569" }}>
              Practice question
            </p>
            <p style={{
              color: question ? "#CBD5E1" : "#1E293B",
              fontSize: "0.95rem",
              lineHeight: 1.65,
            }}>
              {question || "No question yet — pick a type and click Generate."}
            </p>
          </div>
        </div>

        {/* Steps */}
        {(steps.length > 0 || loading) && (
          <div
            className="rounded-2xl p-6 sm:p-8"
            style={{
              background: "rgba(15,17,35,0.8)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p className="text-xs font-medium uppercase tracking-widest mb-5" style={{ color: "#475569" }}>
              Step-by-step
            </p>

            {loading ? (
              <div className="flex items-center gap-3" style={{ color: "#475569", fontSize: "0.9rem" }}>
                <SpinnerIcon />
                Calculating…
              </div>
            ) : (
              <ol className="space-y-3" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {steps.map((step, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "flex-start",
                      opacity: visibleSteps.includes(i) ? 1 : 0,
                      transform: visibleSteps.includes(i) ? "translateX(0)" : "translateX(-12px)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: "rgba(124,92,252,0.15)",
                        border: "1px solid rgba(124,92,252,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        color: "#A78BFA",
                        marginTop: "2px",
                      }}
                    >
                      {i + 1}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        padding: "0.6rem 1rem",
                        borderRadius: "0.75rem",
                        background: "rgba(124,92,252,0.04)",
                        borderLeft: "2px solid rgba(124,92,252,0.4)",
                        color: "#CBD5E1",
                        fontSize: "0.92rem",
                        lineHeight: 1.6,
                        fontFamily: step.match(/[=x\^*/+\-]/) ? "'JetBrains Mono', monospace" : "inherit",
                      }}
                    >
                      {step}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}

        {steps.length === 0 && !loading && (
          <div
            className="rounded-2xl p-6 sm:p-8 text-center"
            style={{
              background: "rgba(15,17,35,0.5)",
              border: "1px dashed rgba(255,255,255,0.06)",
            }}
          >
            <p style={{ color: "#1E293B", fontSize: "0.9rem" }}>
              Step-by-step explanation will appear here after solving.
            </p>
          </div>
        )}

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap');

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        select option {
          background: #0F1123;
          color: #E2E8F0;
        }

        * {
          box-sizing: border-box;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  )
}

function SpinnerIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ animation: "spin 0.8s linear infinite", flexShrink: 0 }}
    >
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
      <path
        d="M8 2a6 6 0 0 1 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
