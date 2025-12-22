"use client";

import Link from "next/link";
import "./globals.css";

export default function NotFound() {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              {/* Large 404 with gradient */}
              <div className="mb-6">
                <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  404
                </h1>
              </div>

              {/* Icon */}
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full">
                  <svg
                    className="w-12 h-12 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Message */}
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Oops! Page not found</h2>
              <p className="text-gray-600 mb-8 text-lg">
                The page you are looking for might have been removed, had its name changed, or is
                temporarily unavailable.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Return to Home
                </Link>
                <button
                  onClick={() => window.history.back()}
                  className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
