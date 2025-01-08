import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useSpotifyAuth() {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('spotify_access_token')
    const refreshToken = localStorage.getItem('spotify_refresh_token')

    if (storedAccessToken) {
      setAccessToken(storedAccessToken)
    } else if (refreshToken) {
      refreshAccessToken(refreshToken)
    } else {
      router.push('/login')
    }
  }, [router])

  async function refreshAccessToken(refreshToken: string) {
    try {
      const response = await fetch('http://localhost:3001/api/auth/spotify/refresh_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })

      if (!response.ok) {
        throw new Error('Failed to refresh token')
      }

      const data = await response.json()
      localStorage.setItem('spotify_access_token', data.access_token)
      setAccessToken(data.access_token)
    } catch (error) {
      console.error('Error refreshing token:', error)
      router.push('/login')
    }
  }

  return { accessToken, refreshAccessToken }
}

