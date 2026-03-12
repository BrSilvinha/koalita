'use client'

// Avatar pixelado — chico con lentes, hecho con CSS grid pixel art
// Cada celda es un pixel de 8px

const B = '#2c1810' // marrón oscuro (contorno/pelo)
const S = '#f4c89a' // skin
const G = '#1a1a2e' // gris oscuro (lentes frame)
const L = '#a8d8ea' // azul claro (cristal lentes)
const W = '#ffffff' // blanco
const _ = 'transparent'

// 16x16 grid
const PIXELS: string[][] = [
  [_,_,_,_,B,B,B,B,B,B,B,_,_,_,_,_],
  [_,_,_,B,B,B,B,B,B,B,B,B,_,_,_,_],
  [_,_,B,B,B,B,B,B,B,B,B,B,B,_,_,_],
  [_,_,B,B,S,S,S,S,S,S,B,B,B,_,_,_],
  [_,B,B,S,S,S,S,S,S,S,S,B,B,B,_,_],
  [_,B,S,S,G,G,S,G,G,S,S,S,B,B,_,_],
  [_,B,S,G,L,L,G,L,L,G,S,S,B,_,_,_],
  [_,B,S,G,L,L,G,L,L,G,S,S,B,_,_,_],
  [_,B,S,S,G,G,S,G,G,S,S,S,B,_,_,_],
  [_,B,S,S,S,S,S,S,S,S,S,S,B,_,_,_],
  [_,B,S,S,S,B,B,B,S,S,S,S,B,_,_,_],
  [_,_,B,S,S,S,S,S,S,S,S,B,_,_,_,_],
  [_,_,B,B,S,S,S,S,S,S,B,B,_,_,_,_],
  [_,_,_,B,B,B,B,B,B,B,B,_,_,_,_,_],
  [_,_,_,_,B,B,_,_,B,B,_,_,_,_,_,_],
  [_,_,_,_,B,B,_,_,B,B,_,_,_,_,_,_],
]

export default function PixelAvatar({ size = 8 }: { size?: number }) {
  return (
    <div
      className="pixel-art inline-block"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(16, ${size}px)`,
        gridTemplateRows: `repeat(16, ${size}px)`,
        imageRendering: 'pixelated',
      }}
    >
      {PIXELS.flat().map((color, i) => (
        <div
          key={i}
          style={{
            width: size,
            height: size,
            backgroundColor: color,
          }}
        />
      ))}
    </div>
  )
}
