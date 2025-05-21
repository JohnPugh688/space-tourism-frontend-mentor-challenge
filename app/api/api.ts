import { supabase } from '../utils/supabase'
import type { Destination } from '~/types/destination'
import type { CrewMember } from '~/types/crew'
import type { Technology } from '~/types/technology'

export async function getDestinations() {
  const { data, error } = await supabase.from('destinations').select('*')

  if (error) throw error
  return data as Destination[]
}

export async function getCrew() {
  const { data, error } = await supabase.from('crew_members').select('*')

  if (error) throw error
  return data as CrewMember[]
}

export async function getTechnologies() {
  const { data, error } = await supabase.from('technologies').select('*')

  if (error) throw error
  return data as Technology[]
}
