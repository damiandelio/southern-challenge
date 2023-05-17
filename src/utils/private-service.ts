import { NASA_API_URL, NASA_API_KEY } from '@/utils/constants'
import type { Rover, RoverName, Manifest, DateType } from '@/utils/types'

let cachedResponse: Manifest[] | undefined

export async function fetchManifests(): Promise<Manifest[]> {
  if (cachedResponse) {
    return cachedResponse
  }

  async function getManifestFor(rover: RoverName): Promise<Manifest> {
    const response = await fetch(
      `${NASA_API_URL}manifests/${rover}?api_key=${NASA_API_KEY}`
    )
    const data = await response.json()
    return data.photo_manifest
  }

  const manifests = await Promise.all([
    getManifestFor('curiosity'),
    getManifestFor('spirit'),
    getManifestFor('opportunity')
  ])

  cachedResponse = manifests
  return manifests
}

export async function fetchRovers(
  rover: RoverName,
  dateType: DateType,
  dateValue: string | number,
  page: number
): Promise<Rover[]> {
  const response = await fetch(
    `${NASA_API_URL}rovers/${rover}/photos?${dateType}=${dateValue}&page=${page}&api_key=${NASA_API_KEY}`
  )
  const data = await response.json()
  return data.photos
}
