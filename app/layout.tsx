import "./globals.css";
import { Raleway } from "next/font/google";
import { cn } from "@/lib/utils";

const raleway = Raleway({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("h-full antialiased", "font-sans", raleway.variable)}>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}