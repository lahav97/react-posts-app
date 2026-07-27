import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost } from '../api/posts'
import { queryKeys } from '../lib/queryKeys'
import type { Post, NewPostInput, ApiError } from '../types'

const LOCAL_POSTS_KEY = 'localPosts'

function saveLocalPost(post: Post) {
  const existing = getLocalPosts()
  localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify([post, ...existing]))
}

export function getLocalPosts(): Post[] {
  const raw = localStorage.getItem(LOCAL_POSTS_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as Post[]
  } catch {
    return []
  }
}

export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation<Post, ApiError, NewPostInput>({
    mutationFn: createPost,
    onSuccess: (serverPost, variables) => {
      const localPost: Post = {
        ...variables,
        id: -(Date.now() + Math.floor(Math.random() * 1000)),
        userId: serverPost.userId,
        isLocal: true,
      }

      saveLocalPost(localPost)

      queryClient.setQueryData<Post[]>(queryKeys.posts.all, (old) =>
        old ? [localPost, ...old] : [localPost],
      )
    },
  })
}