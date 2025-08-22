"use client"

import { useState, useEffect } from "react"

export function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timerId)
  }, [])

  const seconds = time.getSeconds()
  const minutes = time.getMinutes()
  const hours = time.getHours()

  const secondDegrees = (seconds / 60) * 360
  const minuteDegrees = (minutes / 60) * 360 + (seconds / 60) * 6
  const hourDegrees = (hours / 12) * 360 + (minutes / 60) * 30

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="w-40 h-40 rounded-full border-2 border-gray-200 dark:border-gray-700 relative flex items-center justify-center">
        {/* Hour Hand */}
        <div
          style={{ transform: `translate(-50%, -100%) rotate(${hourDegrees}deg)` }}
          className="w-1 h-10 bg-black dark:bg-white absolute top-1/2 left-1/2 origin-bottom"
        />
        {/* Minute Hand */}
        <div
          style={{ transform: `translate(-50%, -100%) rotate(${minuteDegrees}deg)` }}
          className="w-0.5 h-14 bg-black dark:bg-white absolute top-1/2 left-1/2 origin-bottom"
        />
        {/* Second Hand */}
        <div
          style={{ transform: `translate(-50%, -100%) rotate(${secondDegrees}deg)` }}
          className="w-0.5 h-16 bg-red-500 absolute top-1/2 left-1/2 origin-bottom"
        />
        <div className="w-2 h-2 rounded-full bg-black dark:bg-white absolute" />
        {[...Array(12)].map((_, i) => {
          const angle = (i + 1) * 30
          const x = 50 + 42 * Math.cos((angle - 90) * (Math.PI / 180))
          const y = 50 + 42 * Math.sin((angle - 90) * (Math.PI / 180))
          return (
            <div
              key={i}
              className="absolute text-sm font-medium"
              style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
            >
              {i + 1}
            </div>
          )
        })}
      </div>
      <div className="text-center">
        <p className="font-mono text-lg font-semibold">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </div>
  )
}
