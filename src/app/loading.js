export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 via-white to-purple-50 px-4">
      {/* Animated Logo */}
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center shadow-xl shadow-rose-200 animate-pulse">
          <span className="text-4xl text-white">💍</span>
        </div>

        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-pink-200 animate-ping opacity-75" />
      </div>

      {/* Brand */}
      <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
        WedPlan
      </h1>

      <p className="mt-3 text-gray-500 text-sm text-center">
        Making your dream wedding come true...
      </p>

      {/* Loading Animation */}
      <div className="flex items-center gap-2 mt-8">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-bounce" />
        <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-bounce [animation-delay:150ms]" />
        <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-bounce [animation-delay:300ms]" />
      </div>

      <p className="mt-6 text-xs tracking-widest uppercase text-gray-400">
        Please wait a moment
      </p>
    </div>
  );
}
