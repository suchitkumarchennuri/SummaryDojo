"use client";

import { useState, FormEvent, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import DownloadButton from "./DownloadButton";

interface SearchResult {
  id: string;
  title: string;
  fileName: string;
  snippet: string;
  summary: string;
  score: number;
  url: string;
  highlights: string[];
}

// Main component that doesn't rely on useSearchParams
export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Safe navigation function that doesn't depend on the router
  const safeNavigate = useCallback((path: string) => {
    if (typeof window !== "undefined") {
      window.location.href = path;
    }
  }, []);

  // Check if the component has mounted before running any client-side code
  useEffect(() => {
    // Set mounted state
    setIsMounted(true);

    // Setup error handling for uncaught errors
    const handleError = (event: ErrorEvent) => {
      console.error("Global error caught:", event.error);
      if (event.error?.message?.includes("Connection closed")) {
        setError(
          "Connection to the server was lost. Please refresh the page and try again."
        );
      }
    };

    window.addEventListener("error", handleError);

    // Get the query from the URL on component mount
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlQuery = urlParams.get("q");
      if (urlQuery) {
        setQuery(urlQuery);
        // Wait a moment before performing search to ensure component is fully mounted
        const timer = setTimeout(() => {
          performSearch(urlQuery);
        }, 100);
        return () => clearTimeout(timer);
      }
    } catch (err) {
      console.error("Error reading URL params:", err);
    }

    return () => {
      window.removeEventListener("error", handleError);
      // Cancel any in-progress fetches on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Add keyboard shortcut to focus the search bar (Cmd+K or Ctrl+K)
  useEffect(() => {
    if (!isMounted) return;

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
  }, [isMounted]);

  const performSearch = async (searchQuery: string) => {
    if (!isMounted) return;

    // Cancel any previous in-progress searches
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setIsSearching(true);
    setError("");

    // Keep previous results visible until new ones load
    if (results.length === 0) {
      setResults([]);
    }

    setAiAnswer(null);

    try {
      // Create a new abort controller for this search
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const timeoutId = setTimeout(() => {
        if (controller.signal.aborted) return;
        controller.abort();
      }, 30000); // 30 second timeout

      let response;
      try {
        response = await fetch("/api/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: searchQuery }),
          signal: controller.signal,
          // Add credentials to ensure cookies are sent
          credentials: "include",
        });
      } catch (fetchError) {
        clearTimeout(timeoutId);
        console.error("Network error during fetch:", fetchError);

        if ((fetchError as Error).name === "AbortError") {
          throw new Error(
            "Search request timed out. Please try again with a simpler query."
          );
        }

        // Check if it's a connection error
        if (
          (fetchError as Error).message.includes("fetch failed") ||
          (fetchError as Error).message.includes("network") ||
          (fetchError as Error).message.includes("connection")
        ) {
          throw new Error(
            "Network connection error. Please check your internet and try again."
          );
        }

        throw new Error(
          "Network error while searching. Please check your connection and try again."
        );
      }

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response from search API:", errorText);

        let errorMessage = "Failed to search documents";

        try {
          // Try to parse as JSON
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
          if (errorData.message) {
            errorMessage += `: ${errorData.message}`;
          }
        } catch (e) {
          // If not JSON, it might be HTML from a redirect
          if (response.status === 401) {
            errorMessage = "You are not authenticated. Please sign in again.";
            safeNavigate("/sign-in");
            return;
          }
        }

        throw new Error(errorMessage);
      }

      let data;
      try {
        const rawData = await response.text();
        data = JSON.parse(rawData);
      } catch (jsonError) {
        console.error("Error parsing response as JSON:", jsonError);
        throw new Error("Invalid response format from search API");
      }

      // If we got here, we have valid search results - update state
      if (data.results) {
        setResults(data.results);
      } else {
        setResults([]);
      }

      // If we have an AI-powered answer, set it in state
      if (data.aiAnswer) {
        setAiAnswer(data.aiAnswer);
      } else {
        setAiAnswer(null);
      }

      // Handle the case where we get a warning message from the API
      if (data.warning) {
        setError(`Note: ${data.warning}`);
      }

      // Handle the case where we get a message but no error
      if (
        data.message &&
        !data.error &&
        (!data.results || data.results.length === 0)
      ) {
        setError(data.message);
      }

      // If there are no results but no error, show a friendly message
      if (data.results && data.results.length === 0 && !data.message) {
        setError(
          `No documents found matching "${searchQuery}". Try a different search term.`
        );
      }
    } catch (error) {
      // Special handling for timeout errors
      if (error instanceof Error && error.name === "AbortError") {
        console.error("Search request timed out");
        setError(
          "Search request timed out. Please try again with a simpler query."
        );
        return;
      }

      console.error("Error searching documents:", error);
      setError(
        error instanceof Error ? error.message : "Failed to search documents"
      );

      // If we had any results previously, keep them
      if (results.length === 0) {
        // Show a fallback message when there's an error
        setError(
          "Sorry, there was an error with the search. Please try again later."
        );
      }
    } finally {
      setIsSearching(false);
      // Clear the abort controller reference
      abortControllerRef.current = null;
    }
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      setError("Please enter a search query");
      return;
    }

    try {
      // Use traditional navigation approach
      const params = new URLSearchParams();
      params.set("q", query);

      // Update URL without navigation
      const newUrl = `/search?${params.toString()}`;
      if (typeof window !== "undefined") {
        window.history.pushState({}, "", newUrl);
      }

      await performSearch(query);
    } catch (searchError) {
      console.error("Search error:", searchError);
      setError(
        "An error occurred while processing your search. Please try again."
      );
    }
  };

  // Don't render anything until the component is mounted
  if (!isMounted) {
    return <SearchLoadingState />;
  }

  return (
    <main className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Semantic Search
        </h1>
        <p className="text-gray-500 mb-6">
          Search across your documents using natural language
        </p>

        <form onSubmit={handleSearch} className="mb-6">
          <div
            className={`flex shadow-md rounded-lg overflow-hidden transition duration-200 bg-white border ${
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
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                placeholder="Search by meaning, not just keywords... (⌘K)"
                className="flex-1 py-3 pl-12 pr-4 w-full bg-transparent focus:outline-none text-gray-700"
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
              type="submit"
              disabled={isSearching}
              className={`py-3 px-6 font-medium text-white transition-colors flex items-center ${
                isSearching
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSearching ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Searching...
                </>
              ) : (
                <>
                  Search
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
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mt-4 flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}
        </form>

        {/* Search Tips */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-start">
            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-blue-800 font-medium">Pro Tip:</p>
              <p className="text-sm text-blue-700">
                Try using natural language questions like &quot;What is the main
                point of the document?&quot; or &quot;Find information about
                marketing strategies&quot;
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Answer Section */}
      {aiAnswer && (
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm p-6 mb-8 border border-blue-200">
          <div className="flex items-start">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a6 6 0 0 0-6 6c0 1.5 0 3 1 4l-2 5h14l-2-5c1-1 1-2.5 1-4a6 6 0 0 0-6-6z"></path>
                <path d="M12 16v3"></path>
                <path d="M8 19h8"></path>
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                AI Answer
              </h2>
              <div className="prose max-w-none text-gray-700">{aiAnswer}</div>
              <p className="text-sm text-gray-500 mt-3">
                Answer generated based on your documents. This is an
                AI-generated response and may not be 100% accurate.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {results.length > 0 ? (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Search Results
            {results.length > 0 && (
              <span className="text-gray-500 font-normal">
                {" "}
                ({results.length} found)
              </span>
            )}
          </h2>
          <div className="space-y-8">
            {results.map((result) => (
              <div
                key={result.id}
                className="bg-white p-5 rounded-xl shadow-sm transition duration-200 hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {result.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3">{result.fileName}</p>

                {/* Show snippet */}
                <p className="text-gray-700 text-sm mb-3">{result.snippet}</p>

                {/* Display highlights if available */}
                {result.highlights && result.highlights.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Relevant Excerpts:
                    </h4>
                    <div className="space-y-2">
                      {result.highlights.map((highlight, idx) => (
                        <div
                          key={idx}
                          className="bg-yellow-50 border-l-2 border-yellow-300 p-3 rounded text-sm text-gray-700"
                        >
                          {highlight}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Relevance: {Math.round(result.score * 100)}%
                  </div>
                  <div className="flex items-center space-x-3 mt-4">
                    <Link
                      href={`/documents/${result.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
                    >
                      <span>View Details</span>
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
                    </Link>
                    <DownloadButton documentId={result.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : query && !isSearching ? (
        <div className="bg-white text-center py-16 rounded-xl shadow-sm mb-8">
          <div className="max-w-md mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-gray-600 mb-6">
              Try a different search query or upload more documents
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
              Upload New Document
            </Link>
          </div>
        </div>
      ) : null}

      {/* Search Tips Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Search Tips
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex">
            <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-900">
                Ask Questions
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Use natural language questions like &quot;What is the main point
                of the document?&quot;
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-900">
                Search Concepts
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Look for concepts and ideas, not just specific keywords
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-900">
                Try Different Phrasings
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Experiment with different ways of asking if you don&apos;t get
                the results you expect
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-900">
                AI-Powered Search
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Our search is powered by AI and understands the meaning behind
                your query
              </p>
            </div>
          </div>
          <div className="flex md:col-span-2">
            <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-900">
                Keyboard Shortcuts
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Use{" "}
                <span className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs">
                  ⌘K
                </span>{" "}
                or{" "}
                <span className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs">
                  Ctrl+K
                </span>{" "}
                to quickly focus the search bar from anywhere on the page. You
                can also press{" "}
                <span className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs">
                  /
                </span>{" "}
                when not in a text field.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Loading state component
function SearchLoadingState() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <div className="h-12 w-full max-w-4xl bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
      <div className="space-y-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6">
            <div className="h-6 bg-gray-200 w-1/3 rounded mb-4 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
