"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ExternalLink, BookOpen } from "lucide-react"

export function CoursologyBanner(props: { className?: string }) {
  const testNames = ["USMLE Step 1", "USMLE Step 2", "COMLEX", "MCAT", "NCLEX", "PANCE", "PANRE", "OAT", "DAT", "PCAT"]

  const [currentTestIndex, setCurrentTestIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestIndex((prev) => (prev + 1) % testNames.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [testNames.length])

  const handleRedirect = () => {
    window.open("http://landing.coursology-qbank.com/", "_blank")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white py-1 px-4 ${props.className || ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
         
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">COURSOLOGY QBANK</span>
            <span className="text-blue-100">•</span>
            <motion.span
              key={currentTestIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="font-medium"
            >
              {testNames[currentTestIndex]}
            </motion.span>
            <span className="text-blue-100">Ready</span>
          </div>
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleRedirect}
          className="bg-white/90 text-blue-600 hover:bg-white font-medium text-xs px-3 py-1 h-7 rounded-full"
        >
          Explore QBank
          <ExternalLink className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </motion.div>
  )
}
