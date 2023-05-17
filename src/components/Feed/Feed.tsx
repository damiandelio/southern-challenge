'use client'

import { useState, useCallback } from 'react'
import * as publicService from '@/utils/public-service'
import { RoverCard } from '@/components/RoverCard/RoverCard'
import { InfiniteScrollLoader } from '@/components/InfiniteScrollLoader'
import { useSearchFilter } from '@/hooks/useSearchFilter'
import { FeedContainer } from './Feed.styles'
import type { MutableRefObject, FunctionComponent } from 'react'
import type { Rover, Manifest } from '@/utils/types'

interface FeedProps {
  manifests: Manifest[]
}

export const Feed: FunctionComponent<FeedProps> = ({ manifests }) => {
  const [rovers, setRovers] = useState<Rover[]>([])
  const [isRetry, setIsRetry] = useState(false)
  const [page, setPage] = useState(1)

  const {
    rover,
    solDate,
    earthDate,
    totalPages,
    setRover,
    setSolData,
    setEarthDate
  } = useSearchFilter(manifests)

  const isLastPage: boolean = page > totalPages

  function resetList() {
    setRovers([])
    setPage(1)
  }

  const loadMore = useCallback(async () => {
    try {
      const newRovers = await publicService.fetchRovers(
        rover,
        'sol',
        solDate,
        page
      )

      if (!isLastPage) {
        setPage(page + 1)
      }

      setRovers(rovers => [...rovers, ...newRovers])
      setIsRetry(false)
    } catch {
      setIsRetry(true)
    }
  }, [rover, solDate, page, isLastPage])

  function handleSolDateBtn() {
    setSolData(solDate - 1)
    resetList()
  }

  /* function handleEarthDateBtn() {
    setEarthDate(earthDate - 1)
    setRovers([])
  } */

  return (
    <FeedContainer>
      <nav>
        <button onClick={handleSolDateBtn}>Sol date -1</button>
        {/* <button onClick={handleEarthDateBtn}>Earth date -1</button> */}
        <br />
        rover: {rover}
        <br />
        Earth date: {earthDate}
        <br />
        Sol date: {solDate}
        <br />
        Total pages: {totalPages}
        <br />
      </nav>

      {rovers?.map((rover, i) => (
        <RoverCard key={'' + rover.id + i} {...rover} />
      ))}
      {isRetry ? (
        <button onClick={loadMore}>Retry</button>
      ) : (
        <>
          {!isLastPage ? (
            <InfiniteScrollLoader
              loadMore={loadMore}
              threshold={2000}
              debounceDelay={800}
              render={(ref: MutableRefObject<any>) => (
                <div ref={ref}>Loading...</div>
              )}
            />
          ) : (
            <div>There are no more photos for this date, try with another.</div>
          )}
        </>
      )}
    </FeedContainer>
  )
}
