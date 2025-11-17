import { useRef } from "react"

export default function Newsletter() {
  return (
    <div className="max-w-screen-xl mx-auto p-4 space-y-8">
      {/* Newsletter Section */}
      <div className="bg-purple-800 rounded-lg p-8 text-white shadow-lg transition-transform transform hover:scale-105">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-2 sm:w-1/2">
            <h2 className="text-4xl font-extrabold text-center sm:text-left">Join Our Newsletter</h2>
            <p className="text-purple-200 text-center sm:text-left whitespace-nowrap">
              Get recommendations, tips, updates, promotions, and more.
            </p>
          </div>
          <div className="flex w-full sm:w-auto gap-2">
            <input
              type="email"
              placeholder="Your email address..."
              className="flex-1 rounded-full px-4 py-3 text-purple-900 placeholder:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-200 ease-in-out"
            />
            <button className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-full font-semibold transition-colors duration-200 ease-in-out shadow-md hover:shadow-lg">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
