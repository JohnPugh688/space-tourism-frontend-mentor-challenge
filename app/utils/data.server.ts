// app/utils/data.server.ts
import { supabase } from './supabase'
import type { Destination } from '~/types/destination'
import type { CrewMember } from '~/types/crew'
import type { Technology } from '~/types/technology'
import type { PostgrestResponse } from '@supabase/supabase-js'
import type { PostgrestFilterBuilder } from '@supabase/postgrest-js'

// Utility function to handle Supabase queries with timeout
async function queryWithTimeout<T>(
  query: PostgrestFilterBuilder<any, any, T[], any, unknown>,
  timeoutMs = 5000,
): Promise<PostgrestResponse<T>> {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Database query timeout')), timeoutMs),
  )
  return Promise.race([query, timeoutPromise]) as Promise<PostgrestResponse<T>>
}

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

export async function getDestinations() {
  try {
    const { data, error } = await queryWithTimeout<DestinationRow>(supabase.from('destinations').select('*'))

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    if (!data || data.length === 0) {
      console.warn('No destinations found')
      return [] as Destination[]
    }

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
    console.error('Error fetching destinations:', error)
    throw new Error('Failed to fetch destinations')
  }
}

export async function getCrew() {
  try {
    const { data, error } = await queryWithTimeout<CrewRow>(supabase.from('crew_members').select('*'))

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    if (!data || data.length === 0) {
      console.warn('No crew members found')
      return [] as CrewMember[]
    }

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
    console.error('Error fetching crew:', error)
    throw new Error('Failed to fetch crew members')
  }
}

export async function getTechnologies() {
  try {
    const { data, error } = await queryWithTimeout<TechnologyRow>(supabase.from('technologies').select('*'))

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    if (!data || data.length === 0) {
      console.warn('No technologies found')
      return [] as Technology[]
    }

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
    console.error('Error fetching technologies:', error)
    throw new Error('Failed to fetch technologies')
  }
}
