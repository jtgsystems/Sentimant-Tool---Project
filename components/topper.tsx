import type React from "react"

/**
 * Topper component styled to match the minimalist aesthetic of johngallie.com.
 * Colours follow the JTG brand palette (#2c3e50 primary, #34495e accent, #fafafa text).
 * Uses Roboto font (inherited globally) and Tailwind utilities.
 */
const Topper: React.FC = () => (
  <header className="mx-auto mt-4 flex w-full max-w-5xl flex-col items-center justify-between gap-3 rounded-xl bg-gradient-to-r from-[#2c3e50] to-[#34495e] px-6 py-4 text-[#fafafa] shadow-md sm:flex-row">
    {/* Main title with subtle emoji */}
    <h1 className="flex items-center gap-2 text-center text-lg font-bold tracking-wide sm:text-xl">
      <span className="text-2xl leading-none">💬</span>
      CONVERSATION&nbsp;SENTIMENT&nbsp;ANALYZER
    </h1>

    {/* Author + website link */}
    <div className="flex flex-col items-center gap-0 text-sm sm:flex-row sm:gap-2">
      <span>John&nbsp;Gallie • JTG&nbsp;Systems</span>
      <span className="hidden sm:inline">|</span>
      <a
        href="https://www.jtgsystems.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 font-medium underline-offset-4 hover:underline"
      >
        <span className="text-base">🌐</span> jtgsystems.com
      </a>
    </div>
  </header>
)

export default Topper
