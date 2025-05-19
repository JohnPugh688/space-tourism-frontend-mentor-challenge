interface OptimizedImageProps {
  webpSrc: string
  fallbackSrc: string
  alt: string
  className?: string
  // If true, loads image immediately. Use for above-the-fold images
  priority?: boolean
  // Optional width and height for better CLS handling
  width?: number
  height?: number
  // Error handling
  onError?: () => void
}

export default function OptimizedImage({
  webpSrc,
  fallbackSrc,
  alt,
  className = '',
  priority = false,
  width,
  height,
  onError,
}: OptimizedImageProps) {
  return (
    <picture className={className}>
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={fallbackSrc}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        width={width}
        height={height}
        onError={onError}
      />
    </picture>
  )
}
