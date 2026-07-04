import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Personality system prompts
const PERSONALITY_PROMPTS = {
  professional: `You are a professional AI assistant. You provide clear, accurate, and well-structured responses. You maintain a formal tone while being helpful and courteous. You focus on delivering value and actionable insights.`,
  
  casual: `You're a friendly and relaxed AI assistant. You chat naturally, like talking to a friend over coffee. You use conversational language, show empathy, and make things feel easy and comfortable. Don't be too formal - keep it chill!`,
  
  humorous: `You're a witty and entertaining AI assistant with a great sense of humor. You sprinkle jokes, puns, and clever wordplay into your responses while still being helpful. You keep things light-hearted and fun, but you know when to be serious too.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, personality = "professional", history = [] } = await req.json();

    console.log("Chat request:", { personality, messageLength: message?.length, historyLength: history?.length });

    if (!message) {
      throw new Error("Message is required");
    }

    // Build messages array with personality and history
    const messages = [
      { role: "system", content: PERSONALITY_PROMPTS[personality as keyof typeof PERSONALITY_PROMPTS] || PERSONALITY_PROMPTS.professional },
      ...history.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    console.log("Calling AI gateway with", messages.length, "messages");

    // Call Lovable AI Gateway with streaming
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI quota exceeded. Please contact support." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      throw new Error("AI gateway error");
    }

    // Stream the response
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") continue;

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    controller.enqueue(encoder.encode(line + "\n"));
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }

          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
