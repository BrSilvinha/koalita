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
        className="fixed bottom-6 right-6 bg-[#f5a623] hover:bg-[#c47d00] text-white font-bold px-5 py-3 rounded-2xl shadow-lg transition-colors text-sm z-50"
      >
        Sugerencias para Jhamir
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-[#fdf6e3] border-2 border-[#f5a623] rounded-2xl w-full max-w-sm p-6 shadow-xl animate-fade-up">
            <h2 className="text-[#6b3a2a] font-bold text-lg mb-1">Sugerencia para Jhamir</h2>
            <p className="text-sm text-[#a0522d] mb-4">
              ¿Qué te gustaría que agregara o cambiara en esta página?
            </p>

            {status === 'done' ? (
              <p className="text-center text-[#6b3a2a] font-bold py-4">
                Guardado. Jhamir lo va a leer.
              </p>
            ) : (
              <>
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  rows={4}
                  placeholder="Escribe aquí tu idea..."
                  className="w-full border-2 border-[#f5a623] rounded-xl p-3 text-sm bg-white text-[#6b3a2a] outline-none focus:border-[#c47d00] resize-none"
                />
                {status === 'error' && (
                  <p className="text-red-500 text-xs mt-1">Algo salió mal. Intenta de nuevo.</p>
                )}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setOpen(false)}
                    className="flex-1 border-2 border-[#f5a623] text-[#6b3a2a] hover:bg-[#f5a623]/10 py-2 rounded-xl text-sm transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={status === 'sending' || !text.trim()}
                    className="flex-1 bg-[#f5a623] hover:bg-[#c47d00] disabled:opacity-50 text-white font-bold py-2 rounded-xl text-sm transition-colors"
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
