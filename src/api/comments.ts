import { apiClient } from './client'
import type { Comment } from '../types'

export async function getCommentsByPostId(postId: number): Promise<Comment[]> {
  const { data } = await apiClient.get<Comment[]>('/comments', {
    params: { postId },
  })
  return data
}