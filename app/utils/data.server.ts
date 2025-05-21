// app/utils/data.server.ts
import { supabase } from './supabase'
import type { Destination } from '~/types/destination'
import type { CrewMember } from '~/types/crew'
import type { Technology } from '~/types/technology'

export async function getDestinations() {
  try {
    const { data, error } = await supabase.from('destinations').select('*')

    if (error) throw error

    // Transform data to match the expected format
    if (data && data.length > 0) {
      return data.map((item) => ({
        name: item.name,
        description: item.description,
        distance: item.distance,
        travel: item.travel,
        images: {
          png: item.image_png || '',
          webp: item.image_webp || '',
        },
      })) as Destination[]
    }

    return [] as Destination[]
  } catch (error) {
    throw error
  }
}

export async function getCrew() {
  try {
    const { data, error } = await supabase.from('crew_members').select('*')

    if (error) throw error

    // Transform data to match the expected format
    if (data && data.length > 0) {
      return data.map((item) => ({
        name: item.name,
        role: item.role,
        bio: item.bio,
        images: {
          png: item.image_png || '',
          webp: item.image_webp || '',
        },
      })) as CrewMember[]
    }

    return [] as CrewMember[]
  } catch (error) {
    throw error
  }
}

export async function getTechnologies() {
  try {
    const { data, error } = await supabase.from('technologies').select('*')

    if (error) throw error

    // Transform data to match the expected format
    if (data && data.length > 0) {
      return data.map((item) => ({
        name: item.name,
        description: item.description,
        images: {
          portrait: item.image_portrait || '',
          landscape: item.image_landscape || '',
          portraitWebp: item.image_portrait_webp || '',
          landscapeWebp: item.image_landscape_webp || '',
        },
      })) as Technology[]
    }

    return [] as Technology[]
  } catch (error) {
    throw error
  }
}
