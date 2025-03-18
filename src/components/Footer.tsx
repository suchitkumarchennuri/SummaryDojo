"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--dark-surface)",
        borderTop: "1px solid var(--dark-border)",
      }}
      className="py-6"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
          <div className="md:col-span-1">
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-base font-semibold gradient-text mb-2"
            >
              SummaryDojo
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ color: "var(--dark-muted)" }}
              className="text-xs"
            >
              AI-powered document search engine
            </motion.p>
          </div>

          <div>
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ color: "var(--dark-text)" }}
              className="text-xs font-semibold mb-2 uppercase tracking-wider"
            >
              Product
            </motion.h3>
            <motion.ul
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-1"
            >
              <motion.li>
                <Link
                  href="/dashboard"
                  style={{ color: "var(--dark-muted)" }}
                  className="text-xs hover:text-gradient-start transition-colors"
                >
                  Dashboard
                </Link>
              </motion.li>
              <motion.li>
                <Link
                  href="/documents"
                  style={{ color: "var(--dark-muted)" }}
                  className="text-xs hover:text-gradient-mid transition-colors"
                >
                  Documents
                </Link>
              </motion.li>
            </motion.ul>
          </div>

          <div>
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ color: "var(--dark-text)" }}
              className="text-xs font-semibold mb-2 uppercase tracking-wider"
            >
              Company
            </motion.h3>
            <motion.ul
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-1"
            >
              <motion.li>
                <a
                  href="#"
                  style={{ color: "var(--dark-muted)" }}
                  className="text-xs hover:text-gradient-start transition-colors"
                >
                  About
                </a>
              </motion.li>
              <motion.li>
                <a
                  href="#"
                  style={{ color: "var(--dark-muted)" }}
                  className="text-xs hover:text-gradient-mid transition-colors"
                >
                  Privacy
                </a>
              </motion.li>
            </motion.ul>
          </div>

          <div>
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ color: "var(--dark-text)" }}
              className="text-xs font-semibold mb-2 uppercase tracking-wider"
            >
              Connect
            </motion.h3>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex space-x-3"
            >
              <motion.a
                href="https://github.com"
                style={{ color: "var(--dark-muted)" }}
                className="text-xs hover:text-gradient-start transition-colors"
              >
                <span className="sr-only">GitHub</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.a>
              <motion.a
                href="https://twitter.com"
                style={{ color: "var(--dark-muted)" }}
                className="text-xs hover:text-gradient-mid transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </motion.a>
              <motion.a
                href="https://linkedin.com"
                style={{ color: "var(--dark-muted)" }}
                className="text-xs hover:text-gradient-end transition-colors"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </motion.a>
            </motion.div>
          </div>
        </div>

        <div
          style={{ borderTop: "1px solid var(--dark-border)" }}
          className="pt-3 flex flex-col md:flex-row justify-between items-center"
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ color: "var(--dark-muted)" }}
            className="text-xs"
          >
            &copy; {new Date().getFullYear()} SummaryDojo
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ color: "var(--dark-muted)" }}
            className="text-xs mt-2 md:mt-0"
          >
            Made with
            <span className="mx-1 gradient-text">❤️</span>
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
