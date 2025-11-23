import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Activity, Zap } from "lucide-react";

export const DataDashboard = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Generate initial data
    const generateData = () => {
      return Array.from({ length: 12 }, (_, i) => ({
        name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
        value: Math.floor(Math.random() * 100) + 50,
        performance: Math.floor(Math.random() * 80) + 20,
        efficiency: Math.floor(Math.random() * 90) + 10,
      }));
    };

    setData(generateData());

    // Update data periodically
    const interval = setInterval(() => {
      setData((prevData) =>
        prevData.map((item) => ({
          ...item,
          value: Math.max(0, item.value + (Math.random() - 0.5) * 20),
          performance: Math.max(0, Math.min(100, item.performance + (Math.random() - 0.5) * 15)),
          efficiency: Math.max(0, Math.min(100, item.efficiency + (Math.random() - 0.5) * 10)),
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const pieData = [
    { name: "Neural Processing", value: 35, color: "#00F5FF" },
    { name: "Data Analysis", value: 25, color: "#FF006E" },
    { name: "Model Training", value: 20, color: "#8B5CF6" },
    { name: "Optimization", value: 20, color: "#FFD700" },
  ];

  const stats = [
    { label: "Active Models", value: "127", icon: Activity, color: "text-neon-cyan" },
    { label: "Processing Speed", value: "98.3%", icon: Zap, color: "text-secondary" },
    { label: "Total Accuracy", value: "99.7%", icon: TrendingUp, color: "text-gold" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="glass-card p-6 hover-scale"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <stat.icon className={`w-12 h-12 ${stat.color} opacity-50`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card p-6">
          <h3 className="text-xl font-bold gradient-text mb-4">Performance Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#8B5CF6" opacity={0.1} />
              <XAxis dataKey="name" stroke="#00F5FF" />
              <YAxis stroke="#00F5FF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(10, 1, 24, 0.9)",
                  border: "1px solid #00F5FF",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#00F5FF"
                strokeWidth={3}
                dot={{ fill: "#00F5FF", r: 6 }}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="performance"
                stroke="#FF006E"
                strokeWidth={3}
                dot={{ fill: "#FF006E", r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass-card p-6">
          <h3 className="text-xl font-bold gradient-text mb-4">Resource Allocation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(10, 1, 24, 0.9)",
                  border: "1px solid #00F5FF",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass-card p-6 lg:col-span-2">
          <h3 className="text-xl font-bold gradient-text mb-4">System Efficiency</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#8B5CF6" opacity={0.1} />
              <XAxis dataKey="name" stroke="#00F5FF" />
              <YAxis stroke="#00F5FF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(10, 1, 24, 0.9)",
                  border: "1px solid #00F5FF",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="efficiency" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};
