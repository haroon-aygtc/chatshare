import { cn } from "@/lib/utils";

interface MessageLoaderProps {
  className?: string;
}

export function MessageLoader({ className }: MessageLoaderProps) {
  return (
    <div className={cn("flex space-x-2", className)}>
      <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" />
      <div
        className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
        style={{ animationDelay: "0.2s" }}
      />
      <div
        className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
        style={{ animationDelay: "0.4s" }}
      />
    </div>
  );
}
