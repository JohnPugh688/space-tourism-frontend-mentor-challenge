// app/utils/data.server.ts
import { supabase, checkSupabaseConnection } from './supabase'
import type { Destination } from '~/types/destination'
import type { CrewMember } from '~/types/crew'
import type { Technology } from '~/types/technology'

// Set max duration for Vercel Function to 30 seconds (default is 10s)
export const maxDuration = 30

interface DestinationRow {
  name: string
  description: string
  distance: string
  travel: string
  image_png: string
  image_webp: string
}

interface CrewRow {
  name: string
  role: string
  bio: string
  image_png: string
  image_webp: string
}

interface TechnologyRow {
  name: string
  description: string
  image_portrait: string
  image_landscape: string
  image_portrait_webp: string
  image_landscape_webp: string
}

const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

// Use fallback only if explicitly set to true
const FORCE_FALLBACK = false

export async function getDestinations() {
  // If we're forcing fallback data in production, return it immediately
  if (FORCE_FALLBACK) {
    console.log('Using fallback destinations data')
    return getFallbackDestinations()
  }

  try {
    // First, check connection
    console.log('Checking Supabase connection...')
    const connectionCheck = await checkSupabaseConnection()
    if (!connectionCheck.ok) {
      console.error('Connection check failed:', connectionCheck.error)
      return getFallbackDestinations()
    }

    console.log('Connection check succeeded, latency:', connectionCheck.latency, 'ms')

    let retries = MAX_RETRIES

    while (retries >= 0) {
      try {
        console.log('Attempting to fetch destinations from Supabase...')
        console.log('Environment:', process.env.NODE_ENV)
        console.log('Supabase URL exists:', !!process.env.SUPABASE_URL)
        console.log('Retry attempt:', MAX_RETRIES - retries)

        const { data, error } = await supabase.from('destinations').select('*')

        if (error) {
          console.error('Supabase error:', error)
          throw error
        }

        if (!data || data.length === 0) {
          console.warn('No destinations found in Supabase')
          return getFallbackDestinations()
        }

        console.log('Successfully fetched destinations count:', data.length)

        return data.map((item: DestinationRow) => ({
          name: item.name,
          description: item.description,
          distance: item.distance,
          travel: item.travel,
          images: {
            png: item.image_png || '',
            webp: item.image_webp || '',
          },
        })) as Destination[]
      } catch (error) {
        console.error(`Error fetching destinations (${MAX_RETRIES - retries} retry):`, error)
        if (retries > 0) {
          console.log(`Retrying in ${RETRY_DELAY}ms... ${retries} attempts remaining`)
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
          retries--
          continue
        }
        console.error('Fatal error fetching destinations after all retries', error)
        return getFallbackDestinations()
      }
    }

    console.warn('Reached end of retry loop without success, using fallback data')
    return getFallbackDestinations()
  } catch (error) {
    console.error('Unexpected error in getDestinations:', error)
    return getFallbackDestinations()
  }
}

export async function getCrewMembers() {
  // If we're forcing fallback data in production, return it immediately
  if (FORCE_FALLBACK) {
    console.log('Using fallback crew data')
    return getFallbackCrew()
  }

  try {
    console.log('Fetching crew members')
    const { data, error } = await supabase.from('crew_members').select('*')

    if (error) {
      console.error('Error fetching crew members:', error)
      return getFallbackCrew()
    }

    if (!data || data.length === 0) {
      console.warn('No crew members found')
      return getFallbackCrew()
    }

    console.log('Successfully fetched crew members count:', data.length)
    return data.map((item: CrewRow) => ({
      name: item.name,
      role: item.role,
      bio: item.bio,
      images: {
        png: item.image_png || '',
        webp: item.image_webp || '',
      },
    })) as CrewMember[]
  } catch (error) {
    console.error('Fatal error fetching crew members:', error)
    return getFallbackCrew()
  }
}

export async function getTechnologies() {
  // If we're forcing fallback data in production, return it immediately
  if (FORCE_FALLBACK) {
    console.log('Using fallback technology data')
    return getFallbackTechnologies()
  }

  try {
    console.log('Fetching technologies')
    const { data, error } = await supabase.from('technologies').select('*')

    if (error) {
      console.error('Error fetching technologies:', error)
      return getFallbackTechnologies()
    }

    if (!data || data.length === 0) {
      console.warn('No technologies found')
      return getFallbackTechnologies()
    }

    console.log('Successfully fetched technologies count:', data.length)
    return data.map((item: TechnologyRow) => ({
      name: item.name,
      description: item.description,
      images: {
        portrait: item.image_portrait || '',
        landscape: item.image_landscape || '',
        portraitWebp: item.image_portrait_webp || '',
        landscapeWebp: item.image_landscape_webp || '',
      },
    })) as Technology[]
  } catch (error) {
    console.error('Fatal error fetching technologies:', error)
    return getFallbackTechnologies()
  }
}

