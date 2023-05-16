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

export type RoverName = 'curiosity' | 'opportunity' | 'spirit '

export type DateType = 'sol' | 'earth_date'

export interface Rover {
  id: number
  sol?: number
  earth_date?: string
  img_src: string
  camera: {
    id: number
    name: CameraName
    rover_id: number
    full_name: string
  }
  rover: {
    id: number
    name: RoverName
    landing_date: string
    launch_date: string
    status: string
  }
}

export interface NasaApiRoverResposne {
  photos: Rover[]
}
