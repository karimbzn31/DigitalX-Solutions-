import type { Metadata } from "next";
import "@/lib/fonts";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";

export const metadata: Metadata = {
  title: {
    default: "DigitalXSolutions Academy",
    template: "%s | DigitalXSolutions Academy",
  },
  description:
    "Maîtrisez l'Intelligence Artificielle, le Vibe Coding et le développement SaaS. Construisez des produits réels. Lancez votre startup.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body className="font-sans antialiased overflow-x-hidden bg-void text-star-white min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