// Fallback static data if Supabase fails
function getFallbackDestinations(): Destination[] {
  return [
    {
      name: 'MOON',
      images: {
        png: '/destination/image-moon.png',
        webp: '/destination/image-moon.webp',
      },
      description:
        "See our planet as you've never seen it before. A perfect relaxing trip away to help regain perspective and come back refreshed. While you're there, take in some history by visiting the Luna 2 and Apollo 11 landing sites.",
      distance: '384,400 KM',
      travel: '3 DAYS',
    },
    {
      name: 'MARS',
      images: {
        png: '/destination/image-mars.png',
        webp: '/destination/image-mars.webp',
      },
      description:
        "Don't forget to pack your hiking boots. You'll need them to tackle Olympus Mons, the tallest planetary mountain in our solar system. It's two and a half times the size of Everest!",
      distance: '225 MIL. KM',
      travel: '9 MONTHS',
    },
    {
      name: 'EUROPA',
      images: {
        png: '/destination/image-europa.png',
        webp: '/destination/image-europa.webp',
      },
      description:
        "The smallest of the four Galilean moons orbiting Jupiter, Europa is a winter lover's dream. With an icy surface, it's perfect for a bit of ice skating, curling, hockey, or simple relaxation in your snug wintery cabin.",
      distance: '628 MIL. KM',
      travel: '3 YEARS',
    },
    {
      name: 'TITAN',
      images: {
        png: '/destination/image-titan.png',
        webp: '/destination/image-titan.webp',
      },
      description:
        'The only moon known to have a dense atmosphere other than Earth, Titan is a home away from home (just a few hundred degrees colder!). As a bonus, you get striking views of the Rings of Saturn.',
      distance: '1.6 BIL. KM',
      travel: '7 YEARS',
    },
  ]
}

function getFallbackCrew(): CrewMember[] {
  return [
    {
      name: 'Douglas Hurley',
      images: {
        png: '/crew/image-douglas-hurley.png',
        webp: '/crew/image-douglas-hurley.webp',
      },
      role: 'Commander',
      bio: 'Douglas Gerald Hurley is an American engineer, former Marine Corps pilot and former NASA astronaut. He launched into space for the third time as commander of Crew Dragon Demo-2.',
    },
    {
      name: 'Mark Shuttleworth',
      images: {
        png: '/crew/image-mark-shuttleworth.png',
        webp: '/crew/image-mark-shuttleworth.webp',
      },
      role: 'Mission Specialist',
      bio: 'Mark Richard Shuttleworth is the founder and CEO of Canonical, the company behind the Linux-based Ubuntu operating system. Shuttleworth became the first South African to travel to space as a space tourist.',
    },
    {
      name: 'Victor Glover',
      images: {
        png: '/crew/image-victor-glover.png',
        webp: '/crew/image-victor-glover.webp',
      },
      role: 'Pilot',
      bio: 'Pilot on the first operational flight of the SpaceX Crew Dragon to the International Space Station. Glover is a commander in the U.S. Navy where he pilots an F/A-18.He was a crew member of Expedition 64, and served as a station systems flight engineer.',
    },
    {
      name: 'Anousheh Ansari',
      images: {
        png: '/crew/image-anousheh-ansari.png',
        webp: '/crew/image-anousheh-ansari.webp',
      },
      role: 'Flight Engineer',
      bio: 'Anousheh Ansari is an Iranian American engineer and co-founder of Prodea Systems. Ansari was the fourth self-funded space tourist, the first self-funded woman to fly to the ISS, and the first Iranian in space.',
    },
  ]
}

function getFallbackTechnologies(): Technology[] {
  return [
    {
      name: 'Launch vehicle',
      images: {
        portrait: '/technology/image-launch-vehicle-portrait.jpg',
        landscape: '/technology/image-launch-vehicle-landscape.jpg',
        portraitWebp: '/technology/image-launch-vehicle-portrait.webp',
        landscapeWebp: '/technology/image-launch-vehicle-landscape.webp',
      },
      description:
        "A launch vehicle or carrier rocket is a rocket-propelled vehicle used to carry a payload from Earth's surface to space, usually to Earth orbit or beyond. Our WEB-X carrier rocket is the most powerful in operation. Standing 150 metres tall, it's quite an awe-inspiring sight on the launch pad!",
    },
    {
      name: 'Spaceport',
      images: {
        portrait: '/technology/image-spaceport-portrait.jpg',
        landscape: '/technology/image-spaceport-landscape.jpg',
        portraitWebp: '/technology/image-spaceport-portrait.webp',
        landscapeWebp: '/technology/image-spaceport-landscape.webp',
      },
      description:
        "A spaceport or cosmodrome is a site for launching (or receiving) spacecraft, by analogy to the seaport for ships or airport for aircraft. Based in the famous Cape Canaveral, our spaceport is ideally situated to take advantage of the Earth's rotation for launch.",
    },
    {
      name: 'Space capsule',
      images: {
        portrait: '/technology/image-space-capsule-portrait.jpg',
        landscape: '/technology/image-space-capsule-landscape.jpg',
        portraitWebp: '/technology/image-space-capsule-portrait.webp',
        landscapeWebp: '/technology/image-space-capsule-landscape.webp',
      },
      description:
        "A space capsule is an often-crewed spacecraft that uses a blunt-body reentry capsule to reenter the Earth's atmosphere without wings. Our capsule is where you'll spend your time during the flight. It includes a space gym, cinema, and plenty of other activities to keep you entertained.",
    },
  ]
}
