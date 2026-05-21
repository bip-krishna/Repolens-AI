import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RepoLens AI — Understand Any GitHub Repository in Minutes",
  description:
    "AI-powered developer platform that analyzes GitHub repositories and generates architecture insights, contributor onboarding guides, code explanations, and interactive visualizations.",
  keywords: [
    "GitHub",
    "repository analysis",
    "AI",
    "code understanding",
    "architecture visualization",
    "developer tools",
  ],
  openGraph: {
    title: "RepoLens AI",
    description: "Understand Any GitHub Repository in Minutes",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
