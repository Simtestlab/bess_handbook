import type { Metadata } from "next";
import MUIThemeProvider from './components/ThemeProvider';
import "./globals.css";

export const metadata: Metadata = {
  title: "BESS Engineering Dashboard",
  description: "Battery Energy Storage System Calculator & Design Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MUIThemeProvider>
          {children}
        </MUIThemeProvider>
      </body>
    </html>
  );
}
