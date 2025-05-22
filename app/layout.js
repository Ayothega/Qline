import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata = {
  title: "Qline",
  description: "Ai powered Queue Management app",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <html lang="en">
          <body>{children}</body>
        </html>
      </ThemeProvider>
    </ClerkProvider>
  );
}
