import type { Metadata } from "next";
import { Be_Vietnam_Pro} from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { ImagesProvider } from "@/lib/contexts/ImagesContext";


const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-be-vietnam-pro",
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
        className={`${beVietnamPro.variable} bg-background text-foreground`}
      >
        <AuthProvider>
          <ImagesProvider>
            <LenisProvider>
              {children}
            </LenisProvider>
          </ImagesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
