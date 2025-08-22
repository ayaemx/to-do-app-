"use client"

import { motion } from "framer-motion"

export function QuoteCard() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative p-4">
        <span className="text-6xl text-blue-500 font-bold opacity-10 absolute -top-2 -left-2">“</span>
        <p className="text-lg font-bold z-10 relative italic">
          Get Rich or <span className="text-blue-500">Die Tryin'</span>
        </p>
        <span className="text-6xl text-blue-500 font-bold opacity-10 absolute -bottom-4 -right-2">”</span>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">- 50 CENT</p>
    </motion.div>
  )
}
