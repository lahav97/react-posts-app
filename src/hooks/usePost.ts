import { useQuery } from '@tanstack/react-query'
import { getPostById } from '../api/posts'
import { queryKeys } from '../lib/queryKeys'
import type { Post, ApiError } from '../types'

export function usePost(id: number) {
  return useQuery<Post, ApiError>({
    queryKey: queryKeys.posts.detail(id),
    queryFn: () => getPostById(id),
    // Pass NaN (or any non-positive value) to skip the fetch, e.g. when the post is already cached.
    enabled: Number.isInteger(id) && id > 0,
  })
}