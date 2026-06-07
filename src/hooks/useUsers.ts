import { useQuery } from '@tanstack/react-query'
import { userService } from '@/services/user.service'

export const USER_KEYS = {
  all: ['users'] as const,
  lists: () => [...USER_KEYS.all, 'list'] as const,
  list: () => [...USER_KEYS.lists()] as const,
  details: () => [...USER_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...USER_KEYS.details(), id] as const,
  current: () => [...USER_KEYS.all, 'current'] as const,
}


export function useUsers(page: number = 1, limit: number = 100) {
  return useQuery({
    queryKey: [...USER_KEYS.list(), page, limit],
    queryFn: async () => {
      const response = await userService.getAllUsers(page, limit)
      if (!response.success) {
        throw new Error('Failed to fetch users')
      }
      return response
    },
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: USER_KEYS.detail(id),
    queryFn: async () => {
      const response = await userService.getUser(id)
      if (!response.success) {
        throw new Error('Failed to fetch user')
      }
      return response.data
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, 
    gcTime: 15 * 60 * 1000, 
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

export function useCurrentUser() {
  return useQuery({
    queryKey: USER_KEYS.current(),
    queryFn: async () => {
      const response = await userService.getCurrentUser()
      if (!response.success) {
        throw new Error('Failed to fetch current user')
      }
      return response.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

// TODO: Implement useUpdateProfile when backend endpoint is ready
// export function useUpdateProfile() {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn: (data: Partial<User>) => userService.updateProfile(data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: USER_KEYS.current() })
//     },
//   })
// }
