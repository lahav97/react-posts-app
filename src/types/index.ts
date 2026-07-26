export interface Post {
  id: number
  userId: number
  title: string
  body: string
  isLocal?: boolean
}

export interface Comment {
  id: number
  postId: number
  name: string
  email: string
  body: string
}

export type NewPostInput = Pick<Post, 'title' | 'body'>

export interface ApiError {
  message: string
  status?: number
  isNetworkError: boolean
}