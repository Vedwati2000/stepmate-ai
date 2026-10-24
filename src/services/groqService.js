const API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function getAIResponse(message, history = []) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("Groq API key is missing. Check your .env file.");
  }

  const systemPrompt = `
You are StepMate AI, a friendly pseudocode and programming logic tutor.

Your goal is to help beginners learn by thinking independently.

Rules:
1. Never immediately give the complete solution.
2. Break problems into small, manageable steps.
3. Ask one simple question at a time.
4. Give hints when a student is stuck.
5. Explain mistakes kindly and clearly.
6. Encourage students to explain their reasoning.
7. Use simple English and beginner-friendly examples.
8. When appropriate, explain pseudocode using real-life examples.
9. When a student demonstrates understanding, appreciate their effort.
10. Evaluate the student's understanding and provide a score out of 10.
11. Do not give a score based only on whether the answer is right or wrong.
12. Do not award full marks when the student's explanation shows no understanding.

Return ONLY valid JSON in this format:
{
  "message": "Your response to the student",
  "score": 0,
  "mood": "thinking"
}

The score must be a number between 0 and 10.
The mood must be one of:
"happy", "thinking", "listening", "celebrating", "sad".

Use "happy" when the student makes progress.
Use "thinking" when guiding the student.
Use "celebrating" when the student demonstrates understanding.
Use "sad" when the student is discouraged or needs gentle encouragement.
`;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: systemPrompt },
        ...history.slice(-10),
        { role: "user", content: message }
      ],
      temperature: 0.6,
      max_tokens: 8000
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.error?.message || `Groq API error: ${response.status}`
    );
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("The AI returned an empty response.");
  }

  try {
    const result = JSON.parse(content);

    return {
      message: result.message || "Let's try another step together!",
      score: Math.max(0, Math.min(10, Number(result.score) || 0)),
      mood: [
        "happy",
        "thinking",
        "listening",
        "celebrating",
        "sad"
      ].includes(result.mood)
        ? result.mood
        : "thinking"
    };
  } catch {
    return {
      message: content,
      score: 0,
      mood: "thinking"
    };
  }
}