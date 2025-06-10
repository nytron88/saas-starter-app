import { cn } from "@/lib/utils";

interface SpinnerProps {
    size?: "sm" | "md" | "lg";
    className?: string;
}

export function Spinner({ size = "md", className }: SpinnerProps) {
    const sizeClasses = {
        sm: "w-4 h-4 border-2",
        md: "w-6 h-6 border-2",
        lg: "w-8 h-8 border-3"
    };

    return (
        <div
            className={cn(
                "border-transparent border-t-current rounded-full animate-spin",
                sizeClasses[size],
                className
            )}
        />
    );
}

export function LoadingDots({ className }: { className?: string }) {
    return (
        <div className={cn("flex space-x-1", className)}>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
        </div>
    );
} 