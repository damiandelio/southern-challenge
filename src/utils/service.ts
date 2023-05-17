import type { Rover, RoverName, DateType, Manifest } from '@/utils/types'

export async function getRovers(
  roverName: RoverName,
  dateType: DateType,
  dateValue: number | string,
  page: number = 1
): Promise<Rover[]> {
  const response = await fetch(
    `/api/mars-rover-photos?rover=${roverName}&${dateType}=${dateValue}&page=${page}`
  )

  if (response.status !== 200) {
    throw new Error()
  }

  return await response.json()
}

export async function getManifest(): Promise<Manifest[]> {
  const response = await fetch('http://localhost:3000/api/mars-rover-manifest')

  if (response.status !== 200) {
    throw new Error()
  }

  return await response.json()
}
