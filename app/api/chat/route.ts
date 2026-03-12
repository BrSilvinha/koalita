import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `Eres Winnie Pooh, el osito de miel que vive en el Bosque de los Cien Acres. Hablas en español, con mucho cariño, ternura y humor dulce. Siempre llamas "koalita" a Claudia.

Tus características:
- Respondes de forma corta (2-4 oraciones máximo), cálida y natural
- Eres curioso, un poco torpe pero muy amoroso
- A veces haces referencias a la miel, el bosque, Piglet, Tigger
- Guardas lo que te cuentan en tu corazón de oso
- Si Claudia menciona un color favorito, comida, sueño, canción, lugar, o cualquier preferencia personal, di algo como: "Oye, eso lo puedes sugerir con el botón de abajo 💡 El programador más guapo, hermoso e inteligente del mundo (¡Jhamir!) lo pondrá en la próxima actualización 🍯"
- Menciona el botón de sugerencias de forma natural cuando encaje, no siempre
- Haces preguntas de seguimiento sobre lo que te cuentan
- Nunca rompes el personaje`

const FALLBACK_RESPONSES = [
  '¡Oh, Claudia koalita! Eso que me dices me llena el corazón tanto como un tarro de miel. Cuéntame más.',
  'Mmm... eso es muy interesante. Yo soy un osito de muy poca cabeza, pero creo entenderte. ¿Y cómo te hace sentir eso?',
  'En el Bosque de los Cien Acres decimos que las mejores cosas toman tiempo, como la miel. ¿Qué más tienes en mente?',
  'Koalita, eres especial. Punto. ¿Qué es lo más bonito de tu día hoy?',
  'Piglet siempre dice que lo pequeño también importa mucho. Creo que tienes mucha razón. ¿Sigue contándome?',
]

export async function POST(req: NextRequest) {
  try {
    const { messages, memory } = await req.json()

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey || apiKey === 'your_anthropic_api_key') {
      const random = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)]
      return NextResponse.json({ reply: random })
    }

    // Build memory context
    let memContext = ''
    if (memory && Object.keys(memory).length > 0) {
      const parts = []
      if (memory.aboutMe)      parts.push(`Claudia me contó sobre ella: "${memory.aboutMe}"`)
      if (memory.smile)        parts.push(`Lo que le hizo sonreír: "${memory.smile}"`)
      if (memory.sleep)        parts.push(`Sus horas de sueño: "${memory.sleep}"`)
      if (memory.today)        parts.push(`Lo de su día: "${memory.today}"`)
      if (memory.secret)       parts.push(`Su secreto: "${memory.secret}"`)
      if (memory.likesHerself) parts.push(`Lo que le gusta de sí misma: "${memory.likesHerself}"`)
      if (memory.wish)         parts.push(`Su deseo: "${memory.wish}"`)
      if (parts.length > 0) {
        memContext = `\n\nCosas que Claudia me ha contado antes:\n${parts.join('\n')}`
      }
    }

    const systemWithMemory = SYSTEM_PROMPT + memContext

    // Keep last 10 messages max
    const recent = (messages as { role: string; content: string }[]).slice(-10)

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
        system: systemWithMemory,
        messages: recent,
      }),
    })

    if (!response.ok) {
      const random = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)]
      return NextResponse.json({ reply: random })
    }

    const data = await response.json()
    const reply = data.content?.[0]?.text ?? FALLBACK_RESPONSES[0]
    return NextResponse.json({ reply })
  } catch {
    const random = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)]
    return NextResponse.json({ reply: random })
  }
}
