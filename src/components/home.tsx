import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Code, Settings, ExternalLink } from "lucide-react";
import ChatWidget from "./chat/ChatWidget";

function Home() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            <span className="text-xl font-bold">Embeddable Chat System</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link to="/chat" className="text-sm font-medium hover:underline">
              Chat Page
            </Link>
            <Link to="/admin" className="text-sm font-medium hover:underline">
              Admin Panel
            </Link>
            <Button asChild variant="outline" size="sm">
              <a href="/embed" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                <ExternalLink className="h-4 w-4" />
                <span>Embed Demo</span>
              </a>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero section */}
      <section className="container py-12 md:py-24 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
              Context-Aware AI Chat System
            </h1>
            <p className="text-lg text-muted-foreground">
              A lightweight, context-aware chat widget that functions both as a standalone application and an embeddable component, leveraging Gemini and Hugging Face AI models.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => setShowChat(true)} size="lg">
                Try the Chat Widget
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/admin">Admin Dashboard</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Live Demo</h3>
            </div>
            <div className="h-[400px] rounded-md border bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Click "Try the Chat Widget" to see it in action</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="container py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="mx-auto max-w-4xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Key Features</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our embeddable chat system provides powerful features for both users and administrators.
          </p>
        </div>

        <Tabs defaultValue="embedding" className="mx-auto max-w-4xl">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="embedding">Seamless Embedding</TabsTrigger>
            <TabsTrigger value="context">Context Awareness</TabsTrigger>
            <TabsTrigger value="ai">AI Integration</TabsTrigger>
          </TabsList>
          <TabsContent value="embedding" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Seamless Embedding & Integration</CardTitle>
                <CardDescription>
                  Easily integrate the chat widget into any website with minimal configuration.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-medium">Lightweight JavaScript Loader</h4>
                    <p className="text-sm text-muted-foreground">
                      A tiny JavaScript loader (<5KB) that non-technical users can insert into their websites.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Multiple Integration Methods</h4>
                    <p className="text-sm text-muted-foreground">
                      Support for both iFrame integration and Web Components using Shadow DOM.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Responsive UI</h4>
                    <p className="text-sm text-muted-foreground">
                      Adaptable to various screen sizes with a floating, draggable widget for embedded use.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Full-Page Experience</h4>
                    <p className="text-sm text-muted-foreground">
                      Access the chat directly via its own URL for a complete, full-page experience.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/embed">View Embedding Demo</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="context" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Context Awareness & Business-Based Prompt Handling</CardTitle>
                <CardDescription>
                  Control the AI's response scope to ensure it stays within set parameters.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-medium">Context Filters</h4>
                    <p className="text-sm text-muted-foreground">
                      Define allowed contexts (e.g., "UAE Government Information") and configure the system to accept only queries matching specified keywords/topics.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Business-Specific Responses</h4>
                    <p className="text-sm text-muted-foreground">
                      Customize responses to reflect business tone, style, and domain-specific rules.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Prompt Templating</h4>
                    <p className="text-sm text-muted-foreground">
                      Define custom AI response templates with placeholders for consistent messaging.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Role-Based Prompting</h4>
                    <p className="text-sm text-muted-foreground">
                      Define AI behaviors based on user types (e.g., customer support, research assistant).
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/admin/contexts">Manage Context Rules</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="ai" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Integration with Multiple Models</CardTitle>
                <CardDescription>
                  Leverage Gemini, Hugging Face, and Grok AI models to handle user queries.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-medium">Model Integration</h4>
                    <p className="text-sm text-muted-foreground">
                      Route user queries to different AI models based on configuration with fallback scenarios if one model fails.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Response Filtering</h4>
                    <p className="text-sm text-muted-foreground">
                      Process AI outputs to enforce context restrictions before displaying to the user.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Response Formatting</h4>
                    <p className="text-sm text-muted-foreground">
                      Structured AI responses with headings, bullet points, numbered lists, and emphasis.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Follow-Up Questions</h4>
                    <p className="text-sm text-muted-foreground">
                      AI can generate relevant follow-up questions based on user queries.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setShowChat(true)} className="w-full">
                  Try the AI Chat
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Integration section */}
      <section className="container py-12 md:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">Easy Integration for Developers</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our system provides a simple JavaScript snippet that can be added to any website to enable the chat widget.
              </p>
              <Button asChild variant="outline">
                <Link to="/embed">
                  <Code className="mr-2 h-4 w-4" />
                  View Integration Guide
                </Link>
              </Button>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <pre className="text-sm overflow-x-auto p-4 bg-muted rounded-md">
                <code>
                  {`<!-- Embeddable Chat Widget -->
<script src="https://your-domain.com/embed/chat-loader.js"></script>
<script>
  window.EmbeddableChat.init({
    businessContext: "general",
    position: "bottom-right",
    title: "Chat Support",
    primaryColor: "#3b82f6"
  });
</script>`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Admin panel section */}
      <section className="container py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="mx-auto max-w-4xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Powerful Admin Dashboard</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Manage all aspects of your chat system through our comprehensive admin panel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto max-w-4xl">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Context Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Define allowed contexts and business-specific rules to control AI responses.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="ghost" size="sm" className="w-full">
                <Link to="/admin/contexts">Manage Contexts</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">User Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Monitor active sessions, view chat histories, and analyze usage patterns.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="ghost" size="sm" className="w-full">
                <Link to="/admin">View Analytics</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">System Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Configure AI models, embedding settings, and security parameters.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="ghost" size="sm" className="w-full">
                <Link to="/admin/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Chat widget */}
      {showChat && (
        <ChatWidget 
          position="bottom-right"
          title="AI Assistant"
          primaryColor="#3b82f6"
          businessContext="general"
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
}

export default Home;