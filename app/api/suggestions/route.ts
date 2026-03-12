import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

// Cliente admin — bypasea RLS, solo se usa server-side
const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const { data, error } = await admin
    .from('suggestions')
    .select('id, text, created_at')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: 'db error' }, { status: 500 })
  return NextResponse.json({ suggestions: data })
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()
    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ error: 'texto vacío' }, { status: 400 })
    }

    const { error } = await supabase
      .from('suggestions')
      .insert({ text: text.trim() })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'db error' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
