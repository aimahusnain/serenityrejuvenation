"use client";

import { ThemeProvider } from "next-themes";

export default function ThemeContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
        <ThemeProvider attribute="class" defaultTheme="dark">{children}</ThemeProvider>
    </html>
  );
}
