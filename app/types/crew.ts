export interface CrewMember {
  role: string
  name: string
  bio: string
  images: {
    png: string
    webp: string
  }
}

export interface CrewData {
  crew: CrewMember[]
}
