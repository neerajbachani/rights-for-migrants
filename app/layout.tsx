import type { Metadata } from "next";
import { Montserrat, Besley } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { ImagesProvider } from "@/lib/contexts/ImagesContext";
import { QueryProvider } from "@/lib/contexts/QueryProvider";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

const besley = Besley({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-besley",
});

export const metadata: Metadata = {
  title: "Right for Migrants",
  description: "A Migrant Rights Movement calling on the government and political parties to change their views.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${besley.variable} bg-background text-foreground`}
      >
        <QueryProvider>
          <AuthProvider>
            <ImagesProvider>
              <LenisProvider>
                {children}
              </LenisProvider>
            </ImagesProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}