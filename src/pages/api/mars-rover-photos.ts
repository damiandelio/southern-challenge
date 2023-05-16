import { NextApiRequest, NextApiResponse } from 'next'
import { NASA_API_URL, NASA_API_KEY } from '@/utils/constants'

async function get(req: NextApiRequest, res: NextApiResponse<any>) {
  const {
    query: { rover, page, earth_date, sol }
  } = req

  const dateType = earth_date ? 'earth_date' : 'sol'
  const dateValue = earth_date || sol

  const response = await fetch(
    `${NASA_API_URL}rovers/${rover}/photos?${dateType}=${dateValue}&page=${page}&api_key=${NASA_API_KEY}`
  )

  const data = await response.json()

  if (data?.photos) {
    res.status(200).json(data.photos)
  } else {
    res.status(400).json({ error: true })
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    switch (req.method) {
      case 'GET':
        await get(req, res)
    }
  } catch {
    res.status(500).json({ error: true })
  }
}
