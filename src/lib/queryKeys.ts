export const queryKeys = {
  posts: {
    all: ['posts'] as const,
    detail: (id: number) => ['posts', id] as const,
  },
  comments: {
    byPost: (postId: number) => ['comments', postId] as const,
  },
}