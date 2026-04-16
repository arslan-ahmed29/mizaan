import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function analyzeVerseTheme(
  verseTextA: string,
  verseTextB: string
): Promise<string> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 64,
    messages: [
      {
        role: "user",
        content: `Given these two mirrored verses from the Quran, identify their shared theological theme in 4-6 words:

Verse A: "${verseTextA}"

Verse B: "${verseTextB}"

Reply with only the theme phrase, nothing else.`,
      },
    ],
  });

  const block = message.content[0];
  if (block.type === "text") return block.text.trim();
  return "Theme unavailable";
}
