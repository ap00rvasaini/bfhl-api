import { type NextRequest, NextResponse } from "next/server"

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() })
}

type BFHLRequest = { data: unknown }

function isIntegerString(s: string): boolean {
  return /^-?\d+$/.test(s)
}

function isAlphaString(s: string): boolean {
  return /^[A-Za-z]+$/.test(s)
}

function toUserId(fullNameLower: string, dobDDMMYYYY: string): string {
  const name = fullNameLower.trim().toLowerCase().replace(/\s+/g, "_").replace(/_+/g, "_")
  const dob = (dobDDMMYYYY || "").replace(/\D/g, "")
  return `${name}_${dob}`
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as BFHLRequest
    const input = body?.data

    if (!Array.isArray(input)) {
      return NextResponse.json(
        { is_success: false, error: "Invalid payload: 'data' must be an array." },
        { status: 400, headers: corsHeaders() },
      )
    }

    // Identity (configure via Environment Variables in Project Settings)
    const fullName = process.env.FULL_NAME || "john doe"
    const dob = process.env.DOB_DDMMYYYY || "17091999"
    const email = process.env.EMAIL_ID || "john@xyz.com"
    const rollNumber = process.env.ROLL_NUMBER || "ABCD123"
    const user_id = toUserId(fullName, dob)

    const even_numbers: string[] = []
    const odd_numbers: string[] = []
    const alphabets: string[] = []
    const special_characters: string[] = []

    let sum = 0n
    let alphaCharsConcat = ""

    for (const item of input) {
      const s = String(item)

      if (isIntegerString(s)) {
        const n = BigInt(s)
        const isEven = ((n % 2n) + 2n) % 2n === 0n
        if (isEven) even_numbers.push(s)
        else odd_numbers.push(s)
        sum += n
        continue
      }

      if (isAlphaString(s)) {
        alphabets.push(s.toUpperCase())
        alphaCharsConcat += s
        continue
      }

      // Non-pure alpha/number tokens are considered special characters
      special_characters.push(s)
    }

    // Reverse all alphabetical characters and apply alternating caps starting Upper
    const reversedChars = [...alphaCharsConcat].reverse()
    const concat_string = reversedChars.map((ch, i) => (i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase())).join("")

    const response = {
      is_success: true,
      user_id,
      email,
      roll_number: rollNumber,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: sum.toString(),
      concat_string,
    }

    return NextResponse.json(response, { status: 200, headers: corsHeaders() })
  } catch (error: any) {
    return NextResponse.json(
      {
        is_success: false,
        error: "Malformed JSON or internal error.",
        details: error?.message || "Unknown error",
      },
      { status: 400, headers: corsHeaders() },
    )
  }
}
