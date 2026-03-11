// app/types/user.ts
export interface User {
  id: number
  username: string
  name: string | null
  avatar: string | null
  status: number | null
  role: string | null
  createdAt: string
  updatedAt: string | null
}