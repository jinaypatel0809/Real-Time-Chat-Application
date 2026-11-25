export default function ChatLogo() {
  return (
    <div className="flex flex-col items-center">
      <svg
        width="88"
        height="72"
        viewBox="0 0 88 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="ChatApp Logo"
      >
        {/* Back Blue Bubble */}
        <path
          d="M12 36C12 24.9543 21.8497 16 34 16C46.1503 16 56 24.9543 56 36C56 47.0457 46.1503 56 34 56C30.4 56 27.01 55.22 23.98 53.83L13.5 57.5L16.4 48.1C13.64 44.74 12 40.55 12 36Z"
          fill="#4A8DF6"
        />
        {/* Front Purple Bubble */}
        <path
          d="M32 31C32 18.8497 42.3007 9 55 9C67.6993 9 78 18.8497 78 31C78 43.1503 67.6993 53 55 53C51.1 53 47.43 52.09 44.18 50.47L33 54.5L36.1 44.4C33.52 40.66 32 36.02 32 31Z"
          fill="#6C3CE9"
        />
        {/* Three Dots */}
        <circle cx="46.5" cy="31" r="2.6" fill="#FFFFFF" />
        <circle cx="55" cy="31" r="2.6" fill="#FFFFFF" />
        <circle cx="63.5" cy="31" r="2.6" fill="#FFFFFF" />
        {/* Top-right Spark Lines */}
        <line
          x1="73"
          y1="10"
          x2="78"
          y2="5"
          stroke="#7B52F4"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <line
          x1="79"
          y1="16"
          x2="85"
          y2="13"
          stroke="#7B52F4"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
      </svg>

      <h1 className="mt-2 text-[34px] font-extrabold tracking-tight leading-none text-[#111222]">
        Chat<span className="text-[#6C3CE9]">App</span>
      </h1>
      <p className="mt-1.5 text-[13px] font-medium text-[#6B6E88]">
        Connect &bull; Chat &bull; Share
      </p>
    </div>
  )
}