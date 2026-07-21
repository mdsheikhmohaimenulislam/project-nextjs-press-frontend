import "./globals.css";
import { Raleway } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { Navbar } from "@/components/shared/navbar";
import { getMe } from "@/service/getMe";

const raleway = Raleway({ subsets: ["latin"], variable: "--font-sans" });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
const user = await getMe()

  return (
    <html
      lang="en"
      className={cn("h-full antialiased", "font-sans", raleway.variable)}
    >
      <body className="min-h-full flex flex-col">
        <Navbar/>
        <Toaster position="top-right" richColors />
        {children}
      </body>
    </html>
  );
}
