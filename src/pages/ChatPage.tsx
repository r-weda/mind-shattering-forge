import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/AuthForm";
import { AIChat } from "@/components/AIChat";
import { ParticleBackground } from "@/components/ParticleBackground";

const ChatPage = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ParticleBackground />
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>AI Chat - Neural Experience</title>
        <meta name="description" content="Engage with our advanced AI assistant for real-time help and neural network insights. Session-based chat with selectable personality modes — no sign-up required." />
        <link rel="canonical" href="https://mind-shatter-lab.lovable.app/chat" />
        <meta property="og:title" content="AI Chat - Neural Experience" />
        <meta property="og:description" content="Engage with our advanced AI assistant for real-time help and neural network insights." />
        <meta property="og:url" content="https://mind-shatter-lab.lovable.app/chat" />
      </Helmet>
      <ParticleBackground />
      {!session ? <AuthForm /> : <AIChat />}
    </>
  );
};

export default ChatPage;
