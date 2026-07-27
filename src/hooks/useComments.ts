import { useQuery } from '@tanstack/react-query'
import { getCommentsByPostId } from '../api/comments'
import { queryKeys } from '../lib/queryKeys'
import type { Comment, ApiError } from '../types'

export function useComments(postId: number) {
  return useQuery<Comment[], ApiError>({
    queryKey: queryKeys.comments.byPost(postId),
    queryFn: () => getCommentsByPostId(postId),
    // Pass NaN (or any non-positive value) to skip the fetch, e.g. for posts with no real ID.
    enabled: Number.isInteger(postId) && postId > 0,
  })
}