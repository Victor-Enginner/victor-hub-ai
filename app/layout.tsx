import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Victor Hub AI — Arsenal Pessoal de Produção Real",
  description:
    "Dev Web & Designer Full Stack. UI/UX, sites animados, 3D, arquitetura de software, automações e landing pages — mais o Victor Hub OS, seu sistema de operação.",
  openGraph: {
    title: "Victor Hub OS",
    description: "Seu ambiente neural de produção real.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-[#050505] text-[#f7f7f8] antialiased selection:bg-[#ef233c] selection:text-white">
        {children}
      </body>
    </html>
  );
}
