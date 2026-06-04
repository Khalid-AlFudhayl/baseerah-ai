import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { io } from 'socket.io-client'

import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import StatCard from './components/StatCard'
import AnalyticsChart from './components/AnalyticsChart'
import ActivityPanel from './components/ActivityPanel'
import SmartCityMap from './components/SmartCityMap'
import SystemStatus from './components/SystemStatus'
import NotificationsPanel from './components/NotificationsPanel'
import CityTable from './components/CityTable'
import AIInsights from './components/AIInsights'
import AIAssistant from './components/AIAssistant'

import Login from './pages/Login'
import Settings from './pages/Settings'
import Users from './pages/Users'

import API from './services/api'

const socket = io('https://baseerah-ai-backend.onrender.com')

function DashboardPage({ stats, chartData }) {
  return (
    <>
      <HeroSection />

      <section
        className="mb-8"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
          gap: '18px',
          alignItems: 'start'
        }}
      >
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            color={stat.color}
          />
        ))}
      </section>

      <section
        className="mb-8"
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '22px',
          alignItems: 'start'
        }}
      >
        <AnalyticsChart chartData={chartData} />
        <ActivityPanel />
      </section>

      <section
        className="mb-8"
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '22px',
          alignItems: 'start'
        }}
      >
        <SmartCityMap />
        <SystemStatus />
      </section>
    </>
  )
}

function CitiesPage() {
  return (
    <section className="mb-8">
      <CityTable />
    </section>
  )
}

function AnalyticsPage({ chartData }) {
  return (
    <>
      <section className="mb-8">
        <AnalyticsChart chartData={chartData} />
      </section>

      <section className="mb-8">
        <AIInsights />
      </section>
    </>
  )
}

function AlertsPage() {
  return (
    <section
      className="mb-8"
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '22px',
        alignItems: 'start'
      }}
    >
      <NotificationsPanel />
      <ActivityPanel />
    </section>
  )
}

function AIPage() {
  return (
    <section className="mb-8">
      <AIAssistant />
    </section>
  )
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [stats, setStats] = useState([])
  const [chartData, setChartData] = useState([])

  const clearAuthData = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('baseerah_token')
    localStorage.removeItem('baseerah_user')
  }

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('baseerah_token')

      if (!token) {
        clearAuthData()
        setCurrentUser(null)
        setIsLoggedIn(false)
        setAuthLoading(false)
        return
      }

      try {
        const response = await API.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const user =
          response.data.user ||
          JSON.parse(localStorage.getItem('baseerah_user') || '{}')

        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('baseerah_user', JSON.stringify(user))

        setCurrentUser(user)
        setIsLoggedIn(true)
      } catch (error) {
        console.log('Auth check error:', error)
        clearAuthData()
        setCurrentUser(null)
        setIsLoggedIn(false)
      } finally {
        setAuthLoading(false)
      }
    }

    checkAuth()
  }, [])

  const getNumber = (value) => {
    return Number(String(value).replace('%', '')) || 0
  }

  const updateDashboardFromCities = (cities) => {
    if (!Array.isArray(cities) || cities.length === 0) return

    const trafficAverage = Math.floor(
      cities.reduce((sum, city) => sum + getNumber(city.traffic), 0) / cities.length
    )

    const airAverage = Math.floor(
      cities.reduce((sum, city) => sum + getNumber(city.air), 0) / cities.length
    )

    const energyAverage = Math.floor(
      cities.reduce((sum, city) => sum + getNumber(city.energy), 0) / cities.length
    )

    const waterAverage = Math.floor(
      cities.reduce((sum, city) => sum + getNumber(city.water), 0) / cities.length
    )

    const securityAverage = Math.floor(
      cities.reduce((sum, city) => sum + getNumber(city.security), 0) / cities.length
    )

    setStats([
      {
        title: 'جودة الهواء',
        value: `${airAverage}`,
        color: 'text-cyan-400'
      },
      {
        title: 'حركة المرور',
        value: `${trafficAverage}%`,
        color: 'text-orange-400'
      },
      {
        title: 'الطاقة',
        value: `${energyAverage}%`,
        color: 'text-yellow-400'
      },
      {
        title: 'المياه',
        value: `${waterAverage}%`,
        color: 'text-blue-400'
      },
      {
        title: 'السلامة',
        value: `${securityAverage}%`,
        color: 'text-green-400'
      }
    ])

    const currentTime =
      new Date().toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit'
      })

    setChartData((prevData) => {
      const updatedData = [
        ...prevData,
        {
          name: currentTime,
          traffic: trafficAverage,
          air: airAverage
        }
      ]

      return updatedData.slice(-8)
    })
  }

  const fetchDashboardData = async () => {
    try {
      const response = await API.get('/cities')
      const cities = response.data

      updateDashboardFromCities(cities)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!isLoggedIn) return

    fetchDashboardData()

    socket.on('cities:update', (cities) => {
      updateDashboardFromCities(cities)
    })

    return () => {
      socket.off('cities:update')
    }
  }, [isLoggedIn])

  const handleLoginSuccess = () => {
    const user = JSON.parse(
      localStorage.getItem('baseerah_user') || '{}'
    )

    setCurrentUser(user)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    clearAuthData()
    setCurrentUser(null)
    setIsLoggedIn(false)
  }

  if (authLoading) {
    return (
      <div className="
        min-h-screen
        bg-[#050B14]
        text-cyan-300
        flex
        items-center
        justify-center
        text-xl
        font-bold
      ">
        جاري التحقق من الجلسة...
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={handleLoginSuccess} />}
        />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    )
  }

  return (
    <div className="
      relative
      flex
      min-h-screen
      bg-[#050B14]
      text-white
      overflow-hidden
    ">

      <div className="
        absolute
        inset-0
        bg-[radial-gradient(circle_at_top_right,rgba(0,230,255,0.08),transparent_32%)]
      "></div>

      <div className="
        absolute
        inset-0
        bg-[radial-gradient(circle_at_bottom_left,rgba(0,200,150,0.06),transparent_35%)]
      "></div>

      <div className="
        absolute
        inset-0
        bg-[linear-gradient(rgba(0,230,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(0,230,255,0.018)_1px,transparent_1px)]
        bg-[size:44px_44px]
      "></div>

      <div className="relative z-10 flex w-full">
        <Sidebar currentUser={currentUser} />

        <main className="
          flex-1
          h-screen
          p-6
          overflow-y-auto
        ">
          <Navbar onLogout={handleLogout} />

             <Routes>
              <Route
             path="/"
              element={
             <DashboardPage
              stats={stats}
             chartData={chartData}
              />
              }
             />

             <Route path="/cities" element={<CitiesPage />} />

             <Route
             path="/analytics"
              element={
              <AnalyticsPage chartData={chartData} />
             }
             />

             <Route path="/alerts" element={<AlertsPage />} />

             <Route path="/ai" element={<AIPage />} />

             {currentUser?.role === 'admin' && (
             <>
             <Route path="/users" element={<Users />} />
             <Route path="/settings" element={<Settings />} />
              </>
             )}

             <Route path="/login" element={<Navigate to="/" replace />} />

             <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </main>
      </div>

    </div>
  )
}

export default App