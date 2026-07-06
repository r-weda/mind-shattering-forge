import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  LineChart,
  PieChart,
  Sparkles,
  Wand2,
  Zap,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const chartTypes = [
  { icon: BarChart3, name: "Bar charts", use: "Comparing categories or discrete values" },
  { icon: LineChart, name: "Line charts", use: "Showing trends over time" },
  { icon: PieChart, name: "Pie & donut charts", use: "Displaying proportions of a whole" },
];

const steps = [
  {
    title: "Describe your data in plain English",
    body: "Paste raw numbers, a CSV, or just explain the story you want to tell. Modern AI models can parse messy input — no formatting required.",
  },
  {
    title: "Let the AI pick the right chart type",
    body: "A good AI chart generator infers whether your data is comparative, temporal, or proportional and matches it to the correct visualization.",
  },
  {
    title: "Refine with natural-language prompts",
    body: 'Iterate with prompts like "make it stacked", "sort descending", or "highlight the top 3". No manual axis tweaking.',
  },
  {
    title: "Export or embed",
    body: "Download as PNG/SVG or copy embed code. Great charts are ones you can actually ship.",
  },
];

const faqs = [
  {
    q: "What is an AI chart generator?",
    a: "An AI chart generator turns natural-language prompts or raw data into finished visualizations. Instead of configuring axes, legends, and colors by hand, you describe what you want and the model produces the chart.",
  },
  {
    q: "Which chart type should I use?",
    a: "Use bar charts for comparisons, line charts for trends over time, pie charts for parts of a whole, and scatter plots for correlations. When in doubt, ask the AI — it will pick based on your data shape.",
  },
  {
    q: "Do I need to clean my data first?",
    a: "No. Modern AI models handle unstructured, messy, or partial data. Paste what you have and iterate with prompts.",
  },
  {
    q: "Can I use AI charts in reports or dashboards?",
    a: "Yes — export as SVG for print-ready reports, PNG for slides, or embed live charts in dashboards via a shareable link.",
  },
];

const ChartGenerator = () => {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>AI Chart Generator — Turn Data into Visualizations Instantly</title>
        <meta
          name="description"
          content="Guide to AI chart generation: pick the right chart type, prompt the model, and export finished visualizations. Learn how AI turns raw data into charts."
        />
        <link
          rel="canonical"
          href="https://mind-shatter-lab.lovable.app/tools/chart-generator"
        />
        <meta
          property="og:title"
          content="AI Chart Generator — Turn Data into Visualizations Instantly"
        />
        <meta
          property="og:description"
          content="Guide to AI chart generation: pick the right chart type, prompt the model, and export finished visualizations."
        />
        <meta
          property="og:url"
          content="https://mind-shatter-lab.lovable.app/tools/chart-generator"
        />
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>
      <ParticleBackground />

      <main className="relative max-w-5xl mx-auto px-4 py-16 md:py-24">
        {/* Hero */}
        <header className="text-center mb-16 animate-fade-in-up">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
            <Sparkles className="w-3 h-3 mr-1" /> AI Tools
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <span className="gradient-text">AI Chart</span>{" "}
            <span className="neon-text">Generator</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Turn raw data and plain-English prompts into publication-ready charts.
            This guide covers how AI chart generation works, which chart type to
            pick, and how to prompt for the result you want.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/chat">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:opacity-80 hover-scale"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Try it in Neural Chat
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="border-primary/50">
                How it works <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </header>

        {/* Chart types */}
        <section aria-labelledby="chart-types" className="mb-20">
          <h2
            id="chart-types"
            className="text-3xl md:text-4xl font-black gradient-text text-center mb-10"
          >
            Which chart type fits your data?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {chartTypes.map((c) => (
              <Card key={c.name} className="glass-card p-6 hover-scale">
                <c.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">{c.name}</h3>
                <p className="text-sm text-muted-foreground">{c.use}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" aria-labelledby="how-heading" className="mb-20">
          <h2
            id="how-heading"
            className="text-3xl md:text-4xl font-black gradient-text text-center mb-10"
          >
            How AI chart generation works
          </h2>
          <ol className="space-y-4">
            {steps.map((s, i) => (
              <li key={s.title}>
                <Card className="glass-card p-6 flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-black">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{s.title}</h3>
                    <p className="text-muted-foreground text-sm">{s.body}</p>
                  </div>
                </Card>
              </li>
            ))}
          </ol>
        </section>

        {/* Prompting tips */}
        <section aria-labelledby="prompts" className="mb-20">
          <h2
            id="prompts"
            className="text-3xl md:text-4xl font-black gradient-text text-center mb-10"
          >
            Prompts that produce great charts
          </h2>
          <Card className="glass-card p-6 md:p-8">
            <ul className="space-y-4">
              {[
                'Compare Q1–Q4 revenue for 2023 and 2024 as a grouped bar chart.',
                'Plot daily active users for the last 90 days as a smooth line chart with a 7-day moving average.',
                'Show revenue share by product category as a donut chart, sorted largest to smallest.',
                'Turn this CSV into the clearest chart. Explain why you chose that type.',
              ].map((prompt) => (
                <li key={prompt} className="flex gap-3">
                  <Wand2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <code className="text-sm text-muted-foreground font-mono">
                    {prompt}
                  </code>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        {/* Why AI */}
        <section aria-labelledby="why" className="mb-20">
          <h2
            id="why"
            className="text-3xl md:text-4xl font-black gradient-text text-center mb-10"
          >
            Why use an AI chart generator?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { t: "Speed", d: "Skip menus and property panels — go from prompt to chart in seconds." },
              { t: "Right chart, first try", d: "The AI picks a chart type suited to your data's shape." },
              { t: "Iterate in words", d: 'Say "make it stacked" or "hide the legend" instead of hunting settings.' },
              { t: "Handles messy input", d: "Paste unstructured data; the model normalizes it for you." },
            ].map((f) => (
              <Card key={f.t} className="glass-card p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold mb-1">{f.t}</h3>
                    <p className="text-sm text-muted-foreground">{f.d}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq" className="mb-20">
          <h2
            id="faq"
            className="text-3xl md:text-4xl font-black gradient-text text-center mb-10"
          >
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <Card key={f.q} className="glass-card p-6">
                <h3 className="text-lg font-bold mb-2">{f.q}</h3>
                <p className="text-sm text-muted-foreground">{f.a}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <Card className="glass-card p-10">
            <Zap className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse-glow" />
            <h2 className="text-3xl md:text-4xl font-black gradient-text mb-4">
              Ready to generate your first AI chart?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Open Neural Chat, paste your data or describe what you want, and let
              the AI build the visualization for you.
            </p>
            <Link to="/chat">
              <Button
                size="lg"
                className="bg-gradient-to-r from-secondary to-accent hover:opacity-80 hover-scale"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Start generating charts
              </Button>
            </Link>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default ChartGenerator;
