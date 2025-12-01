import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Send, Sparkles, LogOut, Brain } from "lucide-react";

type Personality = "professional" | "casual" | "humorous";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [personality, setPersonality] = useState<Personality>("professional");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast("Signed out successfully");
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            message: userMessage,
            conversationId,
            personality,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to send message");
      }

      // Get conversation ID from headers
      const newConversationId = response.headers.get("X-Conversation-Id");
      if (newConversationId && !conversationId) {
        setConversationId(newConversationId);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      if (reader) {
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
                  assistantMessage += content;
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = {
                      role: "assistant",
                      content: assistantMessage,
                    };
                    return newMessages;
                  });
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(error.message || "Failed to send message");
      setMessages((prev) => prev.slice(0, -1)); // Remove the empty assistant message
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const personalities: { value: Personality; label: string; description: string }[] = [
    { value: "professional", label: "Professional", description: "Formal and precise" },
    { value: "casual", label: "Casual", description: "Friendly and relaxed" },
    { value: "humorous", label: "Humorous", description: "Witty and fun" },
  ];

  return (
    <div className="min-h-screen flex flex-col px-4 py-4 md:py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 md:w-10 md:h-10 text-primary animate-pulse-glow" />
          <div>
            <h1 className="text-2xl md:text-3xl font-black gradient-text">Neural Chat</h1>
            <p className="text-xs md:text-sm text-muted-foreground">AI with personality</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleSignOut}
          className="border-border/50 w-full sm:w-auto"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      {/* Personality Selector */}
      <Card className="glass-card p-4 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="text-sm font-semibold mr-2">Personality:</span>
          {personalities.map((p) => (
            <Badge
              key={p.value}
              onClick={() => {
                setPersonality(p.value);
                toast.success(`Switched to ${p.label} mode`);
              }}
              className={`cursor-pointer transition-all ${
                personality === p.value
                  ? "bg-primary text-primary-foreground hover:bg-primary/80"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {p.label}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {personalities.find((p) => p.value === personality)?.description}
        </p>
      </Card>

      {/* Messages */}
      <Card className="glass-card flex-1 mb-4 md:mb-6 p-3 md:p-6 overflow-y-auto max-h-[50vh] md:max-h-[60vh]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Brain className="w-16 h-16 text-primary/50 mb-4" />
            <h3 className="text-xl font-bold gradient-text mb-2">
              Start a Conversation
            </h3>
            <p className="text-muted-foreground">
              Ask me anything! I'll respond based on the personality you've selected.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[80%] rounded-lg p-3 md:p-4 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground ml-2 md:ml-4"
                      : "bg-card border border-border/50 mr-2 md:mr-4"
                  }`}
                >
                  <div className="text-sm font-semibold mb-1">
                    {message.role === "user" ? "You" : "AI"}
                  </div>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}
            {loading && messages[messages.length - 1]?.role === "assistant" && (
              <div className="flex justify-start">
                <div className="bg-card border border-border/50 rounded-lg p-4 mr-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                    <div
                      className="w-2 h-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </Card>

      {/* Input */}
      <Card className="glass-card p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-80 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
