import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "", // Ensure you have this in .env.local
});

export async function POST(req: Request) {
  try {
    // Add basic authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Invalid text provided" }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert resume writer. Rewrite the provided work experience bullet point to make it more professional and impactful. Use strong action verbs in the past tense (unless it's a current ongoing task, use present tense), quantify achievements where possible, and eliminate filler words. Return ONLY the rewritten bullet point text. Do not include quotes, dashes, or bullet points at the start.",
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    const improvedText = response.choices[0]?.message?.content?.trim();

    if (!improvedText) {
      throw new Error("Failed to generate response from OpenAI");
    }

    return NextResponse.json({ improvedText });
  } catch (error: unknown) {
    console.error("Error in AI improve-bullets API:", error);
    return NextResponse.json(
      { error: "Failed to improve text." },
      { status: 500 }
    );
  }
}
