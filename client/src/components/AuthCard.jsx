import { Link } from 'react-router-dom'
import ChatLogo from './ChatLogo'

export function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.22v3.09C3.19 21.3 7.28 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.22C.44 8.17 0 10.02 0 12s.44 3.83 1.22 5.38l4.05-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.28 0 3.19 2.7 1.22 6.62l4.05 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
      />
    </svg>
  )
}

export function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#111222" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
      />
    </svg>
  )
}

export default function AuthCard({
  title,
  subtitle,
  dividerText,
  footerText,
  footerLinkText,
  footerLinkTo,
  blobPosition = 'top-left',
  onGoogleClick,
  onGitHubClick,
  children,
}) {
  return (
    <div className="min-h-screen w-full bg-[#eef0ff] flex items-center justify-center p-4">
      <div className="relative w-full max-w-[410px] rounded-[28px] bg-white px-7 pt-8 pb-7 shadow-[0_20px_50px_rgba(76,58,180,0.12)] overflow-hidden">
        {/* Decorative Corner Blob */}
        {blobPosition === 'top-left' ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-12 -left-12 h-36 w-36 rounded-br-[80px] bg-gradient-to-br from-[#8c6df7] via-[#a792fa] to-[#dcd3fe]/60 opacity-85"
          />
        ) : (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-12 -right-12 h-36 w-36 rounded-tl-[80px] bg-gradient-to-tl from-[#7c5cf5] via-[#a690fa] to-[#dcd3fe]/60 opacity-85"
          />
        )}

        <div className="relative z-10">
          <ChatLogo />

          {/* Heading */}
          <div className="mt-5 text-center">
            <h2 className="text-[22px] font-bold tracking-tight text-[#111222]">
              {title}
            </h2>
            <p className="mt-1 text-[13px] text-[#7A7D96]">{subtitle}</p>
          </div>

          {/* Form Body */}
          <div className="mt-5">{children}</div>

          {/* Divider */}
          <div className="mt-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#E5E7F0]" />
            <span className="text-[12px] text-[#7A7D96]">{dividerText}</span>
            <div className="h-px flex-1 bg-[#E5E7F0]" />
          </div>

          {/* OAuth Buttons */}
          <div className="mt-4 space-y-2.5">
            <button
              type="button"
              onClick={onGoogleClick}
              className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-[#DCE0EC] bg-white px-4 text-[13.5px] font-medium text-[#1D1F33] transition hover:bg-[#F8F9FD] active:scale-[0.99] cursor-pointer"
            >
              <GoogleIcon />
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={onGitHubClick}
              className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-[#DCE0EC] bg-white px-4 text-[13.5px] font-medium text-[#1D1F33] transition hover:bg-[#F8F9FD] active:scale-[0.99] cursor-pointer"
            >
              <GitHubIcon />
              <span>Continue with GitHub</span>
            </button>
          </div>

          {/* Bottom Switch Link */}
          <p className="mt-5 text-center text-[13px] text-[#5F627A]">
            {footerText}{' '}
            <Link
              to={footerLinkTo}
              className="inline-flex items-center gap-1 font-semibold text-[#6C3CE9] hover:underline"
            >
              <span>{footerLinkText}</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}