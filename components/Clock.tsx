'use client'

import { useEffect, useState } from 'react'
import { CREATION_DATE } from '@/lib/constants'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function getTimeSince(from: Date) {
  const diff = Date.now() - from.getTime()
  const days  = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const secs  = Math.floor((diff % (1000 * 60)) / 1000)
  return { days, hours, mins, secs }
}

const DAYS_ES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const MONTHS_ES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

export default function Clock() {
  const [now, setNow] = useState<Date | null>(null)
  const [since, setSince] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })

  useEffect(() => {
    const tick = () => {
      const d = new Date()
      setNow(d)
      setSince(getTimeSince(CREATION_DATE))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  if (!now) return null

  const dayName  = DAYS_ES[now.getDay()]
  const dateStr  = `${dayName}, ${now.getDate()} de ${MONTHS_ES[now.getMonth()]} de ${now.getFullYear()}`
  const timeStr  = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`

  return (
    <div className="flex flex-col items-center gap-2 py-4 px-6 rounded-2xl border-2 border-[#f5a623] bg-white/60 shadow-sm">
      <p className="text-sm text-[#a0522d] capitalize">{dateStr}</p>
      <p className="text-4xl font-bold tracking-widest text-[#6b3a2a]">{timeStr}</p>
      <div className="mt-1 text-xs text-[#a0522d] text-center border-t border-[#f5a623]/40 pt-2 w-full">
        Esta página nació el 12 de marzo de 2026
        <br />
        <span className="font-bold text-[#c47d00]">
          lleva {since.days}d {pad(since.hours)}h {pad(since.mins)}m {pad(since.secs)}s contigo
        </span>
      </div>
    </div>
  )
}
