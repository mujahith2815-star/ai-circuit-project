import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function askAI(message, mode) {

  let systemPrompt = "";

  if (mode === "generate") {
    systemPrompt = `
You are an electronics expert.

Give short explanation.
Then output:

---DRAW_DATA---
[ simple circuit JSON ]
---END---
`;
  } else {
    systemPrompt = `
You are an electronics assistant.
Explain clearly.
Do not generate drawing data.
`;
  }

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ]
  });

  return response.choices[0].message.content;
}
