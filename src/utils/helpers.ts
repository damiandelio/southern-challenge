import type { Manifest, RoverName, PhotoInfo } from '@/utils/types'

const PHOTOS_PER_PAGE = 25

export function getManifestByRoverName(
  manifests: Manifest[],
  rover: RoverName
): Manifest {
  return manifests.find(
    manifest => manifest.name.toLowerCase() === rover
  ) as Manifest
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

export function getTotalPages(totalPhotos: number) {
  return Math.ceil(totalPhotos / PHOTOS_PER_PAGE)
}

export function getDefaultPhotoInfo(manifest: Manifest): PhotoInfo {
  return manifest.photos[manifest.photos.length - 1]
}
