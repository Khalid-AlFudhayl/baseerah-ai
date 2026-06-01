import axios from 'axios'

const API = axios.create({
  baseURL: 'https://baseerah-ai-backend.onrender.com'
})

export default API