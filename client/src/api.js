const productionApiUrl = 'https://real-time-chat-application-s2h6.onrender.com'

export const API_BASE_URL = (
  import.meta.env.PROD ? productionApiUrl : (import.meta.env.VITE_API_URL || '')
).replace(/\/$/, '')

export function apiUrl(path) {
  return `${API_BASE_URL}${path}`
}

export async function readApiResponse(response) {
  const body = await response.text()
  try {
    return body ? JSON.parse(body) : {}
  } catch {
    throw new Error(`API returned a non-JSON response (HTTP ${response.status}) from ${response.url}. Check the Vercel deployment and API URL.`)
  }
}
