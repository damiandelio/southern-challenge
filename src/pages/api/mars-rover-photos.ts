import { NextApiRequest, NextApiResponse } from 'next'
import * as privateService from '@/utils/private-service'
import type { Rover, ApiError, RoverName } from '@/utils/types'

type ApiResponse = NextApiResponse<Rover[] | ApiError>

async function get(req: NextApiRequest, res: ApiResponse) {
  const {
    query: { rover, page, earth_date, sol }
  } = req

  if (!rover || (!earth_date && !sol)) {
    res.status(400).json({ error: 'Missing require parameters' })
  }

  const dateType = earth_date ? 'earth_date' : 'sol'
  const dateValue = earth_date || sol

  const rovers = await privateService.fetchRovers(
    rover as RoverName,
    dateType,
    dateValue as string,
    page as unknown as number
  )

  if (rovers) {
    res.status(200).json(rovers)
  } else {
    res.status(500).json({ error: true })
  }
}

export default async function handler(req: NextApiRequest, res: ApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        await get(req, res)
    }
  } catch {
    res.status(500).json({ error: true })
  }
}
