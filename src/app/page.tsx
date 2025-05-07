import Button from "@/components/Button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-green-900 via-black to-green-800 text-white">
      {/* Logo and Title */}
      <div className="flex items-center gap-4 mb-6 animate-fade-in">

        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-wide text-green-400 drop-shadow-md">
          Anchatty
        </h1>
      </div>

      <p className="text-lg sm:text-xl text-white mb-10 animate-slide-up text-center max-w-xl">
        The Future of Chat. In Your Hands.
      </p>

      <Button
        as={Link}
        href="/chat"
        className="px-6 py-3 rounded-full bg-green-500 hover:bg-green-400 text-black font-semibold text-lg shadow-xl hover:shadow-green-500/50 transition-all duration-300 animate-glow"
      >
        Start chatting
      </Button>

      {/* Animated geometric background shapes */}
      <div className="absolute inset-0 -z-10 opacity-10 pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="triangles"
              x="0"
              y="0"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 0 10 L 5 0 L 10 10 Z"
                fill="none"
                stroke="limegreen"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#triangles)" />
        </svg>
      </div>
    </div>
  );
}
