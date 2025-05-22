"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/Modetoggle";
import { Menu, X, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SignInButton, SignedOut } from "@clerk/nextjs";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-end space-x-1">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 font-momo text-6xl italic font-extrabold animate-bounce leading-none">
                Q
              </span>
              <p className="text-black dark:text-white text-3xl font-semibold leading-none">
                line
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/queues"
              className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Browse Queues
            </Link>
            <Link
              href="/how-it-works"
              className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              How It Works
            </Link>

            <Link
              href="/my-queue"
              className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              My Queue
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="outline" size="sm" asChild>
                    <span className="pointer">Log in</span>
                  </Button>
                </SignInButton>
              </SignedOut>
              {/*<Button
                asChild
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Link href="/admin/create">Create Queue</Link>
              </Button>*/}
            </div>

            <ModeToggle />

            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <Link
                href="/queues"
                className="block py-2 text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse Queues
              </Link>
              <Link
                href="/how-it-works"
                className="block py-2 text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/my-queue"
                className="block py-2 text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Queue
              </Link>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex flex-col space-y-2">
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button variant="outline" size="sm" asChild>
                      <span className="pointer">Log in</span>
                    </Button>
                  </SignInButton>
                </SignedOut>
                {/* <Button
                  asChild
                  size="sm"
                  className="justify-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Link href="/admin/create" onClick={() => setIsMobileMenuOpen(false)}>
                    Create Queue
                  </Link>
                </Button> */}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
