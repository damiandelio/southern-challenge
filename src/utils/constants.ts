import { RoverName, Cameras } from '@/utils/types'

export const NASA_API_KEY = process.env.NASA_API_KEY // api key will only be available on the server
export const NASA_API_URL = 'https://api.nasa.gov/mars-photos/api/v1/'
export const PHOTOS_PER_PAGE = 25

export const ROVERS: Record<RoverName, RoverName> = {
  curiosity: 'curiosity',
  opportunity: 'opportunity',
  spirit: 'spirit'
}

export const CAMERAS: Cameras = {
  all: 'all',
  fhaz: 'Front Hazard Avoidance Camera',
  rhaz: 'Rear Hazard Avoidance Camera',
  mast: 'Mast Camera',
  chemcam: 'Chemistry and Camera Complex',
  mahli: 'Mars Hand Lens Imager',
  mardi: 'Mars Descent Imager',
  navcam: 'Navigation Camera',
  pancam: 'Panoramic Camera',
  minites: 'Miniature Thermal Emission Spectrometer (Mini-TES)'
}
