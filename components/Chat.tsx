'use client'

import { useState, useEffect, useRef } from 'react'

type Message = {
  from: 'winnie' | 'claudia'
  text: string
}

type Step = {
  winnie: string
  options?: string[]
  freeInput?: boolean
  next?: (reply: string) => number // retorna índice del siguiente paso
}

const STEPS: Step[] = [
  // 0
  {
    winnie: 'No sé a qué hueles exactamente... pero el que me programó no paraba de hablar de tu olor. Creo que eso dice más que cualquier cosa.',
    options: ['jaja qué tonto', 'ay que lindo', 'eso es raro pero bonito'],
    next: () => 1,
  },
  // 1
  {
    winnie: 'Ese lunar que tienes en la nariz... mi creador lo describió tres veces. Tres. Yo solo tengo miel y aun así entiendo por qué.',
    options: ['para ya jajaja', 'qué observador', 'no me hagas ruborizar'],
    next: () => 2,
  },
  // 2
  {
    winnie: 'Oye, ¿sabías que eres un koala? No un oso, no. Un koala. Por dormilona. ¿Cuántas horas duermes tú al día?',
    options: ['muchas', 'las suficientes', 'nunca suficientes'],
    next: () => 3,
  },
  // 3
  {
    winnie: 'Clásico koalita. Oye, ¿te puedo contar un chiste?',
    options: ['sí, vamos', 'claro', 'si claro', 'dale'],
    next: () => 4,
  },
  // 4
  {
    winnie: '...Pan con pan...',
    options: ['da pan', '...da pan', 'jaja da pan'],
    next: () => 5,
  },
  // 5
  {
    winnie: '¡Exacto! Solo tú y mi creador entienden ese chiste. Eso los hace únicos.',
    options: ['somos únicos sí', 'jajaja sí', 'que raro chiste tan lindo'],
    next: () => 6,
  },
  // 6
  {
    winnie: 'Cuéntame algo sobre ti para seguir llenándome de información. Así mi creador puede programarme más cosas para ti.',
    freeInput: true,
    next: () => 7,
  },
  // 7
  {
    winnie: 'Lo guardé aquí, en mi corazón de oso. Mi creador va a saber. ¿Algo más que quieras contarme?',
    freeInput: true,
    next: () => 8,
  },
  // 8
  {
    winnie: 'Gracias, koalita. Hoy es tu mejor día. Y si no lo sientes así todavía, espera un poquito más. Yo me quedo aquí.',
    options: ['gracias Winnie', 'qué lindo eres'],
    next: () => -1, // fin
  },
]

function useTypewriter(text: string, speed = 40) {
  const [shown, setShown] = useState('')
  const [done, setDone]   = useState(false)

  useEffect(() => {
    setShown('')
    setDone(false)
    let i = 0
    const id = setInterval(() => {
      setShown(text.slice(0, i + 1))
      i++
      if (i >= text.length) { clearInterval(id); setDone(true) }
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])

  return { shown, done }
}

function WinnieBubble({ text, onDone }: { text: string; onDone: () => void }) {
  const { shown, done } = useTypewriter(text)

  useEffect(() => { if (done) onDone() }, [done, onDone])

  return (
    <div className="flex gap-2 items-end animate-fade-up">
      <div className="text-2xl">🐻</div>
      <div className="max-w-[75%] bg-[#f5a623]/20 border border-[#f5a623] rounded-2xl rounded-bl-none px-4 py-2 text-sm text-[#6b3a2a]">
        {shown}
        {!done && <span className="animate-blink">|</span>}
      </div>
    </div>
  )
}

function ClaudiaBubble({ text }: { text: string }) {
  return (
    <div className="flex gap-2 items-end justify-end animate-fade-up">
      <div className="max-w-[75%] bg-[#6b3a2a] text-white rounded-2xl rounded-br-none px-4 py-2 text-sm">
        {text}
      </div>
      <div className="text-2xl">🐨</div>
    </div>
  )
}

export default function Chat() {
  const [messages, setMessages]   = useState<Message[]>([])
  const [stepIdx, setStepIdx]     = useState(0)
  const [winnieDone, setWinnieDone] = useState(false)
  const [freeText, setFreeText]   = useState('')
  const [finished, setFinished]   = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Agregar primer mensaje de Winnie al montar
  useEffect(() => {
    setMessages([{ from: 'winnie', text: STEPS[0].winnie }])
    setWinnieDone(false)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleReply = (reply: string) => {
    const current = STEPS[stepIdx]
    const next = current.next ? current.next(reply) : -1

    setMessages(prev => [...prev, { from: 'claudia', text: reply }])
    setWinnieDone(false)

    if (next < 0 || next >= STEPS.length) {
      setFinished(true)
      return
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'winnie', text: STEPS[next].winnie }])
      setStepIdx(next)
    }, 600)
  }

  const handleFree = () => {
    if (!freeText.trim()) return
    handleReply(freeText.trim())
    setFreeText('')
  }

  const currentStep = STEPS[stepIdx]

  return (
    <div className="w-full max-w-md flex flex-col gap-3">
      {/* Historial */}
      <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-1">
        {messages.map((m, i) => {
          const isLastWinnie = m.from === 'winnie' && i === messages.length - 1
          return m.from === 'winnie' ? (
            <WinnieBubble
              key={i}
              text={m.text}
              onDone={() => { if (isLastWinnie) setWinnieDone(true) }}
            />
          ) : (
            <ClaudiaBubble key={i} text={m.text} />
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Opciones de respuesta */}
      {winnieDone && !finished && (
        <div className="animate-fade-up">
          {currentStep.freeInput ? (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={freeText}
                onChange={e => setFreeText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleFree()}
                placeholder="Escribe algo..."
                className="flex-1 border-2 border-[#f5a623] rounded-xl px-3 py-2 text-sm bg-white text-[#6b3a2a] outline-none focus:border-[#c47d00]"
              />
              <button
                onClick={handleFree}
                className="bg-[#f5a623] hover:bg-[#c47d00] text-white font-bold px-4 py-2 rounded-xl transition-colors text-sm"
              >
                Enviar
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 mt-2">
              {currentStep.options?.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleReply(opt)}
                  className="bg-white border-2 border-[#f5a623] hover:bg-[#f5a623] hover:text-white text-[#6b3a2a] text-sm px-4 py-2 rounded-xl transition-colors"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {finished && (
        <div className="text-center text-sm text-[#a0522d] mt-4 animate-fade-up py-4 border-t border-[#f5a623]/40">
          Winnie Pooh se fue a buscar miel, pero siempre vuelve.
        </div>
      )}
    </div>
  )
}
