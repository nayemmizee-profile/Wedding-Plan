import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-purple-100 px-5 py-16">
      {/* Background Decorations */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-pink-200/40 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-56 h-56 bg-purple-200/50 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* Illustration */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="absolute w-56 h-56 bg-gradient-to-br from-rose-200 to-purple-200 rounded-full blur-2xl opacity-60" />

          <div className="relative text-[110px] sm:text-[150px] leading-none drop-shadow-xl">
            💍
          </div>

          <span className="absolute -top-5 -right-8 text-4xl animate-bounce">
            ✨
          </span>

          <span className="absolute -bottom-2 -left-8 text-3xl">🌸</span>
        </div>

        {/* 404 */}
        <h1 className="text-7xl sm:text-9xl font-black tracking-tighter bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          404
        </h1>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-3">
          Oops! This Wedding Page Is Missing
        </h2>

        <p className="text-gray-500 mt-4 max-w-md mx-auto leading-7">
          Looks like this page didn't make it to the guest list. The page you're
          looking for may have moved or doesn't exist.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-9">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full text-white font-semibold bg-gradient-to-r from-rose-500 to-purple-600 shadow-lg shadow-rose-200 hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            🏠 Back to Home
          </Link>

          <Link
            href="/services"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-rose-200 bg-white/70 text-gray-700 font-semibold hover:bg-rose-50 hover:border-rose-400 transition-all duration-300"
          >
            Explore Services →
          </Link>
        </div>

        <p className="mt-12 text-xs text-gray-400 tracking-wider">
          WEDPLAN © 2026 · MADE WITH LOVE
        </p>
      </div>
    </main>
  );
}
