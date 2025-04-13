import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Paintbrush, Settings, MessageSquare, Code } from "lucide-react";
import ChatWidget from "@/components/chat/ChatWidget";

interface WidgetConfigProps {}

interface WidgetSettings {
  appearance: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    borderRadius: number;
    iconSize: number;
    headerText: string;
    logoUrl?: string;
  };
  behavior: {
    autoOpen: boolean;
    openDelay: number;
    position: "bottom-right" | "bottom-left" | "top-right" | "top-left";
    showMinimizeButton: boolean;
    persistSession: boolean;
    initialMessage?: string;
  };
  content: {
    welcomeMessage: string;
    placeholderText: string;
    loadingText: string;
    businessContext: string;
    showBranding: boolean;
    showTimestamp: boolean;
  };
  embedding: {
    embedType: "iframe" | "web-component";
    allowFullscreen: boolean;
    responsiveWidth: boolean;
    customCss?: string;
  };
}

const defaultSettings: WidgetSettings = {
  appearance: {
    primaryColor: "#3b82f6",
    secondaryColor: "#f3f4f6",
    fontFamily: "Inter",
    borderRadius: 8,
    iconSize: 40,
    headerText: "Chat Support",
  },
  behavior: {
    autoOpen: false,
    openDelay: 0,
    position: "bottom-right",
    showMinimizeButton: true,
    persistSession: true,
    initialMessage: "",
  },
  content: {
    welcomeMessage: "Hello! How can I assist you today?",
    placeholderText: "Type your message...",
    loadingText: "Thinking...",
    businessContext: "general",
    showBranding: true,
    showTimestamp: true,
  },
  embedding: {
    embedType: "iframe",
    allowFullscreen: true,
    responsiveWidth: true,
    customCss: "",
  },
};

