export function useApi() {
  const toast = useToast()

  async function request<T>(
    fn: () => Promise<T>,
    options?: { errorMsg?: string; loadingRef?: Ref<boolean> }
  ): Promise<T | null> {
    if (options?.loadingRef) options.loadingRef.value = true
    try {
      return await fn()
    } catch {
      toast.add({ title: options?.errorMsg ?? '请求失败', color: 'error' })
      return null
    } finally {
      if (options?.loadingRef) options.loadingRef.value = false
    }
  }

  return { request }
}