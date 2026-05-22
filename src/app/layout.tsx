import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider, applyThemeScript  } from "@/theme";
import { getColorMode } from "@/theme/colorMode";

export const metadata: Metadata = {
  title: "Theme Switcher — shadcn/ui Demo",
  description: "A Next.js demo with a runtime tweakcn-style theme switcher and shadcn/ui components.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const htmlClass = await getColorMode();

  return (
    <html lang="en" className={htmlClass}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: applyThemeScript }} />
      </head>
      <body >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
