'use client'

import { useState } from 'react'

export default function SuggestionModal() {
  const [open, setOpen]       = useState(false)
  const [text, setText]       = useState('')
  const [status, setStatus]   = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  const handleSubmit = async () => {
    if (!text.trim()) return
    setStatus('sending')
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() }),
      })
      if (!res.ok) throw new Error('error')
      setStatus('done')
      setText('')
      setTimeout(() => { setStatus('idle'); setOpen(false) }, 2000)
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2
          bg-[#e91e63] hover:bg-[#ad1457] text-white font-bold px-5 py-3
          rounded-2xl shadow-xl transition-all text-sm
          animate-pulse hover:animate-none hover:scale-105
          border-2 border-white/30"
      >
        <span className="text-lg">💡</span>
        <span>Sugerencias para Jhamir</span>
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-[white] border-2 border-[#e91e63] rounded-2xl w-full max-w-sm p-6 shadow-xl animate-fade-up">
            <h2 className="text-[#4a1942] font-bold text-lg mb-1">Sugerencia para Jhamir</h2>
            <p className="text-sm text-[#880e4f] mb-4">
              ¿Qué te gustaría que agregara o cambiara en esta página?
            </p>

            {status === 'done' ? (
              <p className="text-center text-[#4a1942] font-bold py-4">
                Guardado. Jhamir lo va a leer.
              </p>
            ) : (
              <>
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  rows={4}
                  placeholder="Escribe aquí tu idea..."
                  className="w-full border-2 border-[#e91e63] rounded-xl p-3 text-sm bg-white text-[#4a1942] outline-none focus:border-[#ad1457] resize-none"
                />
                {status === 'error' && (
                  <p className="text-red-500 text-xs mt-1">Algo salió mal. Intenta de nuevo.</p>
                )}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setOpen(false)}
                    className="flex-1 border-2 border-[#e91e63] text-[#4a1942] hover:bg-[#e91e63]/10 py-2 rounded-xl text-sm transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={status === 'sending' || !text.trim()}
                    className="flex-1 bg-[#e91e63] hover:bg-[#ad1457] disabled:opacity-50 text-white font-bold py-2 rounded-xl text-sm transition-colors"
                  >
                    {status === 'sending' ? 'Guardando...' : 'Enviar'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
