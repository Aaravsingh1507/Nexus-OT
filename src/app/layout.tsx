import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEXUS-OT — Unified Asset & Operations Brain",
  description: "Real-time industrial knowledge intelligence platform cross-referencing maintenance logs, engineering drawings, safety SOPs, and OISD compliance.",
  applicationName: "NEXUS-OT",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#111417"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-[#111417]">
      <body className="h-full flex flex-col antialiased text-[#EAE6DF] overflow-hidden">
        {children}
      </body>
    </html>
  );
}
