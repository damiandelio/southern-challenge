import React, { useEffect, useCallback, useRef } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import type { FunctionComponent, ReactElement, MutableRefObject } from 'react'

type InfiniteScrollLoaderProps = {
  loadMore: () => void
  render: (ref: MutableRefObject<any>) => ReactElement
  threshold?: number
  debounceDelay?: number
}

/**
 * @param loadMore Callback function.
 * @param render Callback function - Should return a component with the passed ref.
 * @param threshold Threshold in pixels.
 * @param debounceDelay Debounce delay in milliseconds for loadMore callback.
 */
export const InfiniteScrollLoader: FunctionComponent<
  InfiniteScrollLoaderProps
> = ({ loadMore, render, threshold = 400, debounceDelay = 300 }) => {
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

  const debounced = useDebouncedCallback(callback, debounceDelay, {
    leading: true,
    trailing: true
  })

  useEffect(() => {
    const observer = new IntersectionObserver(debounced, {
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
      debounced.cancel()
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [debounced, threshold])

  return render(ref)
}

export default InfiniteScrollLoader
