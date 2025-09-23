import { test, expect, beforeEach, describe } from '@playwright/test';

describe ('Blog app', () => {
  beforeEach (async ({ page, request }) => {
    await request.post('/api/testing/reset')

    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'log in to application' })
    ).toBeVisible()

    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').nth(1).fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wronng credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').nth(1).fill('wrongpassword')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Wrong credentials')).toBeVisible()

      await expect(page.getByText('Matti luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').nth(1).fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created with details', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.getByPlaceholder('title').fill('Playwright testing blog')
      await page.getByPlaceholder('author').fill('Playwright Bot')
      await page.getByPlaceholder('url').fill('http://playwright.dev')

      await page.getByRole('button', { name: 'create' }).click()

      const blog = page.locator('.blog', { hasText: 'Playwright testing blog' }).first()
      await expect(blog).toBeVisible()

      await blog.getByRole('button', { name: 'view' }).click()
      await expect(blog).toHaveText(/Playwright Bot/)
      await expect(blog).toHaveText(/http:\/\/playwright\.dev/)
    })

    test('user can like a blog', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('title').fill('Playwright testing blog')
      await page.getByPlaceholder('author').fill('Playwright Bot')
      await page.getByPlaceholder('url').fill('http://playwright.dev')
      await page.getByRole('button', { name: 'create' }).click()

      const blog = page.locator('.blog', { hasText: 'Playwright testing blog' }).first()
      await blog.getByRole('button', { name: 'view' }).click()

      const likesDiv = blog.locator('div', { hasText: /^Likes/ })
      const likesText = await likesDiv.textContent()
      const initialLikes = parseInt(likesText.replace(/\D/g, ''), 10)

      await blog.getByRole('button', { name: 'like' }).click()

      await expect(likesDiv).toHaveText(new RegExp(`Likes: ${initialLikes + 1}`))
    })

    describe('Blog existing', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('title').fill('Blog to be removed')
      await page.getByPlaceholder('author').fill('Test author')
      await page.getByPlaceholder('url').fill('http://testblog.com')
      await page.getByRole('button', { name: 'create' }).click()
      })

      test.only('Blog creatror can delete a blog', async ({ page }) => {
        const blog = page.locator('.blog', { hasText: 'Blog to be removed' }).first()
        await expect(blog).toBeVisible()

        await blog.getByRole('button', { name: 'view' }).click()
        const removeButton = blog.getByRole('button', { name: 'remove' })
        await expect(removeButton).toBeVisible()

        page.on('dialog', async (dialog) => {
          await dialog.accept()
        })

        await removeButton.click()

        await expect(page.locator('blog', { hasText: 'Blog to be removed' })).toHaveCount(0)
      })
    })
  })
})
