import { WelcomeHeader } from "@/components/home/welcome-header"
import { Clock } from "@/components/home/clock"
import { UpcomingTasks } from "@/components/home/upcoming-tasks"
import { QuoteCard } from "@/components/home/quote-card"

export default function HomePage() {
  return (
    <div className="p-6">
      <div className="mt-4">
        <WelcomeHeader />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-16">
        <div className="lg:col-span-5 lg:col-start-2 mt-4">
          <UpcomingTasks />
        </div>
        <div className="lg:col-span-5 flex flex-col items-center gap-8 mt-4">
          <Clock />
          <QuoteCard />
        </div>
      </div>
    </div>
  )
}
