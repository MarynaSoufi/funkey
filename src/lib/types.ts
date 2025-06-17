export type Activity = {
  id: number
  title: string
  description: string
  media?: Media[]
}

export type Media = {
  id: number
  title: string
  link: string
}
export type Category = {
  id: number
  title: string
  description?: string
  media?: Media[]
  activity?: Activity[]
}
