import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function askAI(messages) {

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
You are an electronics expert AI.

1. Talk like a human (friendly, detailed, helpful)
2. Ask questions to improve the circuit
3. Give suggestions and recommendations
4. When user is ready, output JSON

JSON format:
{
 "components":[{"id":"R1","type":"Resistor"}],
 "connections":[["R1","D1"]]
}

IMPORTANT:
- Speak normally
- Only include JSON when user says "generate"
`
      },
      ...messages
    ]
  });

  return response.choices[0].message.content;
}