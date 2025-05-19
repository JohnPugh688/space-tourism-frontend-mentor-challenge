import { destinations, crew, technology } from '~/data'

export function getDestination(name: string) {
  return destinations.find((d) => d.name.toLowerCase() === name.toLowerCase())
}

export function getDestinations() {
  return destinations
}

export function getTechnologyByName(name: string) {
  return technology.find((t) => t.name.toLowerCase() === name.toLowerCase())
}

export function getTechnology() {
  return technology
}

export function getCrew() {
  return crew
}
