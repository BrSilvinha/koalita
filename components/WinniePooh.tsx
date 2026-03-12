// Ilustración SVG de Winnie Pooh — estilo caricatura simple
export default function WinniePooh({ size = 160 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pixel-art drop-shadow-md"
    >
      {/* Orejas */}
      <ellipse cx="32" cy="52" rx="18" ry="16" fill="#e8a020" stroke="#6b3a2a" strokeWidth="2.5" />
      <ellipse cx="32" cy="52" rx="10" ry="9" fill="#f5c060" />
      <ellipse cx="128" cy="52" rx="18" ry="16" fill="#e8a020" stroke="#6b3a2a" strokeWidth="2.5" />
      <ellipse cx="128" cy="52" rx="10" ry="9" fill="#f5c060" />

      {/* Cabeza */}
      <ellipse cx="80" cy="72" rx="50" ry="48" fill="#e8a020" stroke="#6b3a2a" strokeWidth="3" />

      {/* Cara más clara */}
      <ellipse cx="80" cy="80" rx="32" ry="28" fill="#f5c060" />

      {/* Ojos */}
      <ellipse cx="62" cy="68" rx="9" ry="10" fill="white" stroke="#6b3a2a" strokeWidth="2" />
      <ellipse cx="98" cy="68" rx="9" ry="10" fill="white" stroke="#6b3a2a" strokeWidth="2" />
      <circle cx="64" cy="70" r="5" fill="#2c1810" />
      <circle cx="100" cy="70" r="5" fill="#2c1810" />
      {/* Brillos ojos */}
      <circle cx="66" cy="68" r="2" fill="white" />
      <circle cx="102" cy="68" r="2" fill="white" />

      {/* Nariz */}
      <ellipse cx="80" cy="84" rx="10" ry="7" fill="#c47d00" stroke="#6b3a2a" strokeWidth="1.5" />
      <ellipse cx="80" cy="83" rx="5" ry="3" fill="#e8a020" opacity="0.5" />

      {/* Boca sonrisa */}
      <path d="M 66 94 Q 80 106 94 94" stroke="#6b3a2a" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Cuerpo */}
      <ellipse cx="80" cy="136" rx="38" ry="30" fill="#e8a020" stroke="#6b3a2a" strokeWidth="2.5" />

      {/* Camiseta roja */}
      <path d="M 50 126 Q 50 118 80 118 Q 110 118 110 126 L 110 152 Q 80 158 50 152 Z" fill="#d94040" stroke="#6b3a2a" strokeWidth="2" />

      {/* Brazos */}
      <ellipse cx="44" cy="130" rx="12" ry="8" fill="#e8a020" stroke="#6b3a2a" strokeWidth="2" transform="rotate(-20 44 130)" />
      <ellipse cx="116" cy="130" rx="12" ry="8" fill="#e8a020" stroke="#6b3a2a" strokeWidth="2" transform="rotate(20 116 130)" />

      {/* Tarro de miel */}
      <rect x="106" y="128" width="22" height="24" rx="4" fill="#f5c060" stroke="#6b3a2a" strokeWidth="2" />
      <rect x="106" y="128" width="22" height="8" rx="2" fill="#e8a020" stroke="#6b3a2a" strokeWidth="1.5" />
      <text x="117" y="148" textAnchor="middle" fontSize="8" fill="#6b3a2a" fontWeight="bold">miel</text>
    </svg>
  )
}
