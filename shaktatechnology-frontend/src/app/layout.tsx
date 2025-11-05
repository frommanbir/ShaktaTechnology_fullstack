

import type { Metadata } from "next";
import {  Poppins } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { ThemeProvider } from "@/components/ui/ThemeProvider";


const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600" , "700", "800"]
});

export const metadata: Metadata = {
  title: "Shakta Technology",
  description: "Software Agency",
  icons:{
    icon: "/placeholder.ico"
    
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={` ${poppins.variable}  font-poppins antialiased`}>
          <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
              <ClientLayout>  
                {children}
              </ClientLayout>
          </ThemeProvider>
      </body>
    </html>
  );
}
