"use client"

import { useEffect, useState } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }

    // Initial check
    checkDevice()

    // Add event listener
    window.addEventListener("resize", checkDevice)

    // Clean up
    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  return { isMobile, isTablet }
}

