"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SearchWithinDocumentProps {
  documentId: string;
}

export default function SearchWithinDocument({
  documentId,
}: SearchWithinDocumentProps) {
  const [query, setQuery] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSearch = () => {
    if (query.trim()) {
      router.push(
        `/search?q=document:${documentId} ${encodeURIComponent(query)}`
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Add keyboard shortcut to focus the search bar (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Check if Cmd+K or Ctrl+K is pressed
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault(); // Prevent default browser behavior
        inputRef.current?.focus();
      } else if (
        e.key === "/" &&
        !["TEXTAREA", "INPUT"].includes(document.activeElement?.tagName || "")
      ) {
        // Also support "/" as a shortcut when not in a text field
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  return (
    <div className="mt-6">
      <div
        className={`flex shadow-md rounded-lg overflow-hidden transition duration-200 border ${
          isInputFocused
            ? "ring-2 ring-blue-400 border-blue-400"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <div className="relative flex-1 flex items-stretch">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${
                isInputFocused ? "text-blue-500" : "text-gray-400"
              }`}
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
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            placeholder="Search within this document... (⌘K)"
            className="flex-1 py-2 pl-12 pr-4 w-full bg-transparent focus:outline-none text-gray-700"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 transition-colors flex items-center"
        >
          <span>Search</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
