import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Copy, Check, Code, Globe, Smartphone, Desktop } from "lucide-react";

const EmbedCode = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const [businessContext, setBusinessContext] = useState("general");
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [position, setPosition] = useState("bottom-right");
  const [embedType, setEmbedType] = useState("iframe");
  const [autoOpen, setAutoOpen] = useState(false);
  const [showBranding, setShowBranding] = useState(true);
  const [responsiveWidth, setResponsiveWidth] = useState(true);
  const [customDomain, setCustomDomain] = useState("");
  const [previewDevice, setPreviewDevice] = useState("desktop");

  const handleCopy = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const getIframeCode = () => {
    const baseUrl = customDomain || window.location.origin;
    return `<iframe 
  src="${baseUrl}/embed?primaryColor=${encodeURIComponent(primaryColor)}&position=${position}&businessContext=${businessContext}&autoOpen=${autoOpen}&showBranding=${showBranding}" 
  width="${responsiveWidth ? "100%" : "350px"}" 
  height="500px" 
  frameborder="0" 
  allow="microphone" 
  allowfullscreen
></iframe>`;
  };

  const getWebComponentCode = () => {
    const baseUrl = customDomain || window.location.origin;
    return `<script src="${baseUrl}/embed/chat-loader.js"></script>
<chat-widget 
  primary-color="${primaryColor}" 
  position="${position}" 
  business-context="${businessContext}" 
  ${autoOpen ? "auto-open" : ""}
  ${showBranding ? "show-branding" : ""}
></chat-widget>`;
  };

  const getJavaScriptCode = () => {
    const baseUrl = customDomain || window.location.origin;
    return `<script>
  (function(w,d,s,o,f,js,fjs){
    w['ChatWidget']=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s),fjs=d.getElementsByTagName(s)[0];
    js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  }(window,document,'script','cw','${baseUrl}/embed/chat-loader.min.js'));
  cw('init', { 
    primaryColor: '${primaryColor}',
    position: '${position}',
    businessContext: '${businessContext}',
    autoOpen: ${autoOpen},
    showBranding: ${showBranding}
  });
</script>`;
  };

  const getSelectedCode = () => {
    switch (embedType) {
      case "iframe":
        return getIframeCode();
      case "web-component":
        return getWebComponentCode();
      case "javascript":
        return getJavaScriptCode();
      default:
        return getIframeCode();
    }
  };

  const businessContextOptions = [
    { value: "general", label: "General" },
    { value: "customer-support", label: "Customer Support" },
    { value: "sales", label: "Sales" },
    { value: "technical-support", label: "Technical Support" },
    { value: "uae-government", label: "UAE Government" },
  ];

  const positionOptions = [
    { value: "bottom-right", label: "Bottom Right" },
    { value: "bottom-left", label: "Bottom Left" },
    { value: "top-right", label: "Top Right" },
    { value: "top-left", label: "Top Left" },
  ];

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
      <h1 className="text-2xl font-bold mb-6">Embed Code Generator</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Configure Your Chat Widget</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="embed-type">Embed Type</Label>
                    <Select value={embedType} onValueChange={setEmbedType}>
                      <SelectTrigger id="embed-type">
                        <SelectValue placeholder="Select embed type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="iframe">iFrame</SelectItem>
                        <SelectItem value="web-component">
                          Web Component
                        </SelectItem>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-1">
                      {embedType === "iframe" &&
                        "Simple to implement but less customizable"}
                      {embedType === "web-component" &&
                        "More customizable with Shadow DOM isolation"}
                      {embedType === "javascript" &&
                        "Most flexible with programmatic control"}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="business-context">Business Context</Label>
                    <Select
                      value={businessContext}
                      onValueChange={setBusinessContext}
                    >
                      <SelectTrigger id="business-context">
                        <SelectValue placeholder="Select business context" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessContextOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-1">
                      Determines AI responses and knowledge base
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Select value={position} onValueChange={setPosition}>
                      <SelectTrigger id="position">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        {positionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-1">
                      Where the chat widget appears on the page
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full border ${primaryColor === color ? "ring-2 ring-offset-2 ring-black" : ""}`}
                          style={{ backgroundColor: color }}
                          onClick={() => setPrimaryColor(color)}
                          aria-label={`Select ${color} as primary color`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-12 h-8 p-1"
                      />
                      <Input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-32"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-open">Auto Open</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically open when page loads
                      </p>
                    </div>
                    <Switch
                      id="auto-open"
                      checked={autoOpen}
                      onCheckedChange={setAutoOpen}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="show-branding">Show Branding</Label>
                      <p className="text-sm text-muted-foreground">
                        Display branding in chat messages
                      </p>
                    </div>
                    <Switch
                      id="show-branding"
                      checked={showBranding}
                      onCheckedChange={setShowBranding}
                    />
                  </div>

                  {embedType === "iframe" && (
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="responsive-width">
                          Responsive Width
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Adapt to container width
                        </p>
                      </div>
                      <Switch
                        id="responsive-width"
                        checked={responsiveWidth}
                        onCheckedChange={setResponsiveWidth}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t">
                <Label htmlFor="custom-domain">Custom Domain (Optional)</Label>
                <Input
                  id="custom-domain"
                  placeholder="https://chat.yourdomain.com"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  If you're using a custom domain for the chat service
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code size={20} />
                <span>Embed Code</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Textarea
                  value={getSelectedCode()}
                  readOnly
                  rows={8}
                  className="font-mono text-sm"
                />
                <Button
                  className="absolute top-2 right-2"
                  size="sm"
                  onClick={() => handleCopy(getSelectedCode(), embedType)}
                >
                  {copied === embedType ? (
                    <>
                      <Check size={16} className="mr-1" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={16} className="mr-1" /> Copy
                    </>
                  )}
                </Button>
              </div>

              <div className="mt-4 p-4 bg-muted rounded-md">
                <h3 className="font-medium mb-2">Installation Instructions</h3>
                {embedType === "iframe" && (
                  <p className="text-sm">
                    Add this iframe code to any HTML page where you want the
                    chat widget to appear. You can adjust the width and height
                    as needed.
                  </p>
                )}
                {embedType === "web-component" && (
                  <p className="text-sm">
                    Add this code just before the closing &lt;/body&gt; tag of
                    your HTML page. The web component will create an isolated
                    chat widget with Shadow DOM.
                  </p>
                )}
                {embedType === "javascript" && (
                  <p className="text-sm">
                    Add this JavaScript snippet just before the closing
                    &lt;/body&gt; tag of your HTML page. This method gives you
                    programmatic control over the widget.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <div className="flex justify-center mt-2 border rounded-lg overflow-hidden">
                <button
                  className={`p-2 ${previewDevice === "mobile" ? "bg-muted" : ""}`}
                  onClick={() => setPreviewDevice("mobile")}
                >
                  <Smartphone size={20} />
                </button>
                <button
                  className={`p-2 ${previewDevice === "tablet" ? "bg-muted" : ""}`}
                  onClick={() => setPreviewDevice("tablet")}
                >
                  <Smartphone size={20} className="rotate-90" />
                </button>
                <button
                  className={`p-2 ${previewDevice === "desktop" ? "bg-muted" : ""}`}
                  onClick={() => setPreviewDevice("desktop")}
                >
                  <Desktop size={20} />
                </button>
                <button
                  className={`p-2 ${previewDevice === "website" ? "bg-muted" : ""}`}
                  onClick={() => setPreviewDevice("website")}
                >
                  <Globe size={20} />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={`bg-gray-100 rounded-lg overflow-hidden mx-auto ${previewDevice === "mobile" ? "w-[320px] h-[568px]" : previewDevice === "tablet" ? "w-[768px] h-[500px]" : "w-full h-[500px]"}`}
              >
                {previewDevice === "website" ? (
                  <div className="bg-white h-full p-4 relative">
                    <div className="border-b pb-4 mb-4">
                      <div className="h-8 bg-gray-200 rounded-md w-48 mb-2"></div>
                      <div className="flex gap-4">
                        <div className="h-4 bg-gray-200 rounded-md w-16"></div>
                        <div className="h-4 bg-gray-200 rounded-md w-16"></div>
                        <div className="h-4 bg-gray-200 rounded-md w-16"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="h-32 bg-gray-200 rounded-md"></div>
                      <div className="h-32 bg-gray-200 rounded-md"></div>
                    </div>
                    <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>

                    {/* Chat widget preview */}
                    <div
                      className={`fixed ${position.includes("bottom") ? "bottom-4" : "top-4"} ${position.includes("right") ? "right-4" : "left-4"} z-50`}
                      style={{ position: "absolute" }}
                    >
                      {autoOpen ? (
                        <div className="bg-white rounded-lg shadow-lg w-[300px] h-[400px] flex flex-col overflow-hidden">
                          <div
                            className="p-3"
                            style={{ backgroundColor: primaryColor }}
                          >
                            <div className="text-white font-medium">
                              Chat Support
                            </div>
                          </div>
                          <div className="flex-1 p-3 bg-gray-50">
                            {showBranding && (
                              <div className="flex items-center gap-2 mb-3">
                                <div
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                                  style={{ backgroundColor: primaryColor }}
                                >
                                  {businessContext.charAt(0).toUpperCase()}
                                </div>
                                <div className="text-sm font-medium">
                                  {businessContext.charAt(0).toUpperCase() +
                                    businessContext.slice(1)}{" "}
                                  Assistant
                                </div>
                              </div>
                            )}
                            <div className="text-sm text-gray-600">
                              Hello! How can I assist you today?
                            </div>
                          </div>
                          <div className="p-3 border-t">
                            <div className="bg-gray-100 rounded-md p-2 text-sm text-gray-400">
                              Type your message...
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white"
                          style={{ backgroundColor: primaryColor }}
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div
                      className={`${autoOpen ? "w-full h-full" : "w-12 h-12 rounded-full"} flex items-center justify-center`}
                      style={{
                        backgroundColor: autoOpen ? "white" : primaryColor,
                        color: autoOpen ? "inherit" : "white",
                      }}
                    >
                      {autoOpen ? (
                        <div className="w-full h-full flex flex-col">
                          <div
                            className="p-3"
                            style={{ backgroundColor: primaryColor }}
                          >
                            <div className="text-white font-medium">
                              Chat Support
                            </div>
                          </div>
                          <div className="flex-1 p-3 bg-gray-50">
                            {showBranding && (
                              <div className="flex items-center gap-2 mb-3">
                                <div
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                                  style={{ backgroundColor: primaryColor }}
                                >
                                  {businessContext.charAt(0).toUpperCase()}
                                </div>
                                <div className="text-sm font-medium">
                                  {businessContext.charAt(0).toUpperCase() +
                                    businessContext.slice(1)}{" "}
                                  Assistant
                                </div>
                              </div>
                            )}
                            <div className="text-sm text-gray-600">
                              Hello! How can I assist you today?
                            </div>
                          </div>
                          <div className="p-3 border-t">
                            <div className="bg-gray-100 rounded-md p-2 text-sm text-gray-400">
                              Type your message...
                            </div>
                          </div>
                        </div>
                      ) : (
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmbedCode;
