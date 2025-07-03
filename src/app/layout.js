import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/providers/ReduxProvider";
import { AuthContextProvider } from "@/redux/auth-contex";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Student Collaboration",
  description: "Welcome to Student Collaboration",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <ReduxProvider>
        <AuthContextProvider>
        {children}
        </AuthContextProvider>
      </ReduxProvider>
      </body>
    </html>
  );
}
