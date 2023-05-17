import { Feed } from '@/components/Feed/Feed'
import * as privateService from '@/utils/private-service'
import type { Manifest } from '@/utils/types'

export default async function Home() {
  const manifests: Manifest[] | undefined = await privateService
    .fetchManifests()
    .catch()

  if (manifests && manifests.length) {
    return <Feed manifests={manifests} />
  } else {
    return <div>An error occurred loading the page, please refresh 😊</div>
  }
}
