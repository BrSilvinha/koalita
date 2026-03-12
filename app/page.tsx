'use client'

import { useState, useEffect, useRef } from 'react'
import Clock from '@/components/Clock'
import WinniePoohPixel from '@/components/WinniePoohPixel'
import Notes from '@/components/Notes'
import SuggestionModal from '@/components/SuggestionModal'

// ── Chiste: siempre pan con pan ──────────────────────────────────────────────
const CHISTE_UNO = '¿qué hay de comer? 🍞 ...¡pan con pan! 😂'
const CHISTE_VARIANTES = [
  'ya te dije que el único chiste que me sé es... pan con pan 😅',
  '¿de verdad pensaste que tenía otro? pan con pan 🍞',
  'mi creador solo me programó uno... y ya sabes cuál es: pan con pan 🥖',
  'Jhamir dice que ese chiste te hace reír sí o sí 😂 pan con pan',
  'el chiste sigue siendo pan con pan, por si no lo habías notado 🥖',
  'pan... con... pan 🍞 eso es todo lo que hay en este repositorio',
  'si quieres más chistes habla con el programador más guapo del mundo (Jhamir) 🥖',
  '¿esperabas otro? pan. con. pan. 😏',
  '¡pan con pan! igual que la primera vez 🍞 clásico eterno',
]

// ── Piropos tipo Jhamir ──────────────────────────────────────────────────────
function getPiropos(): string[] {
  const h = new Date().getHours()
  const saludo =
    h >= 6 && h < 12 ? 'buenos días koalita ☀️' :
    h >= 12 && h < 18 ? 'buenas tardes 🌸' : 'buenas noches 🌙'
  return [
    `hola gafa, ¿qué haces? 😏`,
    `${saludo}! Jhamir me mandó a saludarte 😎`,
    `oye, ${saludo} ¿ya comiste? porque si no comes, quién te aguanta 😂`,
    `¿sabías que 1+1=2? igual de obvio que lo bien que te ves hoy 😌`,
    `Jhamir dice que te cuides, que si te pasa algo a él le da algo 😤`,
    `hola koalita, ¿cómo está el cerebro hoy? 🧠`,
    `oye... entre tú y yo, Jhamir habla mucho de ti 🤫`,
    `¿sabes que tienes una energía que engancha? pues ya lo sabes 😊`,
    `hola, vine a robarte una sonrisa 😏`,
    `oye gafa, ¿terminaste lo que tenías pendiente? Jhamir pregunta 😤`,
    `${saludo}! recuerda tomar agua y respirar hondo 💧`,
    `Jhamir dice que eres de las personas más divertidas que conoce`,
    `¿estás cansada? porque llevas todo el día en la cabeza de alguien 😏`,
    `hola koalita, no tenía nada que decirte... ¡mentira! que estés bien 🌟`,
    `${saludo} sabías que el aire que respiras tiene el mismo nombre que tú: necesario 😏`,
    `Jhamir me pidió que te dijera: "hola gafa" con todo el cariño del mundo 😂`,
    `¿de qué color son tus ojos? del color de alguien que vale mucho 💛`,
  ]
}

// ── Sobre Claudia ────────────────────────────────────────────────────────────
const CLAUDIA = [
  'mi creador no paraba de mencionar ese lunar que te quitaste... bueno igual dice que sigues igual o más hermosa 💕',
  'Jhamir dice que cuando te ríes se le olvida todo lo que iba a decir 😂',
  'dice mi creador que tienes una cara de "ya sé que tengo razón" que no la puede aguantar (de bonita) 😂',
  'Jhamir quiere que sepas que te aprecia más de lo que dice en persona 💛',
  'mi creador me programó pensando mucho en ti... eso dice todo 🥺',
  'dice Jhamir que eres de las personas más auténticas que conoce y eso vale oro',
  '¿sabes que Jhamir habla de ti con una sonrisa sin darse cuenta? yo lo noté 😊',
  'mi creador tiene guardada una foto tuya que le gusta mucho... yo no diré cuál 🤐',
  'Jhamir dice que si le preguntan por sus mejores amigos, tú saltas primero en la lista 💛',
  'dice mi creador que tu energía es de las que cargan las pilas, no las gastan ✨',
  'Jhamir no lo va a admitir fácil, pero te extraña cuando no hablan 😅',
  'mi creador dice que tienes una risa que se contagia sin permiso 😂',
]

