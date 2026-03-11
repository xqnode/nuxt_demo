// types/auth.d.ts
declare module '#auth-utils' {
  interface User {
    id: number
    username: string
    name?: string
    avatar?: string
    role?: string
  }
}

export { }