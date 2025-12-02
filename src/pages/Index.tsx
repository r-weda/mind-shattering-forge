import { useState, useRef, useEffect } from "react";
import { ParticleBackground } from "@/components/ParticleBackground";
import { NeuralNetworkViz } from "@/components/NeuralNetworkViz";
import { CollaborationCanvas } from "@/components/CollaborationCanvas";
import { DataDashboard } from "@/components/DataDashboard";
import { GamificationSystem } from "@/components/GamificationSystem";
import { VoiceControl } from "@/components/VoiceControl";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles, ChevronDown, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("hero");
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({});

  const handleVoiceCommand = (command: string) => {
    const sectionMap: { [key: string]: string } = {
      neural: "neural",
      canvas: "canvas",
      dashboard: "dashboard",
      gamification: "gamification",
    };
    
    const section = sectionMap[command];
    if (section && sectionsRef.current[section]) {
      sectionsRef.current[section]?.scrollIntoView({ behavior: "smooth" });
      setActiveSection(section);
    }
  };

  const scrollToSection = (section: string) => {
    sectionsRef.current[section]?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(section);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    Object.values(sectionsRef.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <ParticleBackground />

      {/* Hero Section */}
      <section
        id="hero"
        ref={(el) => (sectionsRef.current.hero = el)}
        className="min-h-screen flex flex-col items-center justify-center px-4 relative"
      >
        <div className="text-center space-y-6 sm:space-y-8 max-w-6xl mx-auto animate-fade-in-up">
          <div className="inline-block mb-2 sm:mb-4">
            <Brain className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-primary animate-pulse-glow mx-auto mb-2 sm:mb-4" />
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-black">
            <span className="gradient-text">NEURAL</span>
            <br />
            <span className="neon-text">EXPERIENCE</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto px-2">
            Step into the future with AI-powered visualization, real-time collaboration,
            voice controls, and cutting-edge data analytics. All in one stunning interface.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center items-center w-full max-w-md sm:max-w-none mx-auto">
            <Button
              size="lg"
              onClick={() => navigate("/chat")}
              className="w-full sm:w-auto bg-gradient-to-r from-secondary to-accent hover:opacity-80 transition-opacity text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 hover-scale"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Try AI Chat
            </Button>
            <Button
              size="lg"
              onClick={() => scrollToSection("neural")}
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:opacity-80 transition-opacity text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 hover-scale"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Explore Features
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("gamification")}
              className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 hover-scale"
            >
              View Achievements
            </Button>
          </div>

          <div className="pt-12 animate-bounce">
            <ChevronDown className="w-8 h-8 text-primary mx-auto" />
          </div>
        </div>
      </section>

      {/* Voice Control Bar */}
      <div className="fixed top-2 md:top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-2 md:px-4 animate-slide-in">
        <VoiceControl onCommand={handleVoiceCommand} />
      </div>

      {/* Neural Network Section */}
      <section
        id="neural"
        ref={(el) => (sectionsRef.current.neural = el)}
        className="min-h-screen flex items-center justify-center px-4 py-20"
      >
        <div className="max-w-7xl w-full animate-fade-in-up">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black gradient-text text-center mb-8 md:mb-12">
            Neural Network Visualization
          </h2>
          <NeuralNetworkViz />
        </div>
      </section>

      {/* Canvas Section */}
      <section
        id="canvas"
        ref={(el) => (sectionsRef.current.canvas = el)}
        className="min-h-screen flex items-center justify-center px-4 py-20"
      >
        <div className="max-w-7xl w-full animate-fade-in-up">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black gradient-text text-center mb-8 md:mb-12">
            Collaboration Canvas
          </h2>
          <CollaborationCanvas />
        </div>
      </section>

      {/* Dashboard Section */}
      <section
        id="dashboard"
        ref={(el) => (sectionsRef.current.dashboard = el)}
        className="min-h-screen flex items-center justify-center px-4 py-20"
      >
        <div className="max-w-7xl w-full animate-fade-in-up">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black gradient-text text-center mb-8 md:mb-12">
            Real-Time Data Dashboard
          </h2>
          <DataDashboard />
        </div>
      </section>

      {/* Gamification Section */}
      <section
        id="gamification"
        ref={(el) => (sectionsRef.current.gamification = el)}
        className="min-h-screen flex items-center justify-center px-4 py-20"
      >
        <div className="max-w-4xl w-full animate-fade-in-up">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black gradient-text text-center mb-8 md:mb-12">
            Achievements & Progress
          </h2>
          <GamificationSystem />
        </div>
      </section>

      {/* Navigation Dots */}
      <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 space-y-3 md:space-y-4">
        {["hero", "neural", "canvas", "dashboard", "gamification"].map((section) => (
          <button
            key={section}
            onClick={() => scrollToSection(section)}
            className={`block w-3 h-3 rounded-full transition-all ${
              activeSection === section
                ? "bg-primary w-12 pulse-glow"
                : "bg-border hover:bg-primary/50"
            }`}
            aria-label={`Navigate to ${section}`}
          />
        ))}
      </div>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border/50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">
            Built with cutting-edge web technologies. Powered by React, Three.js, and AI.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            © 2025 Neural Experience. The future is now.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
