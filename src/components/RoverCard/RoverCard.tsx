import type { FunctionComponent } from 'react'
import { Card, CardTitle, CardDescription } from './RoverCard.styles'
import type { Rover as RoverCardProps } from '@/utils/types'

export const RoverCard: FunctionComponent<RoverCardProps> = ({
  rover: { name, landing_date, launch_date, status },
  camera,
  img_src,
  earth_date
}) => {
  return (
    <Card>
      <CardTitle>
        {name} ({camera.full_name})
      </CardTitle>
      <img src={img_src} alt={name} draggable={false} />
      <CardDescription>
        <div>Taked: {earth_date}</div>
        <div>
          Launch date: <time>{launch_date}</time>
        </div>
        <div>
          Landing date: <time>{landing_date}</time>
        </div>
        <div>Status: {status}</div>
      </CardDescription>
    </Card>
  )
}
