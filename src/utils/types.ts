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

type RoverName = 'Curiosity' | 'Opportunity' | 'Spirit '

interface Rover {
  id: number
  sol: number
  camera: {
    id: number
    name: CameraName
    rover_id: number
    full_name: string
  }
  img_src: string
  earth_date: string
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
