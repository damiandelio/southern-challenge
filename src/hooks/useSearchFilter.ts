import { useState, useEffect } from 'react'
import {
  getManifestByRoverName,
  getPhotoInfoBySolDate,
  getPhotoInfoByEarthDate,
  getTotalPages,
  getDefaultPhotoInfo
} from '@/utils/helpers'
import type { RoverName, Manifest } from '@/utils/types'

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

export const useSearchFilter: UseSearchFilter = (
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
