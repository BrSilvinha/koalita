'use client'

import { useState } from 'react'
import Clock from '@/components/Clock'
import HeroSection from '@/components/HeroSection'
import Chat from '@/components/Chat'
import SuggestionModal from '@/components/SuggestionModal'

export default function Home() {
  const [chatVisible, setChatVisible] = useState(false)

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-10 gap-10"
      style={{ background: 'linear-gradient(160deg, #fdf6e3 0%, #fff8f0 100%)' }}
    >
      {/* Reloj y contador */}
      <Clock />

      {/* Título */}
      <div className="text-center animate-fade-up">
        <h1 className="text-3xl font-bold text-[#6b3a2a] tracking-tight">
          Para ti, koalita
        </h1>
        <p className="text-sm text-[#a0522d] mt-1">
          Hecha con cariño, para Claudia
        </p>
      </div>

      {/* Avatar → Winnie Pooh */}
      <HeroSection onReady={() => setTimeout(() => setChatVisible(true), 800)} />

      {/* Chat — aparece después de la transformación */}
      {chatVisible && (
        <section className="w-full max-w-md animate-fade-up">
          <div className="border-t-2 border-[#f5a623]/40 pt-6">
            <p className="text-xs text-[#a0522d] text-center mb-4 uppercase tracking-widest">
              Conversación con Winnie Pooh
            </p>
            <Chat />
          </div>
        </section>
      )}

      {/* Botón de sugerencias (flotante) */}
      <SuggestionModal />
    </main>
  )
}
