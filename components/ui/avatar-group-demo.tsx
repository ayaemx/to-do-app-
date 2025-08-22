import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const AVATARS = [
  {
    src: "/placeholder-user.jpg",
    fallback: "SK",
    tooltip: "Skyleen",
  },
  {
    src: "https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg",
    fallback: "CN",
    tooltip: "Shadcn",
  },
  {
    src: "https://pbs.twimg.com/profile_images/1677042510839857154/Kq4tpySA_400x400.jpg",
    fallback: "AW",
    tooltip: "Adam Wathan",
  },
  {
    src: "https://pbs.twimg.com/profile_images/1783856060249595904/8TfcCN0r_400x400.jpg",
    fallback: "GR",
    tooltip: "Guillermo Rauch",
  },
  {
    src: "https://pbs.twimg.com/profile_images/1534700564810018816/anAuSfkp_400x400.jpg",
    fallback: "JH",
    tooltip: "Jhey",
  },
]

export const AvatarGroupDemo = () => {
  return (
    <div className="flex -space-x-3">
      {AVATARS.map((avatar, index) => (
        <Avatar
          key={index}
          className="size-12 border-3 border-background hover:z-10 transition-transform hover:scale-110"
          title={avatar.tooltip}
        >
          <AvatarImage src={avatar.src || "/placeholder.svg"} />
          <AvatarFallback>{avatar.fallback}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  )
}
