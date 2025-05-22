interface OptimizedBackgroundProps {
  className?: string
  mobileImage: {
    webp: string
    fallback: string
  }
  tabletImage: {
    webp: string
    fallback: string
  }
  desktopImage: {
    webp: string
    fallback: string
  }
}

export default function OptimizedBackground({
  className = '',
  mobileImage,
  tabletImage,
  desktopImage,
}: OptimizedBackgroundProps) {
  return (
    <picture className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}>
      {/* Desktop Image */}
      <source media="(min-width: 1024px)" srcSet={desktopImage.webp} type="image/webp" />
      <source media="(min-width: 1024px)" srcSet={desktopImage.fallback} type="image/jpeg" />

      {/* Tablet Image */}
      <source media="(min-width: 768px)" srcSet={tabletImage.webp} type="image/webp" />
      <source media="(min-width: 768px)" srcSet={tabletImage.fallback} type="image/jpeg" />

      {/* Mobile Image (default) */}
      <source srcSet={mobileImage.webp} type="image/webp" />

      {/* Fallback image (usually mobile size) */}
      <img
        src={mobileImage.fallback}
        alt=""
        className="h-full w-full object-cover"
        aria-hidden="true"
        loading="eager"
        decoding="async"
        style={{ maxWidth: '100%', objectFit: 'cover' }}
      />
    </picture>
  )
}
