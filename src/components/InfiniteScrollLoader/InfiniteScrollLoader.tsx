import React, { useEffect, useCallback, useRef } from 'react'
import type { FunctionComponent, ReactElement, MutableRefObject } from 'react'

type InfiniteScrollLoaderProps = {
  loadMore: () => void
  render: (ref: MutableRefObject<any>) => ReactElement
  threshold?: number
}

/**
 * @param loadMore Callback function.
 * @param render Callback function - Should return a component with the passed ref.
 * @param threshold Threshold in pixels.
 */
export const InfiniteScrollLoader: FunctionComponent<
  InfiniteScrollLoaderProps
> = ({ loadMore, render, threshold = 400 }) => {
  const ref = useRef<HTMLElement>(null)

  const callback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0]
      if (target.isIntersecting) {
        loadMore()
      }
    },
    [loadMore]
  )

  useEffect(() => {
    const observer = new IntersectionObserver(callback, {
      root: null, // window by default
      rootMargin: `${threshold}px`,
      threshold: 0
    })

    if (ref.current) {
      observer.observe(ref.current)
    } else {
      console.warn('InfiniteScrollLoader: render does not have a defined ref')
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [callback, threshold])

  return render(ref)
}

export default InfiniteScrollLoader
