import type { Metadata } from "next";
import { Poppins, Source_Serif_4 } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-sans",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  weight: ["400", "500"],
  style: ["italic"],
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
      className={`${poppins.variable} ${sourceSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
