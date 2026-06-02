import { useEffect, useState } from 'react'

import Navbar from '../components/Navbar'
import StatCard from '../components/StatCard'
import AnalyticsChart from '../components/AnalyticsChart'
import ActivityPanel from '../components/ActivityPanel'
import SmartCityMap from '../components/SmartCityMap'
import SystemStatus from '../components/SystemStatus'
import NotificationsPanel from '../components/NotificationsPanel'
import CityTable from '../components/CityTable'

import API from '../services/api'

function Dashboard() {
  const [cityStats, setCityStats] = useState([
    {
      title: 'جودة الهواء',
      value: '0',
      color: 'text-cyan-300',
    },
    {
      title: 'حركة المرور',
      value: '0%',
      color: 'text-orange-300',
    },
    {
      title: 'الطاقة',
      value: '0%',
      color: 'text-yellow-300',
    },
    {
      title: 'السلامة',
      value: '0%',
      color: 'text-green-300',
    },
  ])

  const [chartData, setChartData] = useState([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsResponse = await API.get('/dashboard-stats')
        const stats = statsResponse.data

        setCityStats([
          {
            title: 'جودة الهواء',
            value: stats.airQuality || '0',
            color: 'text-cyan-300',
          },
          {
            title: 'حركة المرور',
            value: stats.traffic || '0%',
            color: 'text-orange-300',
          },
          {
            title: 'الطاقة',
            value: stats.energy || '0%',
            color: 'text-yellow-300',
          },
          {
            title: 'السلامة',
            value: stats.security || '0%',
            color: 'text-green-300',
          },
        ])

        const citiesResponse = await API.get('/cities')
        const cities = citiesResponse.data

        setChartData(
          cities.map((city) => ({
            name: city.city,
            traffic: Number(String(city.traffic).replace('%', '')) || 0,
            air: Number(city.air) || 0,
          }))
        )
      } catch (error) {
        console.log('Dashboard data error:', error)
      }
    }

    fetchDashboardData()

    const interval = setInterval(() => {
      fetchDashboardData()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-8">

      <Navbar />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {cityStats.map((stat, index) => (

          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            color={stat.color}
          />

        ))}

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-10">

        <div className="xl:col-span-2">
          <AnalyticsChart chartData={chartData} />
        </div>

        <ActivityPanel />

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-10">

        <div className="xl:col-span-2">
          <SmartCityMap />
        </div>

        <SystemStatus />

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-10">

        <div className="xl:col-span-2">
          <CityTable />
        </div>

        <NotificationsPanel />

      </div>

    </div>
  )
}

export default Dashboard