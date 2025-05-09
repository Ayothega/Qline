import Navbarui from "@/components/Navbarui";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

export const metadata = {
  title: "Qline",
  description: "Queue Management app",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body>
        <Navbarui />
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
