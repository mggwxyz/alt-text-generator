interface LogoProps {
  className?: string
}

export function Logo({ className = "w-8 h-8" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle
        cx="32"
        cy="32"
        r="30"
        fill="url(#gradient)"
        stroke="currentColor"
        strokeWidth="2"
      />
      
      {/* Image/picture icon */}
      <rect
        x="12"
        y="18"
        width="40"
        height="28"
        rx="4"
        fill="white"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      
      {/* Mountain/landscape in the image */}
      <path
        d="M16 38 L24 28 L32 34 L40 24 L48 32 V42 H16 V38 Z"
        fill="currentColor"
        fillOpacity="0.3"
      />
      
      {/* Sun in the image */}
      <circle
        cx="42"
        cy="26"
        r="3"
        fill="currentColor"
        fillOpacity="0.4"
      />
      
      {/* Text lines representing alt text */}
      <rect
        x="16"
        y="50"
        width="20"
        height="2"
        rx="1"
        fill="currentColor"
        fillOpacity="0.6"
      />
      <rect
        x="16"
        y="54"
        width="32"
        height="2"
        rx="1"
        fill="currentColor"
        fillOpacity="0.6"
      />
      <rect
        x="16"
        y="58"
        width="16"
        height="2"
        rx="1"
        fill="currentColor"
        fillOpacity="0.6"
      />
      
      {/* Gradient definition */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
    </svg>
  )
}