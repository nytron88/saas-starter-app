export default function Loading() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                {/* Animated spinner */}
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-zinc-700 border-t-white rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-l-zinc-400 rounded-full animate-spin [animation-delay:150ms]"></div>
                </div>

                {/* Loading text with fade animation */}
                <div className="text-white text-lg font-medium animate-pulse">
                    Loading...
                </div>

                {/* Dots animation */}
                <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:200ms]"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:400ms]"></div>
                </div>
            </div>
        </div>
    );
} 