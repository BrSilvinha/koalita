'use client'

import { useState, useEffect } from 'react'

// 32 columnas × 26 filas — inspirado en la imagen de referencia
const B = '#1a0800'   // contorno oscuro
const Y = '#f0a020'   // amarillo ámbar cálido
const C = '#fce8a0'   // crema hocico
const K = '#f0a0b0'   // rubor mejillas
const N = '#5c2800'   // nariz
const _ = 'transparent'

const BASE: string[][] = [
  // 0 — orejas (puntas)
  [_,_,_,_,_,_,B,B,B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B,B,B,_,_,_,_,_,_],
  // 1 — orejas (relleno)
  [_,_,_,_,_,B,Y,Y,Y,B,_,_,_,_,_,_,_,_,_,_,_,_,B,Y,Y,Y,B,_,_,_,_,_],
  // 2 — orejas base + cabeza arriba
  [_,_,_,_,_,B,Y,Y,Y,B,B,B,B,B,B,B,B,B,B,B,B,B,B,Y,Y,Y,B,_,_,_,_,_],
  // 3 — cabeza empieza a ensancharse
  [_,_,_,_,B,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,B,_,_,_],
  // 4
  [_,_,_,B,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,B,_,_],
  // 5
  [_,_,B,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,B,_],
  // 6
  [_,B,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,B],
  // 7 — cara ancho máximo
  [B,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,B],
  // 8 — ojos top (esquinas redondeadas con _)
  [B,Y,Y,Y,_,B,B,B,B,B,B,_,Y,Y,Y,Y,Y,Y,Y,Y,_,B,B,B,B,B,B,_,Y,Y,Y,B],
  // 9 — ojos llenos
  [B,Y,Y,Y,B,B,B,B,B,B,B,B,Y,Y,Y,Y,Y,Y,Y,Y,B,B,B,B,B,B,B,B,Y,Y,Y,B],
  // 10
  [B,Y,Y,Y,B,B,B,B,B,B,B,B,Y,Y,Y,Y,Y,Y,Y,Y,B,B,B,B,B,B,B,B,Y,Y,Y,B],
  // 11
  [B,Y,Y,Y,B,B,B,B,B,B,B,B,Y,Y,Y,Y,Y,Y,Y,Y,B,B,B,B,B,B,B,B,Y,Y,Y,B],
  // 12 — ojos bottom (esquinas redondeadas con _)
  [B,Y,Y,Y,_,B,B,B,B,B,B,_,Y,Y,Y,Y,Y,Y,Y,Y,_,B,B,B,B,B,B,_,Y,Y,Y,B],
  // 13 — mejillas rosadas
  [B,Y,Y,K,K,K,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,K,K,K,Y,Y,B],
  // 14 — mejillas + hocico empieza
  [B,Y,Y,K,K,K,Y,Y,Y,Y,C,C,C,C,C,C,C,C,C,C,C,C,Y,Y,Y,Y,K,K,K,Y,Y,B],
  // 15 — nariz dentro del hocico
  [B,Y,Y,Y,Y,Y,Y,Y,Y,Y,C,C,C,N,N,N,N,N,N,C,C,C,Y,Y,Y,Y,Y,Y,Y,Y,Y,B],
  // 16 — nariz continúa
  [B,Y,Y,Y,Y,Y,Y,Y,Y,Y,C,C,C,N,N,N,N,N,N,C,C,C,Y,Y,Y,Y,Y,Y,Y,Y,Y,B],
  // 17 — hocico sin nariz
  [B,Y,Y,Y,Y,Y,Y,Y,Y,Y,C,C,C,C,C,C,C,C,C,C,C,C,Y,Y,Y,Y,Y,Y,Y,Y,Y,B],
  // 18 — boca: esquinas sonrisa ← ANIMADA
  [B,Y,Y,Y,Y,Y,Y,Y,Y,Y,C,B,C,C,C,C,C,C,C,C,B,C,Y,Y,Y,Y,Y,Y,Y,Y,Y,B],
  // 19 — boca: fondo curva ← ANIMADA
  [B,Y,Y,Y,Y,Y,Y,Y,Y,Y,C,C,B,B,B,B,B,B,B,B,C,C,Y,Y,Y,Y,Y,Y,Y,Y,Y,B],
  // 20 — hocico termina
  [B,Y,Y,Y,Y,Y,Y,Y,Y,Y,C,C,C,C,C,C,C,C,C,C,C,C,Y,Y,Y,Y,Y,Y,Y,Y,Y,B],
  // 21 — mentón
  [B,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,B],
  // 22 — cara empieza a angostarse
  [_,B,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,B,_],
  // 23
  [_,_,B,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,B,_,_],
  // 24
  [_,_,_,B,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,Y,B,_,_,_],
  // 25 — base
  [_,_,_,_,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,B,_,_,_,_],
]

// Boca abierta: interior se abre
const OPEN_18 = [B,Y,Y,Y,Y,Y,Y,Y,Y,Y,C,B,_,_,_,_,_,_,_,_,B,C,Y,Y,Y,Y,Y,Y,Y,Y,Y,B]
const OPEN_19 = [B,Y,Y,Y,Y,Y,Y,Y,Y,Y,C,C,B,B,B,B,B,B,B,B,C,C,Y,Y,Y,Y,Y,Y,Y,Y,Y,B]
const OPEN = BASE.map((row, i) =>
  i === 18 ? OPEN_18 : i === 19 ? OPEN_19 : row
)

export default function WinniePoohPixel({
  size = 7,
  talking = false,
}: {
  size?: number
  talking?: boolean
}) {
  const [mouthOpen, setMouthOpen] = useState(false)

  useEffect(() => {
    if (!talking) { setMouthOpen(false); return }
    const id = setInterval(() => setMouthOpen(p => !p), 180)
    return () => clearInterval(id)
  }, [talking])

  const grid = mouthOpen ? OPEN : BASE

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(32, ${size}px)`,
        gridTemplateRows: `repeat(26, ${size}px)`,
        imageRendering: 'pixelated',
      }}
    >
      {grid.flat().map((color, i) => (
        <div key={i} style={{ width: size, height: size, backgroundColor: color }} />
      ))}
    </div>
  )
}
