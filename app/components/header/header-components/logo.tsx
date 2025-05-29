import { Link } from 'react-router';

export default function Logo() {
  return (
    <Link to="/" prefetch="intent" aria-label="Navigate to home page">
      <div className="md:size-12 size-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="24" fill="white" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M24 0C24 0 24 24 0 24C23.5776 24.1714 24 48 24 48C24 48 24 24 48 24C24 24 24 0 24 0Z"
            fill="#0B0D17"
          />
        </svg>
      </div>
    </Link>
  )
}
