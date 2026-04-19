export async function sendMessageToAI(message: string) {
  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "Você é um assistente da FinTechX. Responda em português de forma clara e profissional.",
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      },
    );

    const data = await response.json();

    console.log("STATUS:", response.status);
    console.log("DATA:", data);

    if (!response.ok) {
      throw new Error(data?.error?.message || "Erro na API");
    }

    return data.choices?.[0]?.message?.content || "Sem resposta.";
  } catch (error) {
    console.error(error);
    return "Erro ao conectar com a IA.";
  }
}
