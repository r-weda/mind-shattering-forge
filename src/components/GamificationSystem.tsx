import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Zap, Target, Award } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  unlocked: boolean;
  progress: number;
  target: number;
}

export const GamificationSystem = () => {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first-draw",
      title: "First Stroke",
      description: "Draw something on the canvas",
      icon: Star,
      unlocked: false,
      progress: 0,
      target: 1,
    },
    {
      id: "neural-master",
      title: "Neural Master",
      description: "Train the neural network 5 times",
      icon: Zap,
      unlocked: false,
      progress: 0,
      target: 5,
    },
    {
      id: "voice-commander",
      title: "Voice Commander",
      description: "Use voice controls 3 times",
      icon: Target,
      unlocked: false,
      progress: 0,
      target: 3,
    },
    {
      id: "explorer",
      title: "Explorer",
      description: "Visit all sections",
      icon: Trophy,
      unlocked: false,
      progress: 0,
      target: 4,
    },
  ]);

  const xpForNextLevel = level * 100;
  const xpProgress = (xp / xpForNextLevel) * 100;

  useEffect(() => {
    // Simulate earning XP
    const interval = setInterval(() => {
      setXp((prev) => {
        const newXp = prev + Math.floor(Math.random() * 10) + 5;
        if (newXp >= xpForNextLevel) {
          setLevel((l) => l + 1);
          return newXp - xpForNextLevel;
        }
        return newXp;
      });

      // Random achievement progress
      setAchievements((prevAchievements) =>
        prevAchievements.map((achievement) => {
          if (!achievement.unlocked && Math.random() > 0.7) {
            const newProgress = Math.min(achievement.progress + 1, achievement.target);
            return {
              ...achievement,
              progress: newProgress,
              unlocked: newProgress >= achievement.target,
            };
          }
          return achievement;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [level, xpForNextLevel]);

  return (
    <Card className="glass-card p-6">
      <div className="space-y-6">
        {/* Level Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-gold" />
              <span className="text-2xl font-bold gradient-text">Level {level}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {xp} / {xpForNextLevel} XP
            </span>
          </div>
          <Progress value={xpProgress} className="h-3 pulse-glow" />
        </div>

        {/* Achievements */}
        <div>
          <h3 className="text-xl font-bold mb-4 gradient-text">Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border transition-all ${
                  achievement.unlocked
                    ? "border-gold bg-gold/10 hover-scale"
                    : "border-border/50 bg-card/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      achievement.unlocked
                        ? "bg-gold/20 text-gold"
                        : "bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    <achievement.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold">{achievement.title}</h4>
                      {achievement.unlocked && (
                        <Badge variant="outline" className="text-gold border-gold">
                          <Award className="w-3 h-3 mr-1" />
                          Unlocked
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {achievement.description}
                    </p>
                    {!achievement.unlocked && (
                      <Progress
                        value={(achievement.progress / achievement.target) * 100}
                        className="h-2"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-3xl font-bold text-primary">{xp}</p>
            <p className="text-sm text-muted-foreground">Total XP</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-secondary/10 border border-secondary/20">
            <p className="text-3xl font-bold text-secondary">{level}</p>
            <p className="text-sm text-muted-foreground">Level</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-gold/10 border border-gold/20">
            <p className="text-3xl font-bold text-gold">
              {achievements.filter((a) => a.unlocked).length}
            </p>
            <p className="text-sm text-muted-foreground">Achievements</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
