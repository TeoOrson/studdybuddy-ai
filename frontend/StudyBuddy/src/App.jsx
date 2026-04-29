import { useEffect, useRef, useState } from "react"
import axios from "axios"
import {
  Bot,
  Brain,
  FileText,
  HelpCircle,
  Lightbulb,
  Sparkles,
  Wand2,
  Search,
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"

const API_BASE = "http://127.0.0.1:8000"

const modes = [
  { id: "summarize", label: "Summarize", icon: FileText, endpoint: "/summarize", color: "cyan" },
  { id: "explain", label: "Explain", icon: Lightbulb, endpoint: "/explain", color: "violet" },
  { id: "quiz", label: "Quiz", icon: Sparkles, endpoint: "/quiz", color: "teal" },
  { id: "ask", label: "Ask", icon: HelpCircle, endpoint: "/ask", color: "pink" },
  { id: "studypack", label: "Study Pack", icon: Brain, endpoint: "/study-pack", color: "amber" },
  { id: "confusion", label: "Confusion Check", icon: Search, endpoint: "/confusion", color: "rose" },
]

const botTips = {
  summarize: "Summarize mode turns messy notes into quick review material.",
  explain: "Explain mode makes dense or technical notes easier to understand.",
  quiz: "Quiz mode helps you practice active recall.",
  ask: "Ask mode is best for targeted questions about your notes.",
  studypack: "Study Pack creates overview, explanation, quiz, answers, and takeaways.",
  confusion: "Confusion Check finds unclear, incomplete, or dense parts of your notes.",
}

const subjects = ["General", "Computer Science", "Math", "Physics", "Biology", "Writing"]

const subjectModelMap = {
  General: "deepseek:33b", //phi3:mini, deepseek:33b, qwen2.5:1.5b
  "Computer Science": "deepseek-coder:33b",
  Math: "deepseek-r1:14b",
  Physics: "deepseek-r1:14b",
  Biology: "qwen:14b",
  Writing: "qwen:14b",
}

function App() {
  const [selectedMode, setSelectedMode] = useState("summarize")
  const [notes, setNotes] = useState("")
  const [question, setQuestion] = useState("")
  const [botOpen, setBotOpen] = useState(false)
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)
  const [quizDifficulty, setQuizDifficulty] = useState("medium")
  const [history, setHistory] = useState([])
  const [subject, setSubject] = useState("General")
  const [model, setModel] = useState("llama3.1:8b")

  const [orbitAngle, setOrbitAngle] = useState(0)
  const [orbitBump, setOrbitBump] = useState(0)

  const [novaPrompt, setNovaPrompt] = useState("")
  const [novaPosition, setNovaPosition] = useState({
    x: window.innerWidth - 360,
    y: window.innerHeight - 180,
  })
  const [isDraggingNova, setIsDraggingNova] = useState(false)
  const [novaDragOffset, setNovaDragOffset] = useState({ x: 0, y: 0 })
  const [novaJustFinished, setNovaJustFinished] = useState(false)
  const [noteSpark, setNoteSpark] = useState("")
  const [outputSpark, setOutputSpark] = useState("")
  const [novaTasking, setNovaTasking] = useState(false)
  const [novaExpression, setNovaExpression] = useState("happy")
  const [novaOpeningPanel, setNovaOpeningPanel] = useState(false)
  const [dragMoved, setDragMoved] = useState(false)
  const novaVelocityRef = useRef({ x: 0.35, y: -0.28 })
  const lastMouseRef = useRef(null)
  const novaPointerStartRef = useRef(null)
  const throwVelocityRef = useRef({ x: 0, y: 0 })
  const [novaTilt, setNovaTilt] = useState({ x: 0, y: 0 })
  const [thinkingFrame, setThinkingFrame] = useState(0)

  const selectedConfig = modes.find((mode) => mode.id === selectedMode) || modes[0]

  const novaMood = loading
  ? "thinking"
  : novaJustFinished
  ? "proud"
  : notes.length > 500
  ? "locked"
  : notes.length > 0
  ? "curious"
  : "idle"


  const novaMessage = {
    idle: "Drop in your notes and I’ll help you build a study path.",
    curious: "I’m reading your notes. I can already start spotting key ideas.",
    locked: "Nice. These notes have enough detail for deeper analysis.",
    thinking: "Working on it. I’m transforming your notes into study material.",
    proud: "Done. Want to simplify it, quiz yourself, or go deeper?",
  }[novaMood]

  useEffect(() => {
    if (!loading) {
      setThinkingFrame(0)
      return
    }

    const interval = setInterval(() => {
      setThinkingFrame((prev) => prev + 1)
    }, 140)

    return () => clearInterval(interval)
  }, [loading])

  //ORBIT
  useEffect(() => {
  let frame

  function animate() {
    setOrbitAngle((prev) => prev + 0.002)
    frame = requestAnimationFrame(animate)
  }

  frame = requestAnimationFrame(animate)
  return () => cancelAnimationFrame(frame)
}, [])

  function getOrbitPosition(index, radius = 330) {
    const angle = orbitAngle + (index * (Math.PI * 2)) / 5

    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    }
  }

  useEffect(() => {
    if (botOpen || isDraggingNova || novaTasking) return

    let frameId

    const novaWidth = 340
    const novaHeight = 150
    const padding = 18

    function getZones() {
      const centerZone = {
        left: window.innerWidth * 0.31,
        right: window.innerWidth * 0.69,
        top: 115,
        bottom: 710,
      }

      const buttonZones = Array.from(
        document.querySelectorAll("[data-nova-wall='true']")
      ).map((el) => {
        const r = el.getBoundingClientRect()
        return {
          left: r.left - 24,
          right: r.right + 24,
          top: r.top - 24,
          bottom: r.bottom + 24,
        }
      })

      return [centerZone, ...buttonZones]
    }

    function overlapsZone(x, y) {
      const novaBox = {
        left: x,
        right: x + novaWidth,
        top: y,
        bottom: y + novaHeight,
      }

      return getZones().some((zone) => (
        novaBox.left < zone.right &&
        novaBox.right > zone.left &&
        novaBox.top < zone.bottom &&
        novaBox.bottom > zone.top
      ))
    }

    function pushOutOfZone(x, y) {
      const zones = getZones()

      for (const zone of zones) {
        const inside =
          x < zone.right &&
          x + novaWidth > zone.left &&
          y < zone.bottom &&
          y + novaHeight > zone.top

        if (!inside) continue

        const pushLeft = Math.abs((zone.left - novaWidth - padding) - x)
        const pushRight = Math.abs((zone.right + padding) - x)
        const pushUp = Math.abs((zone.top - novaHeight - padding) - y)
        const pushDown = Math.abs((zone.bottom + padding) - y)

        const smallest = Math.min(pushLeft, pushRight, pushUp, pushDown)

        if (smallest === pushLeft) {
          return { x: zone.left - novaWidth - padding, y, vx: -0.45, vy: 0.22 }
        }

        if (smallest === pushRight) {
          return { x: zone.right + padding, y, vx: 0.45, vy: 0.22 }
        }

        if (smallest === pushUp) {
          return { x, y: zone.top - novaHeight - padding, vx: 0.28, vy: -0.45 }
        }

        return { x, y: zone.bottom + padding, vx: 0.28, vy: 0.45 }
      }

      return null
    }

    function tick() {
      setNovaPosition((pos) => {
        let { x: vx, y: vy } = novaVelocityRef.current

        let nextX = pos.x + vx
        let nextY = pos.y + vy

        if (nextX <= padding || nextX >= window.innerWidth - novaWidth - padding) {
          vx *= -1
          nextX = Math.max(padding, Math.min(nextX, window.innerWidth - novaWidth - padding))

          setNovaExpression("surprised")
          setTimeout(() => setNovaExpression("happy"), 900)

          setNovaPrompt("Ouch. Wall bonk. I’m good though.")
        }

        if (nextY <= padding || nextY >= window.innerHeight - novaHeight - padding) {
          vy *= -1
          nextY = Math.max(padding, Math.min(nextY, window.innerHeight - novaHeight - padding))
          setNovaExpression("surprised")
          setTimeout(() => setNovaExpression("happy"), 900)
          setNovaPrompt("Tiny bounce. Still studying with you.")
        }

        if (overlapsZone(nextX, nextY)) {
          const pushed = pushOutOfZone(pos.x, pos.y)

          if (pushed) {
            novaVelocityRef.current = { x: pushed.vx, y: pushed.vy }
            setOrbitBump(1)
            const bumpLines = [
              "Careful, that study planet has homework gravity.",
              "Boop. I bumped a study action. Still classy.",
              "That button looked important, so I dodged it.",
              "Oops, tiny robot collision. We’re good."
            ]

            setNovaExpression("surprised")
            setTimeout(() => setNovaExpression("happy"), 900)
            setNovaPrompt(bumpLines[Math.floor(Math.random() * bumpLines.length)])

            setTimeout(() => {
              setOrbitBump(0)
            }, 450)
            return { x: pushed.x, y: pushed.y }
          }

          vx *= -1
          vy *= -1
        }

        novaVelocityRef.current = { x: vx, y: vy }
        return { x: nextX, y: nextY }
      })

      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [botOpen, isDraggingNova, novaTasking])

  useEffect(() => {
    function handleMouseMove(e) {
      const x = (e.clientX / window.innerWidth - 0.5) * 32
      const y = (e.clientY / window.innerHeight - 0.5) * 24
      setNovaTilt({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    function handleMouseMove(e) {
      if (!isDraggingNova) return

      const movedEnough =
        novaPointerStartRef.current &&
        Math.hypot(
          e.clientX - novaPointerStartRef.current.x,
          e.clientY - novaPointerStartRef.current.y
        ) > 8

      if (!movedEnough) return

      if (!isDraggingNova) setIsDraggingNova(true)

      setDragMoved(true)
      const novaWidth = 340
      const novaHeight = 150
      const padding = 12

      const nextX = Math.min(
        window.innerWidth - novaWidth - padding,
        Math.max(padding, e.clientX - novaDragOffset.x)
      )

      const nextY = Math.min(
        window.innerHeight - novaHeight - padding,
        Math.max(padding, e.clientY - novaDragOffset.y)
      )

      setNovaPosition({ x: nextX, y: nextY })

      const now = performance.now()

      if (lastMouseRef.current) {
        const dt = Math.max(now - lastMouseRef.current.time, 16)

        const vx = ((e.clientX - lastMouseRef.current.x) / dt) * 16
        const vy = ((e.clientY - lastMouseRef.current.y) / dt) * 16

        throwVelocityRef.current = {
          x: throwVelocityRef.current.x * 0.7 + vx * 0.3,
          y: throwVelocityRef.current.y * 0.7 + vy * 0.3,
        }
      }

      lastMouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        time: now,
      }

    }

    function handleMouseUp() {
      if (!isDraggingNova) return

      const droppedOnWall = document
        .elementFromPoint(novaPosition.x + 170, novaPosition.y + 75)
        ?.closest("[data-nova-wall='true']")

      if (droppedOnWall) {
        setNovaPosition({
          x: Math.min(window.innerWidth - 380, Math.max(24, novaPosition.x + 220)),
          y: Math.min(window.innerHeight - 190, Math.max(24, novaPosition.y + 120)),
        })

        novaVelocityRef.current = { x: 0.8, y: 0.6 }
        setIsDraggingNova(false)
        setNovaPrompt("Oops, I’ll move off that button.")
        return
      }

      const throwPower = Math.hypot(throwVelocityRef.current.x, throwVelocityRef.current.y)

      if (throwPower > 2.2) {
        setNovaExpression("surprised")
        setNovaPrompt("Ouch! Okay okay, I’m flying.")
        setTimeout(() => setNovaExpression("happy"), 1200)
      }

      novaVelocityRef.current = {
        x: Math.max(-1.8, Math.min(1.8, throwVelocityRef.current.x)),
        y: Math.max(-1.8, Math.min(1.8, throwVelocityRef.current.y)),
      }
      setIsDraggingNova(false)
      setNovaPrompt("Wheee. I’ll keep moving, but I’ll dodge your workspace.")
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDraggingNova, novaDragOffset])

  //NOVA SPARK EFFECT
  useEffect(() => {
    if (!notes.trim()) return

    const words = notes
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 5)

    if (words.length === 0) return

    const timer = setTimeout(() => {
      const picked = words[Math.floor(Math.random() * words.length)]
      setNoteSpark(picked)

      setTimeout(() => setNoteSpark(""), 3500)
    }, 1600)

    return () => clearTimeout(timer)
  }, [notes])

  useEffect(() => {
    if (!notes.trim() || loading) return

    const timer = setTimeout(() => {
      if (notes.length < 150) {
        setNovaPrompt("Keep going. I need a little more context to help well.")
      } else if (notes.length < 600) {
        setNovaPrompt("Good start. I’m seeing enough to summarize or explain this.")
      } else {
        setNovaPrompt("These notes are detailed. Confusion Check might find weak spots.")
      }
    }, 900)

    return () => clearTimeout(timer)
  }, [notes, loading])

  useEffect(() => {
  const idleTimer = setTimeout(() => {
    if (!loading && !botOpen) {
      if (!notes.trim()) {
        setNovaPrompt("Still here. Paste some notes and I’ll help you study.")
      } else if (!output) {
        setNovaPrompt("Ready when you are. Click Generate and I’ll turn this into study material.")
      } else {
        setNovaPrompt("Don’t stop here. Quiz mode is a good next step.")
      }
    }
  }, 20000)

  return () => clearTimeout(idleTimer)
}, [notes, output, loading, botOpen])

  async function handleRunAction() {
    if (!notes.trim()) {
      setOutput("Please paste notes before running a study action.")
      return
    }

    if (selectedMode === "ask" && !question.trim()) {
      setOutput("Please enter a question for Ask mode.")
      return
    }

    setLoading(true)
    setOutput("")

    try {
      let response

      if (selectedMode === "ask") {
        response = await axios.post(`${API_BASE}${selectedConfig.endpoint}`, {
          notes,
          question,
        })
      } else if (selectedMode === "quiz") {
        response = await axios.post(`${API_BASE}${selectedConfig.endpoint}`, {
          notes,
          difficulty: quizDifficulty,
        })
      } else {
        response = await axios.post(`${API_BASE}${selectedConfig.endpoint}`, {
          notes,
        })
      }

      setOutput(response.data.result)

      const importantLines = response.data.result
      .split(/\n|\.|:/)
      .map((line) => line.trim())
      .filter((line) =>
        line.length > 25 &&
        !line.toLowerCase().includes("overview") &&
        !line.toLowerCase().includes("answer key") &&
        !line.toLowerCase().includes("practice quiz")
      )

    if (importantLines.length > 0) {
      const picked = importantLines[Math.floor(Math.random() * Math.min(importantLines.length, 8))]

      setNovaTasking(true)
      setNovaPrompt("Hold up, I’m flying over to the output. I found something worth remembering.")

      novaVelocityRef.current = { x: 0, y: 0 }
      setNovaOpeningPanel(true)
      setNovaPosition({
        x: window.innerWidth * 0.62,
        y: window.innerHeight * 0.55,
      })

      setTimeout(() => {
        setOutputSpark(picked)
        setNovaPrompt(`I highlighted this because it looks like a key idea, not just random filler.`)
      }, 900)

      setTimeout(() => {
        setNovaTasking(false)
        setNovaOpeningPanel(false)
        novaVelocityRef.current = { x: -0.35, y: 0.28 }
      }, 4500)
    }

      setNovaJustFinished(true)

      setTimeout(() => {
        setNovaJustFinished(false)
      }, 7000)

      setHistory((prev) => [
        {
          id: Date.now(),
          mode: selectedConfig.label,
          subject,
          preview: response.data.result.slice(0, 120),
          fullOutput: response.data.result,
        },
        ...prev.slice(0, 4),
      ])
    } catch (error) {
      console.error(error)
      setOutput(`Connection error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  function handleBotAction(action) {
    if (action === "studyNext") {
      setSelectedMode("ask")
      setQuestion("Based on my notes, what should I study next and why?")
      setBotOpen(false)
    }

    if (action === "confusing") {
      setSelectedMode("confusion")
      setQuestion("")
      setBotOpen(false)
    }

    if (action === "testMe") {
      setSelectedMode("quiz")
      setQuestion("")
      setBotOpen(false)
    }
  }

  function handleQuickAction(action) {
    if (action === "simpler") {
      setSelectedMode("explain")
      setQuestion("")
    }

    if (action === "examples") {
      setSelectedMode("ask")
      setQuestion("Can you explain this with examples based on my notes?")
    }

    if (action === "quiz") {
      setSelectedMode("quiz")
      setQuestion("")
    }
  }

  function NovaMascot({ size = "large" }) {

  return (
    <div
      className="relative flex flex-col items-center transition-transform duration-500 ease-out"
      style={{
        transform: `translate(${novaTilt.x}px, ${novaTilt.y}px)`,
      }}
    >
      <div className="absolute top-[88%] h-24 w-14 rounded-full bg-gradient-to-b from-[#ffb347]/80 to-transparent blur-xl nova-trail" />

      <div
        className={`nova-fly relative flex items-center justify-center rounded-[44px] bg-gradient-to-b from-[#ffb347] via-[#ff8a1c] to-[#ff6500] shadow-[0_0_60px_rgba(255,122,26,0.55)] ${
          size === "small" ? "h-24 w-32" : "h-40 w-52"
        }`}
      >
        {/* antenna */}
        <div className="absolute -top-10 left-1/2 flex -translate-x-1/2 flex-col items-center">
          <div className="h-9 w-3 rounded-full bg-[#ff8a1c]" />
          <div className="h-9 w-9 rounded-full bg-[#ffcf75] shadow-[0_0_24px_rgba(255,207,117,0.9)]" />
        </div>

        {/* ears */}
        <div className="absolute -left-6 top-1/2 h-16 w-8 -translate-y-1/2 rounded-full bg-[#ff8a1c] shadow-[0_0_18px_rgba(255,122,26,0.6)]" />
        <div className="absolute -right-6 top-1/2 h-16 w-8 -translate-y-1/2 rounded-full bg-[#ff8a1c] shadow-[0_0_18px_rgba(255,122,26,0.6)]" />

        {/* face screen */}
        <div className="relative h-[66%] w-[80%] overflow-hidden rounded-[34px] bg-[#100703] shadow-[inset_0_0_28px_rgba(255,207,117,0.24),0_0_20px_rgba(255,239,159,0.18)]">
          {loading ? (
              <div className="absolute inset-0 flex items-center justify-center gap-2">
                {[0, 1, 2, 3].map((bar) => {
                  const active = (thinkingFrame + bar) % 4
                  const height = [14, 24, 36, 24][active]
                  const opacity = [0.45, 0.7, 1, 0.7][active]

                  return (
                    <div
                      key={bar}
                      className="w-3 rounded-full bg-[#ffef9f] shadow-[0_0_14px_rgba(255,239,159,0.95)] transition-all duration-150 ease-out"
                      style={{
                        height: `${height}px`,
                        opacity,
                      }}
                    />
                  )
                })}
              </div>
            ) : novaExpression === "surprised" ? (
            <svg viewBox="0 0 160 90" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <circle cx="55" cy="42" r="8" fill="#ffef9f" filter="drop-shadow(0 0 8px rgba(255,239,159,0.9))" />
              <circle cx="105" cy="42" r="8" fill="#ffef9f" filter="drop-shadow(0 0 8px rgba(255,239,159,0.9))" />
              <path d="M72 66 Q80 56 88 66" fill="none" stroke="#ffef9f" strokeWidth="7" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 160 90" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <path d="M42 40 Q52 58 66 40" fill="none" stroke="#ffef9f" strokeWidth="9" strokeLinecap="round" filter="drop-shadow(0 0 8px rgba(255,239,159,0.9))" />
              <path d="M94 40 Q108 58 120 40" fill="none" stroke="#ffef9f" strokeWidth="9" strokeLinecap="round" filter="drop-shadow(0 0 8px rgba(255,239,159,0.9))" />
              <path d="M62 62 Q80 78 100 62" fill="none" stroke="#ffef9f" strokeWidth="8" strokeLinecap="round" filter="drop-shadow(0 0 8px rgba(255,239,159,0.9))" />
            </svg>
          )}
        </div>
      </div>
    </div>
  )
}

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090604] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="drift absolute -left-28 -top-24 h-96 w-96 rounded-full bg-[#FF7A1A]/25 blur-3xl" />
        <div className="drift absolute right-[-90px] top-20 h-96 w-96 rounded-full bg-[#FFD166]/18 blur-3xl" />
        <div className="drift absolute bottom-[-100px] left-1/3 h-96 w-96 rounded-full bg-[#FF3D00]/16 blur-3xl" />
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="shooting-star left-[8%] top-[22%]" />
        <div className="shooting-star delay-1 left-[62%] top-[18%]" />
        <div className="shooting-star delay-2 left-[20%] top-[58%]" />
      </div>

      <main className="relative z-10 mx-auto max-w-[1500px] px-8 py-6">
        <header className="mb-10 text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-cyan-100 backdrop-blur-xl">
            <Bot size={16} />
            AI-powered study copilot
          </div>

          <h1 className="text-6xl font-black tracking-tight md:text-7xl">
            StudyBuddy
          </h1>

          <p className="mx-auto mt-2 max-w-3xl text-lg font-medium text-orange-100/80">
            Put your notes in the center. Let the study actions orbit around them.
          </p>
        </header>


        <div className="pointer-events-none fixed left-10 top-1/2 hidden h-[66vh] w-[420px] -translate-y-1/2 rounded-[38px] border border-orange-200/10 bg-[#140904]/80 p-10 text-base shadow-[0_0_45px_rgba(255,122,26,0.14)] backdrop-blur-xl xl:flex xl:flex-col">
          <div className="mb-8 text-center text-[44px] font-black uppercase tracking-[0.16em] text-orange-300/75">
            Study Flow
          </div>
          <div className="space-y-5 text-left text-xl font-semibold leading-relaxed text-orange-50/85">
            <div>① Paste notes</div>
            <div>② Choose a study action</div>
            <div>③ Generate structured output</div>
            <div>④ Follow up with smart actions</div>
          </div>
        </div>

        <div className="pointer-events-none fixed right-10 top-1/2 hidden h-[66vh] w-[420px] -translate-y-1/2 rounded-[38px] border border-orange-200/10 bg-[#140904]/80 p-10 text-base shadow-[0_0_45px_rgba(255,122,26,0.14)] backdrop-blur-xl xl:flex xl:flex-col">
          <div className="mb-8 mt-4 text-center text-[44px] font-black uppercase tracking-[0.16em] text-orange-300/75">
            AI Guardrails
          </div>
          <div className="space-y-5 text-left text-xl font-semibold leading-relaxed text-orange-50/85">
            <div>Based only on your notes</div>
            <div>Math-aware formatting</div>
            <div>Best used with course materials</div>
            <div>Designed for active studying</div>
          </div>
        </div>

        <section className="relative mx-auto mt-10 flex min-h-[860px] max-w-[1200px] items-center justify-center">
  {/* Decorative orbital rings */}
  <div
    className={`pointer-events-none absolute left-1/2 top-1/2 h-[850px] w-[850px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[#ff8a1c]/25 border-t-[#ffef9f] border-r-[#ff7a1a] shadow-[0_0_120px_rgba(255,122,26,0.28)] ${
      loading ? "orbit-loader" : ""
    }`}
  />
  <div className="pointer-events-none absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ffb347]/20" />
  <div className="pointer-events-none absolute left-1/2 top-1/2 h-[510px] w-[510px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ff7a1a]/16" />

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full border-t border-[#ff7a1a]/35 rotate-[-18deg]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[930px] w-[930px] -translate-x-1/2 -translate-y-1/2 rounded-full border-r border-[#ffb347]/25 rotate-[22deg]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[960px] w-[960px] -translate-x-1/2 -translate-y-1/2 rounded-full border-l border-[#ff5a00]/20 rotate-[48deg]" />

  {/* warm glow */}
  <div className="orbit-glow pointer-events-none absolute left-1/2 top-1/2 h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,122,26,0.12),rgba(255,122,26,0.04)_42%,transparent_70%)]" />

  {/* orbit dots */}
  <div className="pulse-dot absolute left-[20%] top-[43%] h-4 w-4 rounded-full bg-[#ff9f1c] shadow-[0_0_30px_rgba(255,159,28,0.9)]" />
  <div className="pulse-dot absolute right-[20%] top-[43%] h-4 w-4 rounded-full bg-[#ff9f1c] shadow-[0_0_30px_rgba(255,159,28,0.9)]" />
  <div className="pulse-dot absolute left-[28%] bottom-[24%] h-3 w-3 rounded-full bg-[#ff7a1a] shadow-[0_0_26px_rgba(255,122,26,0.9)]" />
  <div className="pulse-dot absolute right-[28%] bottom-[24%] h-3 w-3 rounded-full bg-[#ff7a1a] shadow-[0_0_26px_rgba(255,122,26,0.9)]" />

  {/* ORBITING STUDY ACTIONS */}
  {modes
    .filter((m) => m.id !== "summarize") // remove center mode
    .map((mode, i) => {
      const pos = getOrbitPosition(i, 330 + orbitBump * 22)

      return (
        <button
          key={mode.id}
          data-nova-wall="true"
          onClick={() => setSelectedMode(mode.id)}
          style={{
            transform: `translate(${pos.x}px, ${pos.y}px)`,
          }}
          className={`absolute left-1/2 top-1/2 z-20 flex h-32 w-32 
          -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center 
          rounded-full border text-center transition-all duration-300 ease-out
          ${
            selectedMode === mode.id
              ? "border-[#ffb347]/80 bg-[#ff7a1a]/22 shadow-[0_0_60px_rgba(255,122,26,0.45)]"
              : "border-[#ff8a1c]/50 bg-[#170804]/80 shadow-[0_0_40px_rgba(255,122,26,0.18)]"
          }
          hover:scale-110 hover:shadow-[0_0_80px_rgba(255,179,71,0.55)]`}

          // 👇 BUBBLE INTERACTION
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const dx = e.clientX - (rect.left + rect.width / 2)
            const dy = e.clientY - (rect.top + rect.height / 2)

            e.currentTarget.style.transform = `
              translate(${pos.x + dx * 0.08}px, ${pos.y + dy * 0.08}px)
              scale(1.08)
            `
          }}

          onMouseLeave={(e) => {
            e.currentTarget.style.transform = `translate(${pos.x}px, ${pos.y}px)`
          }}
        >
          <mode.icon className="mb-1 text-[#ffb347]" size={26} />
          <div className="text-lg font-black">{mode.label}</div>
        </button>
      )
    })}

  {/* Central note hub */}
  <div className="relative z-10 flex h-[540px] w-[540px] flex-col items-center justify-center rounded-full border border-[#ffb347]/45 bg-[#090604]/88 p-12 shadow-[inset_0_0_80px_rgba(255,122,26,0.14),0_0_80px_rgba(255,122,26,0.25)] backdrop-blur-2xl">
    <div className="pointer-events-none absolute inset-8 rounded-full border border-[#ffb347]/22" />

    <div className="relative z-10 mb-4 text-center">
      <div className="text-3xl font-black text-[#ff7a1a]">
        Drop your notes here ✎
      </div>
      <div className="mx-auto mt-2 max-w-sm text-base font-medium text-orange-100/75">
        Paste lecture notes, equations, ideas, or messy thoughts.
      </div>
    </div>

    <div className="relative z-10 mb-3 flex flex-wrap justify-center gap-2">
      <select
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="rounded-full border border-[#ffb347]/20 bg-[#180B04]/90 px-4 py-2 text-sm font-bold text-orange-100 outline-none"
      >
        {subjects.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <button
        onClick={() => setModel(subjectModelMap[subject])}
        className="rounded-full border border-[#ffb347]/30 bg-[#ff7a1a]/15 px-4 py-2 text-sm font-black text-orange-100 transition hover:scale-105"
      >
        Optimize Model
      </button>
    </div>

    <textarea
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
      placeholder="Start typing your notes..."
      style={{
        background:
          "radial-gradient(circle at center, rgba(255,122,26,0.13), rgba(18,8,4,0.18) 50%, transparent 72%)",
      }}
      className="relative z-10 h-[210px] w-[390px] resize-none rounded-[44px] border border-transparent bg-transparent p-6 text-center text-xl font-medium leading-relaxed text-white outline-none transition-all duration-300 placeholder:text-orange-100/55 focus:scale-[1.03] focus:border-[#ffb347]/40"
    />

    {noteSpark && (
      <div className="relative z-10 mt-2 rounded-full border border-[#ffb347]/30 bg-[#ff7a1a]/20 px-4 py-2 text-sm font-black text-orange-50 shadow-[0_0_30px_rgba(255,122,26,0.22)]">
        Nova highlighted: “{noteSpark}”
      </div>
    )}

    {notes.length > 0 && (
      <div className="relative z-10 mt-3 rounded-2xl border border-[#ffb347]/20 bg-[#ff7a1a]/10 px-4 py-2 text-center text-sm font-bold text-orange-100">
        {novaMessage}
      </div>
    )}



    {selectedMode === "ask" && (
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question..."
        className="relative z-10 mt-3 w-[340px] rounded-full border border-[#ffb347]/20 bg-[#120804]/80 px-5 py-3 text-center text-white outline-none placeholder:text-orange-100/45 focus:border-[#ffb347]/50"
      />
    )}

    {selectedMode === "quiz" && (
      <div className="relative z-10 mt-3 flex justify-center gap-2">
        {["easy", "medium", "hard"].map((level) => (
          <button
            key={level}
            onClick={() => setQuizDifficulty(level)}
            className={`rounded-full px-4 py-2 text-xs font-black capitalize transition hover:-translate-y-1 ${
              quizDifficulty === level
                ? "border border-[#ffb347]/60 bg-[#ff7a1a]/25 text-orange-50"
                : "border border-white/10 bg-white/5 text-orange-100/70 hover:bg-white/10"
            }`}
          >
            {level}
          </button>
        ))}
      </div>
    )}

    <div className="relative z-10 mt-4 flex flex-wrap items-center justify-center gap-2">
      <div className="rounded-full border border-orange-100/10 bg-white/5 px-3 py-1.5 text-xs text-orange-100">
        Characters: {notes.length}
      </div>
      <div className="rounded-full border border-[#ffb347]/20 bg-[#ff7a1a]/10 px-3 py-1.5 text-xs text-orange-100">
        {model}
      </div>
      <div className="rounded-full border border-pink-300/20 bg-pink-400/10 px-3 py-1.5 text-xs text-pink-100">
        Live Workspace
      </div>
    </div>

    <button
      onClick={handleRunAction}
      className="relative z-10 mt-6 rounded-full bg-gradient-to-r from-[#ff5a00] via-[#ffb347] to-[#ff7a1a] px-12 py-4 text-lg font-black text-[#170A02] shadow-[0_0_60px_rgba(255,122,26,0.38)] transition duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95"
    >
      Generate Study Output ⚡
    </button>

    <div className="relative z-10 mt-3 text-xs text-orange-100/50">
      Press Enter ↵
    </div>

  </div>
</section>

        <section className="mx-auto mt-[-20px] max-w-[1250px] rounded-[36px] border border-orange-200/10 bg-[#120804]/70 p-7 shadow-2xl backdrop-blur-2xl">
          <div className="mb-5 h-1.5 w-full rounded-full bg-gradient-to-r from-[#FF3D00] via-[#FFB703] to-[#FF7A1A]" />

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black">Generated Study Output</h2>
              <p className="mt-1 text-slate-300">
                Continue transforming your notes with smart follow-up actions.
              </p>
            </div>

            <div className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-bold text-cyan-100">
              {selectedConfig.label}
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            AI-generated content is based only on your notes and may simplify complex ideas.
            Always verify with course materials.
          </p>


          {outputSpark && (
            <div className="mt-4 rounded-2xl border border-[#ffb347]/30 bg-[#ff7a1a]/15 px-4 py-3 text-sm font-bold text-orange-100 shadow-[0_0_35px_rgba(255,122,26,0.18)]">
              Nova noticed: “{outputSpark}”
            </div>
          )}

          <div className="mt-5 rounded-[30px] border border-white/10 bg-[#050816]/65 p-6 text-slate-200">
            {output ? (
              <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-200 prose-strong:text-white prose-li:text-slate-200">
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    p: ({ node, ...props }) => <p className="mb-3 leading-relaxed" {...props} />,
                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                  }}
                >
                  {output}
                </ReactMarkdown>
              </div>
            ) : (
              <span className="text-slate-400">
                Your summary, explanation, quiz, answer, confusion check, or full study pack will appear here.
              </span>
            )}
          </div>

          {output && (
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => handleQuickAction("simpler")}
                className="rounded-full border border-[#7C5CFF]/30 bg-[#7C5CFF]/10 px-4 py-2 text-sm font-bold text-violet-100 transition hover:-translate-y-1 hover:bg-[#7C5CFF]/20"
              >
                Make it simpler
              </button>

              <button
                onClick={() => handleQuickAction("examples")}
                className="rounded-full border border-[#00F0FF]/30 bg-[#00F0FF]/10 px-4 py-2 text-sm font-bold text-cyan-100 transition hover:-translate-y-1 hover:bg-[#00F0FF]/20"
              >
                Add examples
              </button>

              <button
                onClick={() => handleQuickAction("quiz")}
                className="rounded-full border border-[#FF4D9D]/30 bg-[#FF4D9D]/10 px-4 py-2 text-sm font-bold text-pink-100 transition hover:-translate-y-1 hover:bg-[#FF4D9D]/20"
              >
                Turn into quiz
              </button>
            </div>
          )}
        </section>
      </main>

     <div
        className={`fixed z-30 ${
          novaOpeningPanel ? "transition-[left,top] duration-[900ms] ease-out" : "transition-none"
        }`}
        style={{
          left: `${novaPosition.x}px`,
          top: `${novaPosition.y}px`,
        }}
      >
        {botOpen && (
      <div className="mb-4 max-h-[78vh] w-[520px] overflow-y-auto rounded-[38px] border border-[#ffb347]/25 bg-[#120804]/95 p-6 shadow-[0_0_90px_rgba(255,122,26,0.28)] backdrop-blur-2xl">
        <div className="mb-4 flex items-center justify-between gap-5">
          <div className="flex items-center gap-[60px]">
            <div className="-ml-6 scale-90">
              <NovaMascot size="small" />
            </div>

            <div>
              <div className="text-3xl font-black text-orange-50">Nova</div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-orange-300/70">
                Study Brain
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setBotOpen(false)
              novaVelocityRef.current = { x: -0.45, y: 0.32 }
              setNovaPrompt("Back on patrol. I’ll keep an eye on your study space.")
            }}
            className="rounded-full border border-[#ffb347]/20 bg-white/5 px-4 py-2 text-sm font-black text-orange-100 transition hover:bg-[#ff7a1a]/20"
          >
            Close
          </button>
        </div>


        <div className="mb-5 rounded-3xl border border-[#ffb347]/20 bg-[#ff7a1a]/10 p-4">
          <div className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-orange-300/70">
            Nova says
          </div>
          <p className="text-base font-medium text-orange-50">
            {novaMessage}
          </p>
        </div>

        <div className="mb-5 rounded-3xl border border-[#ffb347]/20 bg-white/5 p-4">
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-300/70">
            Best next move
          </div>
          <p className="text-sm font-semibold text-orange-50/85">
            {output
              ? "Use Make it simpler or Turn into quiz to keep building from this output."
              : notes
              ? "Run Confusion Check first if these notes feel messy."
              : "Paste notes first, then choose a study action."}
          </p>
        </div>

        <div className="mb-5 grid grid-cols-5 gap-2">
          {[0, 1, 2, 3, 4].map((bar) => (
            <div
              key={bar}
              className={`h-2 rounded-full bg-gradient-to-r from-[#ff5a00] to-[#ffb347] ${
                loading ? "animate-pulse" : "opacity-50"
              }`}
              style={{ animationDelay: `${bar * 120}ms` }}
            />
          ))}
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-2xl border border-orange-200/10 bg-white/5 p-3">
            <div className="text-orange-300/70">Subject</div>
            <div className="font-bold text-orange-50">{subject}</div>
          </div>
          <div className="rounded-2xl border border-orange-200/10 bg-white/5 p-3">
            <div className="text-orange-300/70">Model</div>
            <div className="font-bold text-orange-50">{model}</div>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => handleBotAction("studyNext")}
            className="w-full rounded-2xl border border-[#ffb347]/20 bg-[#ff7a1a]/10 px-3 py-3 text-left text-sm text-orange-100 transition hover:-translate-y-1 hover:bg-[#ff7a1a]/20"
          >
            <span className="font-bold">What should I study next?</span>
            <div className="mt-1 text-xs text-orange-100/60">
              Finds likely high-priority review areas.
            </div>
          </button>

          <button
            onClick={() => handleBotAction("confusing")}
            className="w-full rounded-2xl border border-[#ffb347]/20 bg-[#ff7a1a]/10 px-3 py-3 text-left text-sm text-orange-100 transition hover:-translate-y-1 hover:bg-[#ff7a1a]/20"
          >
            <span className="font-bold">What’s confusing?</span>
            <div className="mt-1 text-xs text-orange-100/60">
              Looks for unclear, incomplete, or dense parts.
            </div>
          </button>

          <button
            onClick={() => handleBotAction("testMe")}
            className="w-full rounded-2xl border border-[#ffb347]/20 bg-[#ff7a1a]/10 px-3 py-3 text-left text-sm text-orange-100 transition hover:-translate-y-1 hover:bg-[#ff7a1a]/20"
          >
            <span className="font-bold">Test me</span>
            <div className="mt-1 text-xs text-orange-100/60">
              Switches into quiz mode for active recall.
            </div>
          </button>
        </div>

        <div className="mt-5">
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-300/70">
            Recent Outputs
          </div>

          {history.length === 0 ? (
            <div className="rounded-2xl border border-orange-200/10 bg-white/5 p-3 text-sm text-orange-100/60">
              No memory yet. Generate an output and I’ll track it here.
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setOutput(item.fullOutput)}
                  className="w-full rounded-2xl border border-orange-200/10 bg-white/5 p-3 text-left transition hover:bg-white/10"
                >
                  <div className="text-sm font-black text-orange-50">
                    {item.mode} · {item.subject}
                  </div>
                  <div className="mt-1 text-xs text-orange-100/60">
                    {item.preview}...
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )}

       {novaPrompt && !botOpen && (
        <div className="mb-3 max-w-[340px] rounded-[28px] border border-[#ffb347]/25 bg-[#120804]/95 p-4 text-sm font-bold text-orange-50 shadow-[0_0_55px_rgba(255,122,26,0.22)] backdrop-blur-xl">
          {novaPrompt}
        </div>
      )}
  {!botOpen && (
    <button
      title="Drag Nova around or click to open Study Brain"
      onMouseDown={(e) => {
        novaPointerStartRef.current = {
          x: e.clientX,
          y: e.clientY,
        }

        setDragMoved(false)
        setIsDraggingNova(true)

        setNovaDragOffset({
          x: e.clientX - novaPosition.x,
          y: e.clientY - novaPosition.y,
        })

        lastMouseRef.current = {
          x: e.clientX,
          y: e.clientY,
          time: performance.now(),
        }

        throwVelocityRef.current = { x: 0, y: 0 }
      }}
      onClick={() => {
        if (dragMoved) return

        const safePosition = {
          x: Math.max(24, window.innerWidth - 600),
          y: 80,
        }

        novaVelocityRef.current = { x: 0, y: 0 }
        setNovaPrompt("")
        setNovaOpeningPanel(true)
        setNovaPosition(safePosition)

        setTimeout(() => {
          setBotOpen(true)
          setNovaOpeningPanel(false)
        }, 900)
      }}
  className="group cursor-grab active:cursor-grabbing flex items-center gap-4 rounded-[32px] border border-[#ffb347]/30 bg-[#160904]/90 px-7 py-5 shadow-[0_0_55px_rgba(255,122,26,0.22)] backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:scale-105"
>
  <NovaMascot size="small" />

  <div className="text-left">
    <div className="text-xl font-black text-orange-50">Nova</div>
    <div className="text-sm font-bold text-orange-200">
      {novaMood === "thinking"
        ? "Thinking..."
        : novaMood === "proud"
        ? "Output ready"
        : novaMood === "locked"
        ? "Locked in"
        : novaMood === "curious"
        ? "Reading notes"
        : "Study Brain"}
    </div>
  </div>
</button> )}

      </div>
    </div>
  )
}

export default App