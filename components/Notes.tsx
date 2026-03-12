'use client'

import { useState, useEffect } from 'react'

type Note = {
  id: string
  content: string
  reminderAt?: string
  createdAt: string
}

export default function Notes() {
  const [notes, setNotes]     = useState<Note[]>([])
  const [text, setText]       = useState('')
  const [reminder, setReminder] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('koalita_notes')
      if (saved) setNotes(JSON.parse(saved))
    } catch { /* ignore */ }
  }, [])

  const persist = (list: Note[]) => {
    setNotes(list)
    localStorage.setItem('koalita_notes', JSON.stringify(list))
  }

  const add = () => {
    if (!text.trim()) return
    const note: Note = {
      id: Date.now().toString(),
      content: text.trim(),
      reminderAt: reminder || undefined,
      createdAt: new Date().toISOString(),
    }
    persist([note, ...notes])
    setText('')
    setReminder('')
  }

  return (
    <div className="h-full flex flex-col gap-3">
      {/* Cabecera */}
      <div className="flex-shrink-0 text-center">
        <p className="text-xs text-[#880e4f] italic">
          Winnie Pooh guarda tus apuntes 🍯
        </p>
      </div>

      {/* Input */}
      <div className="flex flex-col gap-2 flex-shrink-0">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) add() }}
          placeholder="Escribe tu apunte aquí... 🐨"
          rows={3}
          className="w-full border-2 border-[#e91e63] rounded-xl px-3 py-2 text-sm
            bg-white text-[#4a1942] outline-none resize-none
            focus:border-[#ad1457] placeholder-[#e91e63]/40"
        />
        <div className="flex gap-2 items-center">
          <input
            type="datetime-local"
            value={reminder}
            onChange={e => setReminder(e.target.value)}
            className="flex-1 min-w-0 border-2 border-[#e91e63]/50 rounded-xl px-2 py-1.5
              text-xs bg-white text-[#4a1942] outline-none focus:border-[#e91e63]"
          />
          <button
            onClick={add}
            disabled={!text.trim()}
            className="flex-shrink-0 bg-[#e91e63] hover:bg-[#ad1457] disabled:opacity-40
              text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>

      {/* Lista */}
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 pr-1">
        {notes.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-2xl mb-2">🍯</p>
            <p className="text-xs text-[#880e4f]">Aún no hay apuntes.</p>
            <p className="text-xs text-[#880e4f]">¡Escribe algo para Winnie!</p>
          </div>
        ) : (
          notes.map(note => (
            <div
              key={note.id}
              className="bg-white rounded-xl px-4 py-3 border-2 border-[#e91e63]/30
                text-sm relative shadow-sm"
            >
              <p className="text-[#4a1942] pr-5 whitespace-pre-wrap">{note.content}</p>
              {note.reminderAt && (
                <p className="text-xs text-[#880e4f] mt-1">
                  ⏰ {new Date(note.reminderAt).toLocaleString('es-ES', {
                    day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              )}
              <p className="text-xs text-[#e91e63]/60 mt-0.5">
                {new Date(note.createdAt).toLocaleDateString('es-ES', {
                  day: '2-digit', month: 'long', year: 'numeric'
                })}
              </p>
              <button
                onClick={() => persist(notes.filter(n => n.id !== note.id))}
                className="absolute top-2 right-2 text-[#e91e63]/40 hover:text-[#e91e63] text-xs transition-colors"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
