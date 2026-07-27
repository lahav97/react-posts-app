import { apiClient } from './client'
import type { Post, NewPostInput } from '../types'

const MOCK_USER_ID = 1

export async function getPosts(): Promise<Post[]> {
  const { data } = await apiClient.get<Post[]>('/posts')
  return data
}

export async function getPostById(id: number): Promise<Post> {
  const { data } = await apiClient.get<Post>(`/posts/${id}`)
  return data
}

export async function createPost(input: NewPostInput): Promise<Post> {
  const { data } = await apiClient.post<Post>('/posts', { ...input, userId: MOCK_USER_ID })
  return data
}