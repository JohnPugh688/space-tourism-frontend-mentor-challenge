import type { Destination } from './destination'
import type { CrewMember } from './crew'
import type { Technology } from './technology'

export type { Destination } from './destination'
export type { CrewMember } from './crew'
export type { Technology } from './technology'

export interface SpaceData {
  destinations: Destination[]
  crew: CrewMember[]
  technology: Technology[]
}
