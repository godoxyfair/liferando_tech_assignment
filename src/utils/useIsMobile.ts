import { useState, useEffect } from 'react'

// matches --mobile custom-media in src/ui/variables.css (Pie's --dt-breakpoint-md)
const MOBILE_BREAKPOINT_PX = 768

export function useIsMobile(breakpoint = MOBILE_BREAKPOINT_PX): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.innerWidth <= breakpoint
  })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`)
    const handler = (event: MediaQueryListEvent) => setIsMobile(event.matches)

    mediaQuery.addEventListener('change', handler)

    return () => mediaQuery.removeEventListener('change', handler)
  }, [breakpoint])

  return isMobile
}
