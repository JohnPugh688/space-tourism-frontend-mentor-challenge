interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
}

export default function OptimizedImage({ src, alt, className = '', priority = false }: OptimizedImageProps) {
  return <img src={src} alt={alt} className={className} loading={priority ? 'eager' : 'lazy'} decoding="async" />
}
