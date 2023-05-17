type CameraName =
  | 'FHAZ'
  | 'RHAZ'
  | 'MAST'
  | 'CHEMCAM'
  | 'MAHLI'
  | 'MARDI'
  | 'NAVCAM'
  | 'PANCAM'
  | 'MINITES'

export type RoverName = 'curiosity' | 'opportunity' | 'spirit'

export type DateType = 'sol' | 'earth_date'

export interface Rover {
  id: number
  sol: number
  earth_date: string
  img_src: string
  camera: {
    id: number
    name: CameraName
    rover_id: number
    full_name: string
  }
  rover: {
    id: number
    name: Capitalize<RoverName>
    landing_date: string
    launch_date: string
    status: string
  }
}

export interface NasaApiRoverResposne {
  photos: Rover[]
}

export interface Manifest {
  name: Capitalize<RoverName>
  landing_date: string
  launch_date: string
  status: string
  max_sol: number
  max_date: string
  total_photos: number
  photos: Array<{
    sol: number
    earth_date: string
    total_photos: number
    cameras: CameraName
  }>
}

export interface ApiError {
  error: boolean | string
}
