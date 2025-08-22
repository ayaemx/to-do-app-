"use client"

import { motion } from "framer-motion"
import { Users, Award, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AvatarGroupDemo } from "@/components/ui/avatar-group-demo"

export function CommunitySection() {
  const achievements = [
    {
      title: "Top Contributors",
      description: "Community members who share valuable insights",
      count: "50+",
      icon: Award,
    },
    {
      title: "Success Stories",
      description: "Students who achieved their medical goals",
      count: "1000+",
      icon: Target,
    },
    {
      title: "Active Members",
      description: "Engaged community members sharing knowledge",
      count: "5000+",
      icon: Users,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Users className="h-6 w-6 text-green-600" />
            Our Amazing Community
          </CardTitle>
          <p className="text-muted-foreground">
            Join thousands of medical students and professionals sharing their journey
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Top Contributors</h3>
                <AvatarGroupDemo />
                <p className="text-sm text-muted-foreground mt-2">
                  These amazing community members have shared their knowledge and helped others succeed
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-background/50"
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    <achievement.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{achievement.title}</h4>
                      <Badge variant="secondary">{achievement.count}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
