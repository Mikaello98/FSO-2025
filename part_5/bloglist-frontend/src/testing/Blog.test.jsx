import React from 'react'
import { render, screen } from '@testing-library/react'
import Blog from '../components/Blog'
import { describe, test, expect } from 'vitest'

describe('Blog component', () => {
  test('renders blog title', () => {
    const blog = {
      title: 'Testing React Components',
      author: 'Tester',
      url: 'http://test.com',
      likes: 0,
      user: { username: 'root' }
    }

    render(<Blog blog={blog} />)

    const titleElement = screen.getByText(/Testing React Components/i)
    expect(titleElement).toBeDefined()
  })
})