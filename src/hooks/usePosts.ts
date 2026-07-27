import { useQuery } from '@tanstack/react-query'
import { getPosts } from '../api/posts'
import { getLocalPosts } from './useCreatePost'
import { queryKeys } from '../lib/queryKeys'
import type { Post, ApiError } from '../types'

export function usePosts() {
  return useQuery<Post[], ApiError>({
    queryKey: queryKeys.posts.all,
    queryFn: async () => {
      const serverPosts = await getPosts()
      const localPosts = getLocalPosts()
      // Local posts are prepended so newly created posts appear first.
      return [...localPosts, ...serverPosts]
    },
  })
}