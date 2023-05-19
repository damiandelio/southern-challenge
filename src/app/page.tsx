import { Feed } from '@/components/Feed/Feed'
import * as privateService from '@/utils/private-service'
import {
  getManifestByRoverName,
  getPhotoInfoFromManifest,
  getTotalPages
} from '@/utils/helpers'
import { ROVERS } from '@/utils/constants'
import type { Manifest } from '@/utils/types'

export default async function Home() {
  const manifests: Manifest[] | undefined = await privateService
    .fetchManifests()
    .catch()

  if (!manifests || !manifests.length)
    return <div>An error occurred loading the page, please refresh 😊</div>

  const initialRover = ROVERS.curiosity
  const initialManifest = getManifestByRoverName(manifests, initialRover)
  const initialPhotoInfo = getPhotoInfoFromManifest(initialManifest)
  const initialSolDate = initialPhotoInfo.sol
  const initialEarthDate = initialPhotoInfo.earth_date
  const initialTotalPages = getTotalPages(initialPhotoInfo.total_photos)

  return (
    <Feed
      manifests={manifests}
      initialManifest={initialManifest}
      initialRover={initialRover}
      initialPhotoInfo={initialPhotoInfo}
      initialSolDate={initialSolDate}
      initialEarthDate={initialEarthDate}
      initialTotalPages={initialTotalPages}
    />
  )
}
