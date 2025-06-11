import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Home, HelpCircle } from "lucide-react";

export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <Card className="w-full max-w-lg bg-zinc-900 border-zinc-800 text-white">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center">
                        <HelpCircle className="w-12 h-12 text-zinc-400" />
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-4xl font-bold text-white">
                            404
                        </CardTitle>
                        <CardDescription className="text-lg text-zinc-300">
                            Page Not Found
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="text-center space-y-4">
                    <p className="text-zinc-400 leading-relaxed">
                        Sorry, we couldn't find the page you're looking for. The page might have been moved,
                        deleted, or you might have entered an incorrect URL.
                    </p>

                    <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                        <p className="text-sm text-zinc-300 mb-3 font-medium">
                            Here are some helpful options:
                        </p>
                        <ul className="text-sm text-zinc-400 space-y-1 text-left">
                            <li className="flex items-center space-x-2">
                                <div className="w-1 h-1 bg-zinc-500 rounded-full"></div>
                                <span>Check the URL for any typos</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <div className="w-1 h-1 bg-zinc-500 rounded-full"></div>
                                <span>Visit the homepage</span>
                            </li>
                        </ul>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <Button
                            asChild
                            className="flex-1 h-11 bg-white text-black font-semibold hover:bg-gray-100 active:bg-gray-200 transition-colors"
                        >
                            <Link href="/">
                                <Home className="w-4 h-4 mr-2" />
                                Go Home
                            </Link>
                        </Button>

                    </div>

                    <div className="flex items-center justify-center space-x-4 text-sm text-zinc-500">
                        <Link
                            href="/sign-in"
                            className="hover:text-zinc-300 transition-colors"
                        >
                            Sign In
                        </Link>
                        <span>•</span>
                        <Link
                            href="/sign-up"
                            className="hover:text-zinc-300 transition-colors"
                        >
                            Sign Up
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
} 