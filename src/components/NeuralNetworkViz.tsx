import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface Node {
  x: number;
  y: number;
  value: number;
  activated: boolean;
}

interface Connection {
  from: Node;
  to: Node;
  weight: number;
  active: boolean;
}

export const NeuralNetworkViz = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const animationRef = useRef<number>();
  const nodesRef = useRef<Node[][]>([]);
  const connectionsRef = useRef<Connection[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Initialize neural network structure
    const layers = [4, 6, 6, 3]; // Input, Hidden1, Hidden2, Output
    const layerSpacing = canvas.width / (layers.length + 1);
    
    nodesRef.current = layers.map((nodeCount, layerIndex) => {
      const nodeSpacing = canvas.height / (nodeCount + 1);
      return Array.from({ length: nodeCount }, (_, nodeIndex) => ({
        x: layerSpacing * (layerIndex + 1),
        y: nodeSpacing * (nodeIndex + 1),
        value: Math.random(),
        activated: false,
      }));
    });

    // Create connections
    connectionsRef.current = [];
    for (let i = 0; i < nodesRef.current.length - 1; i++) {
      nodesRef.current[i].forEach((fromNode) => {
        nodesRef.current[i + 1].forEach((toNode) => {
          connectionsRef.current.push({
            from: fromNode,
            to: toNode,
            weight: Math.random() * 2 - 1,
            active: false,
          });
        });
      });
    }

    let time = 0;
    const animate = () => {
      ctx.fillStyle = "rgba(10, 1, 24, 0.9)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.02;

      // Draw connections
      connectionsRef.current.forEach((conn) => {
        const gradient = ctx.createLinearGradient(
          conn.from.x,
          conn.from.y,
          conn.to.x,
          conn.to.y
        );
        
        if (conn.active) {
          gradient.addColorStop(0, "#00F5FF");
          gradient.addColorStop(1, "#8B5CF6");
          ctx.strokeStyle = gradient;
          ctx.lineWidth = Math.abs(conn.weight) * 3;
          ctx.globalAlpha = 0.8;
        } else {
          ctx.strokeStyle = `rgba(139, 92, 246, ${Math.abs(conn.weight) * 0.2})`;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.3;
        }

        ctx.beginPath();
        ctx.moveTo(conn.from.x, conn.from.y);
        ctx.lineTo(conn.to.x, conn.to.y);
        ctx.stroke();
      });

      // Draw nodes
      nodesRef.current.forEach((layer, layerIndex) => {
        layer.forEach((node, nodeIndex) => {
          // Update node activation
          if (isTraining) {
            node.value = (Math.sin(time + layerIndex + nodeIndex) + 1) / 2;
            node.activated = node.value > 0.6;
          }

          // Draw node
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.activated ? 12 : 8, 0, Math.PI * 2);
          
          const nodeGradient = ctx.createRadialGradient(
            node.x,
            node.y,
            0,
            node.x,
            node.y,
            node.activated ? 20 : 10
          );
          
          if (node.activated) {
            nodeGradient.addColorStop(0, "#FFD700");
            nodeGradient.addColorStop(1, "#FF006E");
            ctx.shadowBlur = 20;
            ctx.shadowColor = "#FFD700";
          } else {
            nodeGradient.addColorStop(0, "#00F5FF");
            nodeGradient.addColorStop(1, "#8B5CF6");
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#00F5FF";
          }
          
          ctx.fillStyle = nodeGradient;
          ctx.globalAlpha = 1;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Draw value
          ctx.fillStyle = "#0A0118";
          ctx.font = "bold 10px Inter";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(node.value.toFixed(2), node.x, node.y);
        });
      });

      // Update connections based on node activation
      connectionsRef.current.forEach((conn) => {
        conn.active = conn.from.activated && Math.random() > 0.5;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isTraining]);

  const startTraining = () => {
    setIsTraining(true);
    let acc = 0;
    const interval = setInterval(() => {
      acc = Math.min(acc + Math.random() * 5, 99);
      setAccuracy(acc);
      if (acc >= 98) {
        clearInterval(interval);
        setIsTraining(false);
      }
    }, 100);
  };

  return (
    <Card className="glass-card p-6 hover-scale">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold gradient-text">Neural Network</h3>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-muted-foreground">Accuracy:</span>{" "}
            <span className="text-gold font-bold">{accuracy.toFixed(1)}%</span>
          </div>
          <Button
            onClick={startTraining}
            disabled={isTraining}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-80 transition-opacity"
          >
            <Zap className="w-4 h-4 mr-2" />
            {isTraining ? "Training..." : "Train Network"}
          </Button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-[400px] rounded-lg border border-border/50"
      />
    </Card>
  );
};
