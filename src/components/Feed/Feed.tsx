'use client'

import { useState, useCallback, useEffect, ChangeEvent } from 'react'
import * as publicService from '@/utils/public-service'
import { RoverCard } from '@/components/RoverCard/RoverCard'
import { InfiniteScrollLoader } from '@/components/InfiniteScrollLoader'
import { Select } from '@/components/Select/Select'
import { ROVERS } from '@/utils/constants'
import {
  getManifestByRoverName,
  getPhotoInfoFromManifest,
  getPhotoInfoBySolDate,
  getPhotoInfoByEarthDate,
  getTotalPages
} from '@/utils/helpers'
import { FeedContainer } from './Feed.styles'
import type { MutableRefObject, FunctionComponent } from 'react'
import type { Rover, Manifest, RoverName, PhotoInfo } from '@/utils/types'

interface FeedProps {
  manifests: Manifest[]
}

export const Feed: FunctionComponent<FeedProps> = ({ manifests }) => {
  // TODO: move this to parent component
  const initialRover = 'curiosity'
  const initialManifest = getManifestByRoverName(manifests, initialRover)
  const initialPhotoInfo = getPhotoInfoFromManifest(initialManifest)
  const initialSolDate = initialPhotoInfo.sol
  const initialEarthDate = initialPhotoInfo.earth_date
  const initialTotalPages = getTotalPages(initialPhotoInfo.total_photos)

  const [roverName, setRoverName] = useState<RoverName>(initialRover)
  const [manifest, setManifest] = useState<Manifest>(initialManifest)
  const [solDate, setSolDate] = useState(initialSolDate)
  const [earthDate, setEarthDate] = useState(initialEarthDate)
  const [totalPages, setTotalPages] = useState(initialTotalPages)

  const [rovers, setRovers] = useState<Rover[]>([])
  const [isRetry, setIsRetry] = useState(false)
  const [page, setPage] = useState(1)

  const maxSolDate = manifest.max_sol
  const maxEarthDate = manifest.max_date

  const isLastPage: boolean = page > totalPages

  const loadMore = useCallback(async () => {
    try {
      const newRovers = await publicService.fetchRovers(
        roverName,
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
  }, [roverName, solDate, page, isLastPage])

  function reset() {
    setRovers([])
    setPage(1)
    // setCamera() TODO
  }

  function switchDate(photoInfo: PhotoInfo | undefined) {
    if (photoInfo) {
      setSolDate(photoInfo.sol)
      setEarthDate(photoInfo.earth_date)
      setTotalPages(getTotalPages(photoInfo.total_photos))
    }
  }

  function handleRoverChange(value: RoverName) {
    setRoverName(value)
    reset()
  }

  // TODO: debounce
  function handleSolDateChange(e: ChangeEvent<HTMLInputElement>) {
    setSolDate(Number(e.target.value))
    reset()
  }

  function handleEarthDateChange(e: ChangeEvent<HTMLInputElement>) {
    setEarthDate(e.target.value)
    reset()
  }

  useEffect(() => {
    const _manifest = getManifestByRoverName(manifests, roverName)
    const { sol, earth_date, total_photos } =
      getPhotoInfoFromManifest(_manifest)
    const _totalPages = getTotalPages(total_photos)

    setManifest(_manifest)
    setSolDate(sol)
    setEarthDate(earth_date)
    setTotalPages(_totalPages)
  }, [manifests, roverName])

  useEffect(() => {
    const photoInfo = getPhotoInfoBySolDate(manifest, solDate)
    switchDate(photoInfo)
  }, [solDate])

  useEffect(() => {
    const photoInfo = getPhotoInfoByEarthDate(manifest, earthDate)
    switchDate(photoInfo)
  }, [earthDate])

  return (
    <FeedContainer>
      <nav>
        <div>
          <Select
            id='rover'
            options={ROVERS}
            value={roverName}
            onChange={handleRoverChange}
          ></Select>
          <input
            id='sol'
            name='sol'
            type='number'
            min={0}
            max={maxSolDate}
            onChange={handleSolDateChange}
            value={solDate}
          />
          <input
            id='earth'
            type='date'
            max={maxEarthDate}
            name='earth'
            onChange={handleEarthDateChange}
            value={earthDate}
          />
        </div>
        <div>Total pages {totalPages}</div>
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
