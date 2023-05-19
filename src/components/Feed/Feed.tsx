'use client'

import { useState, useCallback, useEffect, ChangeEvent, useMemo } from 'react'
import * as publicService from '@/utils/public-service'
import { RoverCard } from '@/components/RoverCard/RoverCard'
import { InfiniteScrollLoader } from '@/components/InfiniteScrollLoader'
import { Select } from '@/components/Select/Select'
import { ROVERS, CAMERAS } from '@/utils/constants'
import {
  getManifestByRoverName,
  getPhotoInfoFromManifest,
  getPhotoInfoBySolDate,
  getPhotoInfoByEarthDate,
  getTotalPages,
  getFilteredRoversByCamera
} from '@/utils/helpers'
import { FeedContainer } from './Feed.styles'
import type { MutableRefObject, FunctionComponent } from 'react'
import type {
  Rover,
  Manifest,
  RoverName,
  PhotoInfo,
  CameraName,
  Cameras
} from '@/utils/types'

interface FeedProps {
  manifests: Manifest[]
  initialManifest: Manifest
  initialPhotoInfo: PhotoInfo
  initialRover: RoverName
  initialSolDate: number
  initialEarthDate: string
  initialTotalPages: number
}

export const Feed: FunctionComponent<FeedProps> = ({
  manifests,
  initialManifest,
  initialPhotoInfo,
  initialRover,
  initialSolDate,
  initialEarthDate,
  initialTotalPages
}) => {
  const [roverName, setRoverName] = useState<RoverName>(initialRover)
  const [manifest, setManifest] = useState<Manifest>(initialManifest)
  const [photoInfo, setPhotoInfo] = useState<PhotoInfo>(initialPhotoInfo)
  const [solDate, setSolDate] = useState(initialSolDate)
  const [earthDate, setEarthDate] = useState(initialEarthDate)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [rovers, setRovers] = useState<Rover[]>([])
  const [filteredRovers, setFilteredRovers] = useState<Rover[]>([])
  const [isRetry, setIsRetry] = useState(false)
  const [page, setPage] = useState(1)
  const [camera, setCamera] = useState<CameraName | 'all'>('all')

  const maxSolDate = manifest.max_sol
  const maxEarthDate = manifest.max_date
  const isLastPage = page > totalPages

  const availableCameras: Partial<Cameras> = useMemo(() => {
    const filteredCameras = photoInfo.cameras.reduce((options, camera) => {
      const key = camera.toLocaleLowerCase() as keyof Cameras
      return { ...options, [key]: CAMERAS[key] }
    }, {})

    return {
      all: CAMERAS.all,
      ...filteredCameras
    }
  }, [photoInfo])

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
    setCamera('all')
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
    setSolDate(photoInfo.sol)
    setEarthDate(photoInfo.earth_date)
    setTotalPages(getTotalPages(photoInfo.total_photos))
  }, [photoInfo])

  useEffect(() => {
    const photoInfo = getPhotoInfoBySolDate(manifest, solDate)
    if (photoInfo) {
      setPhotoInfo(photoInfo)
    }
  }, [solDate])

  useEffect(() => {
    const photoInfo = getPhotoInfoByEarthDate(manifest, earthDate)
    if (photoInfo) {
      setPhotoInfo(photoInfo)
    }
  }, [earthDate])

  useEffect(() => {
    const _filteredRovers = getFilteredRoversByCamera(rovers, camera)
    setFilteredRovers(_filteredRovers)
  }, [rovers, camera])

  return (
    <FeedContainer>
      <nav>
        <a href='https://github.com/damiandelio/southern-challenge'>
          Source code
        </a>
        <div>
          <Select
            id='rover'
            options={ROVERS}
            value={roverName}
            onChange={handleRoverChange}
          />
          <Select
            id='camera'
            options={availableCameras}
            value={camera}
            onChange={setCamera}
          />
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

      {filteredRovers?.map((rover, i) => (
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
