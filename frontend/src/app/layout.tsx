import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ApolloWrapper } from "@/lib/apollo-wrapper";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Slooze Food Ordering",
  description: "Role-based food ordering application with country restrictions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ApolloWrapper>
          <AuthProvider>{children}</AuthProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
