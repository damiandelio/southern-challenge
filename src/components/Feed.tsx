'use client'

import { useState, useCallback } from 'react'
import { InfiniteScrollLoader } from '@/components/InfiniteScrollLoader'
import * as publicService from '@/utils/public-service'
import type { MutableRefObject, FunctionComponent } from 'react'
import type { Rover, Manifest } from '@/utils/types'

interface FeedProps {
  manifests: Manifest[]
}

export const Feed: FunctionComponent<FeedProps> = manifests => {
  const [rovers, setRovers] = useState<Rover[]>([])
  const [isRetry, setIsRetry] = useState(false)
  const [page, setPage] = useState(1)

  const loadMore = useCallback(async () => {
    try {
      const newRovers = await publicService.fetchRovers(
        'curiosity',
        'sol',
        1000,
        page
      )
      setRovers(rovers => [...rovers, ...newRovers])
      setPage(page => page + 1)
      setIsRetry(false)
    } catch {
      setIsRetry(true)
    }
  }, [page])

  return (
    <section>
      {rovers?.map((rover, i) => (
        <div key={rover.id + i}>
          <img src={rover.img_src} alt={rover.rover.name} draggable={false} />
        </div>
      ))}
      {isRetry ? (
        <button onClick={loadMore}>Retry</button>
      ) : (
        <InfiniteScrollLoader
          loadMore={loadMore}
          threshold={2000}
          debounceDelay={800}
          render={(ref: MutableRefObject<any>) => (
            <div ref={ref}>Loading...</div>
          )}
        />
      )}
    </section>
  )
}