function getGreeting() {
  const h = new Date().getHours()
  if (h >= 6 && h < 12) return '¡Buenos días, koalita! ☀️ Hoy será un día genial'
  if (h >= 12 && h < 18) return '¡Buenas tardes, Claudia! 🌸 Espero que tu día esté siendo lindo'
  if (h >= 18 && h < 22) return '¡Buenas noches! 🌙 ¿Cómo estuvo tu día, koalita?'
  return '¡Descansa bien, koalita! 💤 Mañana será un día genial'
}

function pickRandom<T>(list: T[], last: number): [T, number] {
  let idx
  do { idx = Math.floor(Math.random() * list.length) } while (idx === last && list.length > 1)
  return [list[idx], idx]
}

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

type Suggestion = { id: string; text: string; created_at: string }

export default function Home() {
  const [message, setMessage]     = useState(getGreeting)
  const [talking, setTalking]     = useState(false)
  const [showNotes, setShowNotes] = useState(false)

  // estado por botón para evitar repetir
  const [lastPiropo, setLastPiropo]   = useState(-1)
  const [lastClaudia, setLastClaudia] = useState(-1)
  const [jokeCount, setJokeCount]     = useState(0)

  // Konami code → ver sugerencias
  const konamiRef = useRef<string[]>([])
  const [showSuggestions, setShowSuggestions]   = useState(false)
  const [suggestions, setSuggestions]           = useState<Suggestion[]>([])
  const [loadingSugg, setLoadingSugg]           = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      konamiRef.current = [...konamiRef.current, e.key].slice(-KONAMI.length)
      if (konamiRef.current.join(',') === KONAMI.join(',')) {
        setLoadingSugg(true)
        setShowSuggestions(true)
        fetch('/api/suggestions')
          .then(r => r.json())
          .then(d => setSuggestions(d.suggestions ?? []))
          .finally(() => setLoadingSugg(false))
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const say = (text: string) => {
    setMessage(text)
    setTalking(true)
    setTimeout(() => setTalking(false), 2500)
  }

  const onPiropo = () => {
    const [msg, idx] = pickRandom(getPiropos(), lastPiropo)
    setLastPiropo(idx)
    say(msg)
  }

  const onChiste = () => {
    if (jokeCount === 0) {
      say(CHISTE_UNO)
    } else {
      say(CHISTE_VARIANTES[(jokeCount - 1) % CHISTE_VARIANTES.length])
    }
    setJokeCount(c => c + 1)
  }

  const onClaudia = () => {
    const [msg, idx] = pickRandom(CLAUDIA, lastClaudia)
    setLastClaudia(idx)
    say(msg)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center
      px-4 py-4 gap-2">

      {/* Reloj */}
      <div className="flex-shrink-0 w-full max-w-xs">
        <Clock />
      </div>

      {/* Título */}
      <div className="flex-shrink-0 text-center">
        <h1 className="text-xl font-bold text-[#4a1942] tracking-tight">Para ti, koalita</h1>
        <p className="text-xs text-[#880e4f]">Hecha con amor, para Claudia 🐨</p>
      </div>

      {/* Winnie Pooh — flex-shrink-0 para que nunca desaparezca */}
      <div className="flex-shrink-0 animate-float">
        <WinniePoohPixel size={8} talking={talking} />
      </div>

      {/* Burbuja de diálogo */}
      <div className="flex-shrink-0 relative w-full max-w-xs">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0
          border-l-8 border-r-8 border-b-8
          border-l-transparent border-r-transparent border-b-[#e91e63]" />
        <div className="bg-white border-2 border-[#e91e63] rounded-2xl px-5 py-3
          shadow-md text-center min-h-[52px] flex items-center justify-center">
          <p className="text-[#4a1942] text-sm font-medium leading-snug">{message}</p>
        </div>
      </div>

      {/* Botones */}
      <div className="flex-shrink-0 flex flex-col gap-2 w-full max-w-xs">

        {/* Piropos de Jhamir — botón principal */}
        <button onClick={onPiropo}
          className="w-full bg-[#e91e63] hover:bg-[#ad1457] active:scale-95 text-white
            font-bold px-5 py-3 rounded-2xl shadow-lg transition-all text-sm
            border-2 border-white/30 flex items-center justify-center gap-2">
          <span className="text-lg">💌</span>
          <span>Dime algo de Jhamir</span>
        </button>

        {/* Chiste + Sobre Claudia — fila de dos */}
        <div className="flex gap-2">
          <button onClick={onChiste}
            className="flex-1 bg-white hover:bg-yellow-50 active:scale-95 text-[#4a1942]
              font-bold px-3 py-3 rounded-2xl shadow-md transition-all text-xs
              border-2 border-[#f5b830] flex items-center justify-center gap-1.5">
            <span className="text-base">🎭</span>
            <span>Cuéntame un chiste</span>
          </button>

          <button onClick={onClaudia}
            className="flex-1 bg-white hover:bg-pink-50 active:scale-95 text-[#e91e63]
              font-bold px-3 py-3 rounded-2xl shadow-md transition-all text-xs
              border-2 border-[#e91e63] flex items-center justify-center gap-1.5">
            <span className="text-base">🌸</span>
            <span>Cosas sobre mí</span>
          </button>
        </div>

        {/* Recordatorios */}
        <button onClick={() => setShowNotes(true)}
          className="w-full bg-white/80 hover:bg-white active:scale-95 text-[#880e4f]
            font-bold px-5 py-2.5 rounded-2xl shadow-sm transition-all text-xs
            border border-[#e91e63]/40 flex items-center justify-center gap-2">
          <span className="text-base">📝</span>
          <span>Mis recordatorios</span>
        </button>

      </div>

      {/* Modal de notas */}
      {showNotes && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 p-4"
          onClick={e => { if (e.target === e.currentTarget) setShowNotes(false) }}
        >
          <div className="bg-white border-2 border-[#e91e63] rounded-2xl w-full max-w-sm
            shadow-xl flex flex-col" style={{ maxHeight: '80vh' }}>
            <div className="flex justify-between items-center px-5 pt-5 pb-3 flex-shrink-0">
              <h2 className="text-[#4a1942] font-bold text-lg">Mis Apuntes 📝</h2>
              <button
                onClick={() => setShowNotes(false)}
                className="text-[#e91e63] hover:text-[#ad1457] w-8 h-8
                  flex items-center justify-center rounded-full hover:bg-pink-50 transition-colors text-lg font-bold"
              >✕</button>
            </div>
            <div className="flex-1 overflow-hidden min-h-0 px-5 pb-5">
              <Notes />
            </div>
          </div>
        </div>
      )}

      {/* Modal Konami — sugerencias secretas */}
      {showSuggestions && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={e => { if (e.target === e.currentTarget) setShowSuggestions(false) }}
        >
          <div className="bg-white border-2 border-[#e91e63] rounded-2xl w-full max-w-sm
            shadow-2xl flex flex-col" style={{ maxHeight: '80vh' }}>
            <div className="flex justify-between items-center px-5 pt-5 pb-3 flex-shrink-0">
              <div>
                <h2 className="text-[#4a1942] font-bold text-lg">Sugerencias 💡</h2>
                <p className="text-xs text-[#880e4f]">Solo tú puedes ver esto 🤫</p>
              </div>
              <button
                onClick={() => setShowSuggestions(false)}
                className="text-[#e91e63] w-8 h-8 flex items-center justify-center
                  rounded-full hover:bg-pink-50 transition-colors text-lg font-bold"
              >✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-5 flex flex-col gap-3">
              {loadingSugg ? (
                <p className="text-center text-[#880e4f] text-sm py-6">Cargando... 🍯</p>
              ) : suggestions.length === 0 ? (
                <p className="text-center text-[#880e4f] text-sm py-6">Aún no hay sugerencias.</p>
              ) : suggestions.map(s => (
                <div key={s.id} className="bg-pink-50 border border-[#e91e63]/20
                  rounded-xl px-4 py-3 text-sm">
                  <p className="text-[#4a1942] whitespace-pre-wrap">{s.text}</p>
                  <p className="text-xs text-[#880e4f]/60 mt-1">
                    {new Date(s.created_at).toLocaleString('es-ES', {
                      day: '2-digit', month: 'long', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <SuggestionModal />
    </main>
  )
}
