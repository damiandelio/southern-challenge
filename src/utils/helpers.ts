import { PHOTOS_PER_PAGE, CAMERAS } from '@/utils/constants'
import type {
  Manifest,
  RoverName,
  PhotoInfo,
  Rover,
  CameraName
} from '@/utils/types'

export function getManifestByRoverName(
  manifests: Manifest[],
  rover: RoverName
): Manifest {
  return manifests.find(
    manifest => manifest.name.toLowerCase() === rover
  ) as Manifest
}

export function getPhotoInfoFromManifest(manifest: Manifest): PhotoInfo {
  return manifest.photos[manifest.photos.length - 1]
}

export function getPhotoInfoBySolDate(
  manifest: Manifest,
  solDate: number
): PhotoInfo | undefined {
  return manifest.photos.find(photo => photo.sol === solDate)
}

export function getPhotoInfoByEarthDate(
  manifest: Manifest,
  earthDate: string
): PhotoInfo | undefined {
  return manifest.photos.find(photo => photo.earth_date === earthDate)
}

export function getTotalPages(totalPhotos: number): number {
  return Math.ceil(totalPhotos / PHOTOS_PER_PAGE)
}

export function getFilteredRoversByCamera(
  rovers: Rover[],
  camera: CameraName | 'all'
) {
  return camera === CAMERAS.all
    ? rovers
    : rovers.filter(rover => camera === rover.camera.name.toLowerCase())
}