const fontOptions = [
  { value: "Inter", label: "Inter" },
  { value: "Arial", label: "Arial" },
  { value: "Helvetica", label: "Helvetica" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Courier New", label: "Courier New" },
  { value: "Georgia", label: "Georgia" },
  { value: "Verdana", label: "Verdana" },
  { value: "system-ui", label: "System UI" },
];

const positionOptions = [
  { value: "bottom-right", label: "Bottom Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "top-right", label: "Top Right" },
  { value: "top-left", label: "Top Left" },
];

const businessContextOptions = [
  { value: "general", label: "General" },
  { value: "customer-support", label: "Customer Support" },
  { value: "sales", label: "Sales" },
  { value: "technical-support", label: "Technical Support" },
  { value: "uae-government", label: "UAE Government" },
];

const embedTypeOptions = [
  { value: "iframe", label: "iFrame" },
  { value: "web-component", label: "Web Component" },
];

const WidgetConfig: React.FC<WidgetConfigProps> = () => {
  const [settings, setSettings] = useState<WidgetSettings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In a real implementation, this would save to the backend
      // await api.saveWidgetConfig(settings);
      console.log("Saving widget config:", settings);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving widget config:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateAppearance = (
    key: keyof WidgetSettings["appearance"],
    value: any,
  ) => {
    setSettings({
      ...settings,
      appearance: {
        ...settings.appearance,
        [key]: value,
      },
    });
  };

  const updateBehavior = (
    key: keyof WidgetSettings["behavior"],
    value: any,
  ) => {
    setSettings({
      ...settings,
      behavior: {
        ...settings.behavior,
        [key]: value,
      },
    });
  };

  const updateContent = (key: keyof WidgetSettings["content"], value: any) => {
    setSettings({
      ...settings,
      content: {
        ...settings.content,
        [key]: value,
      },
    });
  };

  const updateEmbedding = (
    key: keyof WidgetSettings["embedding"],
    value: any,
  ) => {
    setSettings({
      ...settings,
      embedding: {
        ...settings.embedding,
        [key]: value,
      },
    });
  };

  const generateEmbedCode = () => {
    const { embedType, allowFullscreen, responsiveWidth } = settings.embedding;
    const { primaryColor, borderRadius } = settings.appearance;
    const { position, persistSession } = settings.behavior;
    const { businessContext } = settings.content;

    if (embedType === "iframe") {
      return `<iframe 
  src="${window.location.origin}/embed?primaryColor=${encodeURIComponent(primaryColor)}&borderRadius=${borderRadius}&position=${position}&businessContext=${businessContext}&persistSession=${persistSession}" 
  width="${responsiveWidth ? "100%" : "350px"}" 
  height="500px" 
  frameborder="0" 
  ${allowFullscreen ? "allowfullscreen" : ""}
></iframe>`;
    } else {
      return `<script src="${window.location.origin}/embed/chat-loader.js"></script>
<chat-widget 
  primary-color="${primaryColor}" 
  border-radius="${borderRadius}" 
  position="${position}" 
  business-context="${businessContext}" 
  ${persistSession ? "persist-session" : ""}
></chat-widget>`;
    }
  };

  const colorOptions = [
    "#3b82f6", // Blue
    "#10b981", // Green
    "#ef4444", // Red
    "#f59e0b", // Amber
    "#6366f1", // Indigo
    "#000000", // Black
    "#8b5cf6", // Purple
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Widget Configurator</h1>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Configuration"}
        </Button>
        {savedSuccess && (
          <span className="text-green-500 ml-2">
            Configuration saved successfully!
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="appearance">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger
                value="appearance"
                className="flex items-center gap-2"
              >
                <Paintbrush size={16} />
                <span>Appearance</span>
              </TabsTrigger>
              <TabsTrigger value="behavior" className="flex items-center gap-2">
                <Settings size={16} />
                <span>Behavior</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <MessageSquare size={16} />
                <span>Content</span>
              </TabsTrigger>
              <TabsTrigger
                value="embedding"
                className="flex items-center gap-2"
              >
                <Code size={16} />
                <span>Embedding</span>
              </TabsTrigger>
            </TabsList>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <Label className="block mb-2">Header Text</Label>
                      <Input
                        value={settings.appearance.headerText}
                        onChange={(e) =>
                          updateAppearance("headerText", e.target.value)
                        }
                        placeholder="Chat Support"
                      />
                    </div>

                    <div>
                      <Label className="block mb-2">Primary Color</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color}
                            className={`w-8 h-8 rounded-full border ${settings.appearance.primaryColor === color ? "ring-2 ring-offset-2 ring-black" : ""}`}
                            style={{ backgroundColor: color }}
                            onClick={() =>
                              updateAppearance("primaryColor", color)
                            }
                            aria-label={`Select ${color} as primary color`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={settings.appearance.primaryColor}
                          onChange={(e) =>
                            updateAppearance("primaryColor", e.target.value)
                          }
                          className="w-12 h-8 p-1"
                        />
                        <Input
                          type="text"
                          value={settings.appearance.primaryColor}
                          onChange={(e) =>
                            updateAppearance("primaryColor", e.target.value)
                          }
                          className="w-32"
                        />
                        <span className="text-sm text-muted-foreground">
                          Used for header and buttons
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label className="block mb-2">Secondary Color</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color}
                            className={`w-8 h-8 rounded-full border ${settings.appearance.secondaryColor === color ? "ring-2 ring-offset-2 ring-black" : ""}`}
                            style={{ backgroundColor: color }}
                            onClick={() =>
                              updateAppearance("secondaryColor", color)
                            }
                            aria-label={`Select ${color} as secondary color`}
                          />
                        ))}
                        <button
                          className={`w-8 h-8 rounded-full border bg-white ${settings.appearance.secondaryColor === "#ffffff" ? "ring-2 ring-offset-2 ring-black" : ""}`}
                          onClick={() =>
                            updateAppearance("secondaryColor", "#ffffff")
                          }
                          aria-label="Select white as secondary color"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={settings.appearance.secondaryColor}
                          onChange={(e) =>
                            updateAppearance("secondaryColor", e.target.value)
                          }
                          className="w-12 h-8 p-1"
                        />
                        <Input
                          type="text"
                          value={settings.appearance.secondaryColor}
                          onChange={(e) =>
                            updateAppearance("secondaryColor", e.target.value)
                          }
                          className="w-32"
                        />
                        <span className="text-sm text-muted-foreground">
                          Used for backgrounds and secondary elements
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label className="block mb-2">Font Family</Label>
                      <Select
                        value={settings.appearance.fontFamily}
                        onValueChange={(value) =>
                          updateAppearance("fontFamily", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a font" />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground mt-1">
                        Choose a font for your chat widget
                      </p>
                    </div>

                    <div>
                      <Label className="block mb-2">
                        Border Radius: {settings.appearance.borderRadius}px
                      </Label>
                      <Slider
                        value={[settings.appearance.borderRadius]}
                        min={0}
                        max={20}
                        step={1}
                        onValueChange={(value) =>
                          updateAppearance("borderRadius", value[0])
                        }
                        className="w-full"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Adjust the roundness of corners
                      </p>
                    </div>

                    <div>
                      <Label className="block mb-2">
                        Chat Icon Size: {settings.appearance.iconSize}px
                      </Label>
                      <Slider
                        value={[settings.appearance.iconSize]}
                        min={20}
                        max={60}
                        step={2}
                        onValueChange={(value) =>
                          updateAppearance("iconSize", value[0])
                        }
                        className="w-full"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Size of the chat button when minimized
                      </p>
                    </div>

                    <div>
                      <Label className="block mb-2">Logo URL (Optional)</Label>
                      <Input
                        value={settings.appearance.logoUrl || ""}
                        onChange={(e) =>
                          updateAppearance("logoUrl", e.target.value)
                        }
                        placeholder="https://example.com/logo.png"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Add your logo to the chat header
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Behavior Tab */}
            <TabsContent value="behavior" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="autoOpen" className="block mb-1">
                          Auto Open
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically open the chat widget when page loads
                        </p>
                      </div>
                      <Switch
                        id="autoOpen"
                        checked={settings.behavior.autoOpen}
                        onCheckedChange={(checked) =>
                          updateBehavior("autoOpen", checked)
                        }
                      />
                    </div>

                    {settings.behavior.autoOpen && (
                      <div>
                        <Label className="block mb-2">
                          Open Delay: {settings.behavior.openDelay} seconds
                        </Label>
                        <Slider
                          value={[settings.behavior.openDelay]}
                          min={0}
                          max={30}
                          step={1}
                          onValueChange={(value) =>
                            updateBehavior("openDelay", value[0])
                          }
                          className="w-full"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          Delay before automatically opening the chat
                        </p>
                      </div>
                    )}

                    <div>
                      <Label className="block mb-2">Position</Label>
                      <Select
                        value={settings.behavior.position}
                        onValueChange={(
                          value:
                            | "bottom-right"
                            | "bottom-left"
                            | "top-right"
                            | "top-left",
                        ) => updateBehavior("position", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a position" />
                        </SelectTrigger>
                        <SelectContent>
                          {positionOptions.map((position) => (
                            <SelectItem
                              key={position.value}
                              value={position.value}
                            >
                              {position.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground mt-1">
                        Position of the chat widget on the page
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label
                          htmlFor="showMinimizeButton"
                          className="block mb-1"
                        >
                          Show Minimize Button
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Allow users to minimize the chat widget
                        </p>
                      </div>
                      <Switch
                        id="showMinimizeButton"
                        checked={settings.behavior.showMinimizeButton}
                        onCheckedChange={(checked) =>
                          updateBehavior("showMinimizeButton", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="persistSession" className="block mb-1">
                          Persist Session
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Save chat history between page refreshes
                        </p>
                      </div>
                      <Switch
                        id="persistSession"
                        checked={settings.behavior.persistSession}
                        onCheckedChange={(checked) =>
                          updateBehavior("persistSession", checked)
                        }
                      />
                    </div>

                    <div>
                      <Label className="block mb-2">
                        Initial Message (Optional)
                      </Label>
                      <Textarea
                        value={settings.behavior.initialMessage || ""}
                        onChange={(e) =>
                          updateBehavior("initialMessage", e.target.value)
                        }
                        placeholder="Hi there! How can I help you today?"
                        rows={3}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        First message sent by the bot when chat opens
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <Label className="block mb-2">Welcome Message</Label>
                      <Textarea
                        value={settings.content.welcomeMessage}
                        onChange={(e) =>
                          updateContent("welcomeMessage", e.target.value)
                        }
                        placeholder="Hello! How can I assist you today?"
                        rows={3}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Message shown when no messages exist
                      </p>
                    </div>

                    <div>
                      <Label className="block mb-2">Input Placeholder</Label>
                      <Input
                        value={settings.content.placeholderText}
                        onChange={(e) =>
                          updateContent("placeholderText", e.target.value)
                        }
                        placeholder="Type your message..."
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Placeholder text for the message input
                      </p>
                    </div>

                    <div>
                      <Label className="block mb-2">Loading Text</Label>
                      <Input
                        value={settings.content.loadingText}
                        onChange={(e) =>
                          updateContent("loadingText", e.target.value)
                        }
                        placeholder="Thinking..."
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Text shown while waiting for a response
                      </p>
                    </div>

                    <div>
                      <Label className="block mb-2">Business Context</Label>
                      <Select
                        value={settings.content.businessContext}
                        onValueChange={(value) =>
                          updateContent("businessContext", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a business context" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessContextOptions.map((context) => (
                            <SelectItem
                              key={context.value}
                              value={context.value}
                            >
                              {context.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground mt-1">
                        Context for AI responses and knowledge base
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="showBranding" className="block mb-1">
                          Show Branding
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Display branding in chat messages
                        </p>
                      </div>
                      <Switch
                        id="showBranding"
                        checked={settings.content.showBranding}
                        onCheckedChange={(checked) =>
                          updateContent("showBranding", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="showTimestamp" className="block mb-1">
                          Show Timestamp
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Display timestamp on messages
                        </p>
                      </div>
                      <Switch
                        id="showTimestamp"
                        checked={settings.content.showTimestamp}
                        onCheckedChange={(checked) =>
                          updateContent("showTimestamp", checked)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Embedding Tab */}
            <TabsContent value="embedding" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <Label className="block mb-2">Embed Type</Label>
                      <Select
                        value={settings.embedding.embedType}
                        onValueChange={(value: "iframe" | "web-component") =>
                          updateEmbedding("embedType", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select embed type" />
                        </SelectTrigger>
                        <SelectContent>
                          {embedTypeOptions.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground mt-1">
                        {settings.embedding.embedType === "iframe"
                          ? "iFrame is easier to implement but less customizable"
                          : "Web Component offers more customization but requires JavaScript"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="allowFullscreen" className="block mb-1">
                          Allow Fullscreen
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Enable fullscreen mode for embedded chat
                        </p>
                      </div>
                      <Switch
                        id="allowFullscreen"
                        checked={settings.embedding.allowFullscreen}
                        onCheckedChange={(checked) =>
                          updateEmbedding("allowFullscreen", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="responsiveWidth" className="block mb-1">
                          Responsive Width
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically adjust width to container
                        </p>
                      </div>
                      <Switch
                        id="responsiveWidth"
                        checked={settings.embedding.responsiveWidth}
                        onCheckedChange={(checked) =>
                          updateEmbedding("responsiveWidth", checked)
                        }
                      />
                    </div>

                    <div>
                      <Label className="block mb-2">
                        Custom CSS (Optional)
                      </Label>
                      <Textarea
                        value={settings.embedding.customCss || ""}
                        onChange={(e) =>
                          updateEmbedding("customCss", e.target.value)
                        }
                        placeholder=".chat-widget { /* custom styles */ }"
                        rows={4}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Additional CSS to customize the widget
                      </p>
                    </div>

                    <div>
                      <Label className="block mb-2">Embed Code</Label>
                      <div className="relative">
                        <Textarea
                          value={generateEmbedCode()}
                          readOnly
                          rows={6}
                          className="font-mono text-sm"
                        />
                        <Button
                          className="absolute top-2 right-2"
                          size="sm"
                          onClick={() =>
                            navigator.clipboard.writeText(generateEmbedCode())
                          }
                        >
                          Copy
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Copy this code to embed the chat widget on your website
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
            <div className="bg-gray-100 rounded-lg p-4 h-[600px] relative">
              <ChatWidget
                embedded={true}
                title={settings.appearance.headerText}
                primaryColor={settings.appearance.primaryColor}
                position={settings.behavior.position}
                businessContext={settings.content.businessContext}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetConfig;
