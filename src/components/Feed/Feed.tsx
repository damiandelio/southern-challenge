'use client'

import { useState, useCallback, useEffect } from 'react'
import * as publicService from '@/utils/public-service'
import { RoverCard } from '@/components/RoverCard/RoverCard'
import { InfiniteScrollLoader } from '@/components/InfiniteScrollLoader'
import { FeedContainer } from './Feed.styles'
import type { MutableRefObject, FunctionComponent } from 'react'
import type {
  Rover,
  RoverName,
  // CameraName,
  Manifest,
  PhotoInfo
} from '@/utils/types'

interface FeedProps {
  manifests: Manifest[]
}

const PHOTOS_PER_PAGE = 25

function getManifestByRoverName(
  manifests: Manifest[],
  rover: RoverName
): Manifest {
  return manifests.find(
    manifest => manifest.name.toLowerCase() === rover
  ) as Manifest
}

function getPhotoInfoBySolDate(
  manifest: Manifest,
  solDate: number
): PhotoInfo | undefined {
  return manifest.photos.find(photo => photo.sol === solDate)
}

function getPhotoInfoByEarthDate(
  manifest: Manifest,
  earthDate: string
): PhotoInfo | undefined {
  return manifest.photos.find(photo => photo.earth_date === earthDate)
}

function getTotalPages(totalPhotos: number) {
  return Math.ceil(totalPhotos / PHOTOS_PER_PAGE)
}

function getDefaultPhotoInfo(manifest: Manifest): PhotoInfo {
  return manifest.photos[manifest.photos.length - 1]
}

type UseSearchFilter = (
  manifests: Manifest[],
  defaultRover?: RoverName
) => {
  rover: RoverName
  solDate: number
  earthDate: string
  totalPages: number
  setRover: (rover: RoverName) => void
  setSolData: (date: number) => void
  setEarthDate: (date: string) => void
}

const useSearchFilter: UseSearchFilter = (
  manifests,
  defaultRover = 'curiosity'
) => {
  const [rover, setRover] = useState<RoverName>(defaultRover)

  const [manifest, setManifest] = useState<Manifest>(
    getManifestByRoverName(manifests, rover)
  )

  const [solDate, setSolDate] = useState(getDefaultPhotoInfo(manifest).sol)

  const [earthDate, setEarthDate] = useState(
    getDefaultPhotoInfo(manifest).earth_date
  )

  const [totalPages, setTotalPages] = useState(
    getTotalPages(getDefaultPhotoInfo(manifest).total_photos)
  )

  useEffect(() => {
    setManifest(getManifestByRoverName(manifests, rover))
  }, [manifests, rover])

  function _setEarthDate(date: string) {
    const photoInfo = getPhotoInfoByEarthDate(manifest, date)

    if (photoInfo) {
      setSolDate(photoInfo.sol)
      setEarthDate(photoInfo.earth_date)
      setTotalPages(getTotalPages(photoInfo.total_photos))
    }
  }

  function _setSolDate(date: number) {
    const photoInfo = getPhotoInfoBySolDate(manifest, date)

    if (photoInfo) {
      setSolDate(photoInfo.sol)
      setEarthDate(photoInfo.earth_date)
      setTotalPages(getTotalPages(photoInfo.total_photos))
    }
  }

  return {
    rover,
    solDate,
    earthDate,
    totalPages,
    setRover: (rover: RoverName) => setRover(rover),
    setSolData: _setSolDate,
    setEarthDate: _setEarthDate
  }
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
            <div>There are no more photos for this date, try changing it.</div>
          )}
        </>
      )}
    </FeedContainer>
  )
}
