import type { Rover, RoverName, DateType } from '@/utils/types'

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
