import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner";

export const VoiceControl = ({ onCommand }: { onCommand: (command: string) => void }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;

      recognitionInstance.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);

        if (event.results[current].isFinal) {
          const command = transcriptText.toLowerCase();
          
          // Process commands
          if (command.includes("neural") || command.includes("network")) {
            onCommand("neural");
            toast.success("Navigating to Neural Network");
          } else if (command.includes("canvas") || command.includes("draw")) {
            onCommand("canvas");
            toast.success("Opening Canvas");
          } else if (command.includes("data") || command.includes("dashboard")) {
            onCommand("dashboard");
            toast.success("Opening Dashboard");
          } else if (command.includes("achievement") || command.includes("gamification")) {
            onCommand("gamification");
            toast.success("Opening Achievements");
          } else if (command.includes("hello") || command.includes("hey")) {
            toast("👋 Hello! How can I help?");
          }
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === "not-allowed") {
          toast.error("Microphone access denied");
        }
      };

      recognitionInstance.onend = () => {
        if (isListening) {
          recognitionInstance.start();
        }
      };

      setRecognition(recognitionInstance);
    } else {
      toast.error("Speech recognition not supported in this browser");
    }
  }, [isListening, onCommand]);

  const toggleListening = () => {
    if (!recognition) {
      toast.error("Speech recognition not available");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      toast("Voice control disabled");
    } else {
      recognition.start();
      setIsListening(true);
      toast.success("Voice control enabled - Try: 'Show neural network'");
    }
  };

  return (
    <Card className="glass-card p-3 md:p-4">
      <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4">
        <Button
          onClick={toggleListening}
          className={`${
            isListening
              ? "bg-secondary hover:bg-secondary/80 pulse-glow"
              : "bg-primary hover:bg-primary/80"
          } transition-all w-full sm:w-auto whitespace-nowrap`}
          size="sm"
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Stop Listening</span>
              <span className="sm:hidden">Stop</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Start Voice Control</span>
              <span className="sm:hidden">Voice Control</span>
            </>
          )}
        </Button>
        <div className="flex-1 w-full">
          {isListening ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <p className="text-xs md:text-sm text-foreground truncate">
                {transcript || "Listening..."}
              </p>
            </div>
          ) : (
            <p className="text-xs md:text-sm text-muted-foreground text-center sm:text-left">
              <span className="hidden md:inline">Voice control ready. Commands: "neural", "canvas", "dashboard", "achievements"</span>
              <span className="md:hidden">Say: "neural", "canvas", "dashboard", or "achievements"</span>
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};
