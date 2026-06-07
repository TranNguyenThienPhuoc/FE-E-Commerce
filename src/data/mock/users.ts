import type { User, AuthTokens } from '@/interfaces'

export const mockUsers: User[] = [
  {
    id: 'user-001',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@example.com',
    role: 'customer',
    createdAt: '2024-01-15T08:00:00.000Z',
    updatedAt: '2024-01-15T08:00:00.000Z',
  },
  {
    id: 'user-002',
    name: 'Trần Thị Bình',
    email: 'binh.tran@example.com',
    role: 'customer',
    createdAt: '2024-01-20T10:30:00.000Z',
    updatedAt: '2024-01-20T10:30:00.000Z',
  },
  {
    id: 'user-003',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'user-004',
    name: 'Lê Văn Cường',
    email: 'cuong.le@example.com',
    role: 'customer',
    createdAt: '2024-02-01T14:20:00.000Z',
    updatedAt: '2024-02-01T14:20:00.000Z',
  },
]

export const mockAuthTokens: AuthTokens = {
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.token',
  refreshToken: 'mock.refresh.token',
  expiresIn: 3600,
}
