import { NextApiRequest, NextApiResponse } from 'next'
import { NASA_API_URL, NASA_API_KEY } from '@/utils/constants'
import type { RoverName, Manifest, ApiError } from '@/utils/types'

type ApiResponse = NextApiResponse<Manifest[] | ApiError>

let cachedResponse: Manifest[] | undefined

async function get(res: ApiResponse) {
  if (cachedResponse) {
    res.status(200).json(cachedResponse)
    return
  }

  async function fetchManifest(rover: RoverName): Promise<Manifest> {
    const response = await fetch(
      `${NASA_API_URL}manifests/${rover}?api_key=${NASA_API_KEY}`
    )
    const data = await response.json()
    return data.photo_manifest
  }

  const manifests = await Promise.all([
    fetchManifest('curiosity'),
    fetchManifest('spirit'),
    fetchManifest('opportunity')
  ])

  if (manifests) {
    cachedResponse = manifests
    res.status(200).json(manifests)
  } else {
    res.status(500).json({ error: true })
  }
}

export default async function handler(req: NextApiRequest, res: ApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        await get(res)
    }
  } catch {
    res.status(500).json({ error: true })
  }
}
