import { useState } from 'react'

export function useNavigation<T>(items: T[], initialIndex = 0) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  return {
    currentItem: items[currentIndex],
    currentIndex,
    setIndex: setCurrentIndex,
    next: () => setCurrentIndex((i) => (i + 1) % items.length),
    prev: () => setCurrentIndex((i) => (i - 1 + items.length) % items.length),
    hasNext: currentIndex < items.length - 1,
    hasPrev: currentIndex > 0,
  }
}
