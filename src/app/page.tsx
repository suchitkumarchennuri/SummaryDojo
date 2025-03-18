"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import GoogleGeminiEffectDemo from "../../components/ui/google-gemini-effect-demo";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (!mounted) return null;

  return (
    <main className="flex min-h-screen flex-col bg-dark-bg text-dark-text">
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gradient-start/10 via-gradient-mid/5 to-transparent z-0"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_50%)] z-0"></div>

        {/* Gemini Effect - Full Width */}
        <div className="absolute inset-0 z-10">
          <GoogleGeminiEffectDemo />
        </div>

        {/* Content Overlay */}
        <div className="relative z-20 h-full flex flex-col items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28 w-full">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center text-center"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-4"
              >
                <div className="relative h-24 w-24 mb-2 mx-auto">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gradient-start via-gradient-mid to-gradient-end opacity-20 blur-xl"></div>
                  <div className="relative h-full w-full rounded-full bg-dark-surface border border-dark-border flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-12 h-12 text-gradient-mid"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gradient-start via-gradient-mid to-gradient-end animate-gradient bg-[length:200%_auto]"
              >
                SummaryDojo
              </motion.h1>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-xl sm:text-2xl md:text-3xl mb-6 font-light leading-snug text-dark-text/80 max-w-3xl"
              >
                AI-Powered Document Analysis & Search Engine
              </motion.h2>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-base sm:text-lg md:text-xl mb-10 text-dark-muted max-w-2xl"
              >
                Upload your PDFs and documents, and let our AI extract insights,
                generate summaries, and enable semantic search across your
                content.
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href="/sign-up"
                  className="relative group overflow-hidden rounded-full px-8 py-3 bg-gradient-to-r from-gradient-start via-gradient-mid to-gradient-end"
                >
                  <span className="relative z-10 text-white font-medium text-lg">
                    Get Started Free
                  </span>
                  <motion.span
                    initial={{ x: "100%" }}
                    whileHover={{ x: "-100%" }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-shine z-0"
                  />
                </Link>

                <Link
                  href="/sign-in"
                  className="px-8 py-3 rounded-full bg-dark-surface border border-dark-border text-dark-text font-medium text-lg hover:bg-dark-card/50 transition-colors"
                >
                  Sign In
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(157,107,221,0.15),transparent_50%)]"></div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          <motion.h2
            variants={fadeIn}
            className="text-3xl sm:text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-gradient-start via-gradient-mid to-gradient-end"
          >
            Powerful Features
          </motion.h2>

          <motion.div
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div
              variants={fadeIn}
              className="group relative p-8 rounded-2xl bg-dark-card border border-dark-border overflow-hidden hover:border-gradient-mid/50 transition-colors duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-gradient-start/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="w-16 h-16 mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gradient-start to-gradient-mid rounded-2xl opacity-20 blur group-hover:opacity-30 transition-opacity"></div>
                <div className="relative h-full w-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-8 h-8 text-gradient-start"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                    />
                  </svg>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-gradient-start transition-colors">
                AI-Powered Analysis
              </h3>

              <p className="text-dark-muted leading-relaxed group-hover:text-dark-text/80 transition-colors">
                Extract text, generate summaries, and identify key insights from
                your documents automatically with advanced AI technology.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="group relative p-8 rounded-2xl bg-dark-card border border-dark-border overflow-hidden hover:border-gradient-mid/50 transition-colors duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-gradient-mid/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="w-16 h-16 mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gradient-mid to-gradient-end rounded-2xl opacity-20 blur group-hover:opacity-30 transition-opacity"></div>
                <div className="relative h-full w-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-8 h-8 text-gradient-mid"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-gradient-mid transition-colors">
                Semantic Search
              </h3>

              <p className="text-dark-muted leading-relaxed group-hover:text-dark-text/80 transition-colors">
                Find information based on meaning, not just keywords, for more
                accurate and relevant results across all your documents.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="group relative p-8 rounded-2xl bg-dark-card border border-dark-border overflow-hidden hover:border-gradient-end/50 transition-colors duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-gradient-end/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="w-16 h-16 mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gradient-end to-gradient-start rounded-2xl opacity-20 blur group-hover:opacity-30 transition-opacity"></div>
                <div className="relative h-full w-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-8 h-8 text-gradient-end"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-gradient-end transition-colors">
                Secure Storage
              </h3>

              <p className="text-dark-muted leading-relaxed group-hover:text-dark-text/80 transition-colors">
                Your documents are securely stored and accessible only to you,
                with enterprise-grade security and data protection.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="relative py-10 sm:py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-dark-card to-dark-bg"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15),transparent_50%)]"></div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerChildren}
          className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10"
        >
          <motion.div variants={fadeIn} className="mb-4">
            <span className="inline-block px-3 py-1 bg-gradient-to-r from-gradient-start/10 via-gradient-mid/10 to-gradient-end/10 rounded-full text-xs sm:text-sm text-gradient-mid font-medium border border-gradient-mid/20">
              Ready to get started?
            </span>
          </motion.div>

          <motion.h2
            variants={fadeIn}
            className="text-2xl sm:text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-gradient-start via-gradient-mid to-gradient-end"
          >
            Transform your document workflow
          </motion.h2>

          <motion.p
            variants={fadeIn}
            className="text-base mb-6 text-dark-muted max-w-2xl mx-auto"
          >
            Start organizing, analyzing, and extracting insights from your
            documents today. No credit card required.
          </motion.p>

          <motion.div variants={fadeIn}>
            <Link
              href="/sign-up"
              className="relative group overflow-hidden inline-block rounded-full px-6 py-2.5 bg-gradient-to-r from-gradient-start via-gradient-mid to-gradient-end"
            >
              <span className="relative z-10 text-white font-medium">
                Get Started Free
              </span>
              <motion.span
                initial={{ x: "100%" }}
                whileHover={{ x: "-100%" }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-shine z-0"
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
