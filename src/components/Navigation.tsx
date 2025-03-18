"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav
      className="sticky top-0 z-50 shadow-md"
      style={{
        backgroundColor: "var(--dark-bg)",
        borderBottom: "1px solid var(--dark-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/dashboard"
                className="text-xl font-bold gradient-text flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ color: "var(--gradient-mid)" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                SummaryDojo
              </Link>
            </div>

            <SignedIn>
              <div className="hidden md:ml-8 md:flex md:space-x-6">
                <Link
                  href="/dashboard"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-16 ${
                    isActive("/dashboard") ? "gradient-text" : ""
                  }`}
                  style={{
                    borderColor: isActive("/dashboard")
                      ? "var(--gradient-mid)"
                      : "transparent",
                    color: isActive("/dashboard") ? "" : "var(--dark-muted)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Dashboard
                </Link>
                <Link
                  href="/upload"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-16 ${
                    isActive("/upload") ? "gradient-text" : ""
                  }`}
                  style={{
                    borderColor: isActive("/upload")
                      ? "var(--gradient-mid)"
                      : "transparent",
                    color: isActive("/upload") ? "" : "var(--dark-muted)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  Upload
                </Link>
                <Link
                  href="/documents"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-16 ${
                    isActive("/documents") ? "gradient-text" : ""
                  }`}
                  style={{
                    borderColor: isActive("/documents")
                      ? "var(--gradient-mid)"
                      : "transparent",
                    color: isActive("/documents") ? "" : "var(--dark-muted)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                    />
                  </svg>
                  Documents
                </Link>
                <Link
                  href="/search"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-16 ${
                    isActive("/search") ? "gradient-text" : ""
                  }`}
                  style={{
                    borderColor: isActive("/search")
                      ? "var(--gradient-mid)"
                      : "transparent",
                    color: isActive("/search") ? "" : "var(--dark-muted)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Search
                </Link>
              </div>
            </SignedIn>
          </div>

          <div className="flex items-center">
            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-9 w-9",
                    userButtonBox: "h-9 w-9",
                  },
                }}
              />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn-primary">Sign In</button>
              </SignInButton>
            </SignedOut>

            {/* Mobile menu button */}
            <SignedIn>
              <button
                type="button"
                className="md:hidden ml-4 p-2 rounded-md focus:outline-none"
                style={{
                  backgroundColor: "var(--dark-card)",
                  color: "var(--dark-muted)",
                }}
                onClick={toggleMobileMenu}
              >
                <span className="sr-only">Open main menu</span>
                {!mobileMenuOpen ? (
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </SignedIn>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <SignedIn>
        {mobileMenuOpen && (
          <div className="md:hidden bg-dark-bg shadow-lg rounded-b-lg border-t border-dark-border absolute w-full">
            <div className="pt-2 pb-3 space-y-1">
              <Link
                href="/dashboard"
                className={`flex items-center pl-3 pr-4 py-3 ${
                  isActive("/dashboard")
                    ? "bg-dark-surface text-gradient-mid border-l-4 border-gradient-mid"
                    : "text-dark-muted hover:bg-dark-surface hover:text-dark-text border-l-4 border-transparent"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Dashboard
              </Link>
              <Link
                href="/upload"
                className={`flex items-center pl-3 pr-4 py-3 ${
                  isActive("/upload")
                    ? "bg-dark-surface text-gradient-mid border-l-4 border-gradient-mid"
                    : "text-dark-muted hover:bg-dark-surface hover:text-dark-text border-l-4 border-transparent"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Upload
              </Link>
              <Link
                href="/documents"
                className={`flex items-center pl-3 pr-4 py-3 ${
                  isActive("/documents")
                    ? "bg-dark-surface text-gradient-mid border-l-4 border-gradient-mid"
                    : "text-dark-muted hover:bg-dark-surface hover:text-dark-text border-l-4 border-transparent"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                  />
                </svg>
                Documents
              </Link>
              <Link
                href="/search"
                className={`flex items-center pl-3 pr-4 py-3 ${
                  isActive("/search")
                    ? "bg-dark-surface text-gradient-mid border-l-4 border-gradient-mid"
                    : "text-dark-muted hover:bg-dark-surface hover:text-dark-text border-l-4 border-transparent"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Search
              </Link>
            </div>
          </div>
        )}
      </SignedIn>
    </nav>
  );
}
