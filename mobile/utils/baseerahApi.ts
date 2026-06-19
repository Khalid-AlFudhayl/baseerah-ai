import axios from 'axios'

export const API_URL = 'https://baseerah-ai-backend.onrender.com'

const DEMO_EMAIL = 'demo@baseerah.ai'
const DEMO_PASSWORD = '123456'

let cachedToken: string | null = null

export const getDemoToken = async () => {
  if (cachedToken) {
    return cachedToken
  }

  const response = await axios.post(`${API_URL}/auth/login`, {
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  })

  const token = response.data?.token

  if (!token) {
    throw new Error('No token received')
  }

  cachedToken = token

  return token
}

export const getAuthHeaders = async () => {
  const token = await getDemoToken()

  return {
    Authorization: `Bearer ${token}`,
  }
}

export const apiGet = async (path: string) => {
  const headers = await getAuthHeaders()

  const response = await axios.get(`${API_URL}${path}`, {
    headers,
  })

  return response.data
}

export const apiPost = async (path: string, body: any) => {
  const headers = await getAuthHeaders()

  const response = await axios.post(`${API_URL}${path}`, body, {
    headers,
  })

  return response.data
}