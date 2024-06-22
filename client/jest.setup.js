import '@testing-library/jest-dom'

import { jest } from '@jest/globals'

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('?search=test'),
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

jest.mock('axios')