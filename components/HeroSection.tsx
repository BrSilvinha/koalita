'use client'

import { useState, useEffect } from 'react'
import PixelAvatar from './PixelAvatar'
import WinniePooh from './WinniePooh'

type Stage = 'avatar' | 'transforming' | 'winnie'

const AVATAR_LINES = [
  'Hola...',
  'No soy una IA.',
  'Bueno... todavía no.',
  'Pero puedo convertirme en alguien que te conoce muy bien.',
  '¿Lista?',
]

export default function HeroSection({ onReady }: { onReady: () => void }) {
  const [stage, setStage]         = useState<Stage>('avatar')
  const [lineIndex, setLineIndex] = useState(0)
  const [displayed, setDisplayled] = useState('')
  const [typing, setTyping]       = useState(true)
  const [showBtn, setShowBtn]     = useState(false)

  // Typewriter effect
  useEffect(() => {
    if (stage !== 'avatar') return
    const line = AVATAR_LINES[lineIndex]
    if (!line) return

    setDisplayled('')
    setTyping(true)
    setShowBtn(false)

    let i = 0
    const id = setInterval(() => {
      setDisplayled(line.slice(0, i + 1))
      i++
      if (i >= line.length) {
        clearInterval(id)
        setTyping(false)
        // Si es la última línea, mostrar botón
        if (lineIndex === AVATAR_LINES.length - 1) {
          setShowBtn(true)
        } else {
          setTimeout(() => setLineIndex(prev => prev + 1), 1200)
        }
      }
    }, 60)

    return () => clearInterval(id)
  }, [lineIndex, stage])

  const handleTransform = () => {
    setStage('transforming')
    setTimeout(() => {
      setStage('winnie')
      onReady()
    }, 1400)
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Avatar o Winnie */}
      <div className="relative flex items-center justify-center h-48">
        {stage === 'winnie' ? (
          <div className="animate-float animate-fade-up">
            <WinniePooh size={160} />
          </div>
        ) : (
          <div className={stage === 'transforming' ? 'animate-transform' : 'animate-float'}>
            <PixelAvatar size={10} />
          </div>
        )}
        {stage === 'transforming' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl animate-spin">✨</div>
          </div>
        )}
      </div>

      {/* Burbuja de diálogo */}
      {stage === 'avatar' && (
        <div className="relative max-w-xs w-full bg-white border-2 border-[#f5a623] rounded-2xl px-5 py-4 shadow-md">
          {/* triángulo apuntando arriba */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0
            border-l-8 border-r-8 border-b-8
            border-l-transparent border-r-transparent border-b-[#f5a623]" />
          <p className="text-[#6b3a2a] text-sm min-h-[1.5rem]">
            {displayed}
            {typing && <span className="animate-blink">|</span>}
          </p>
          {showBtn && (
            <button
              onClick={handleTransform}
              className="mt-3 w-full bg-[#f5a623] hover:bg-[#c47d00] text-white font-bold py-2 px-4 rounded-xl transition-colors animate-fade-up"
            >
              Convertirse
            </button>
          )}
        </div>
      )}

      {stage === 'winnie' && (
        <div className="relative max-w-xs w-full bg-white border-2 border-[#f5a623] rounded-2xl px-5 py-4 shadow-md animate-fade-up">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0
            border-l-8 border-r-8 border-b-8
            border-l-transparent border-r-transparent border-b-[#f5a623]" />
          <p className="text-[#6b3a2a] text-sm font-bold">
            Hola, Claudia. Hoy será tu mejor día, koalita.
          </p>
        </div>
      )}
    </div>
  )
}
