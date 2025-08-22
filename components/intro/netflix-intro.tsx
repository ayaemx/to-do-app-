"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useApp } from "@/contexts/app-context"
import "./glow.css"

export function NetflixIntro() {
  const { isIntroPlaying, setIntroPlaying } = useApp()


  return (
    <AnimatePresence>
      {isIntroPlaying && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.h1
              initial={{ letterSpacing: "0.5em" }}
              animate={{ letterSpacing: "0.1em" }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-6xl md:text-8xl font-bold text-white mb-4 glow-text"
            >
              COURSOLOGY
            </motion.h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
