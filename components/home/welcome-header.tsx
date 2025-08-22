"use client"

export function WelcomeHeader() {
  return (
    <div className="text-center">
      <h1 className="text-6xl font-extrabold tracking-tight">
        Welcome to <span className="font-serif text-blue-600 dark:text-blue-400">Coursology</span>
      </h1>
      <p className="mt-4 text-base text-gray-500 dark:text-gray-400">
        Your ultimate productivity companion for managing tasks and achieving your goals
      </p>
    </div>
  )
}
