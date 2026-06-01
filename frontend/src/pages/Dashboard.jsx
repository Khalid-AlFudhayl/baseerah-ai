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
      color: 'cyan',
    },
    {
      title: 'حركة المرور',
      value: '0%',
      color: 'orange',
    },
    {
      title: 'الطاقة',
      value: '0%',
      color: 'yellow',
    },
    {
      title: 'السلامة',
      value: '0%',
      color: 'green',
    },
  ])

  const [chartData, setChartData] = useState([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await API.get('/cities')
        const cities = res.data

        if (!cities || cities.length === 0) return

        const average = (key) => {
          const total = cities.reduce((sum, city) => {
            const rawValue = city[key]

            const numberValue =
              typeof rawValue === 'string'
                ? Number(rawValue.replace('%', ''))
                : Number(rawValue)

            return sum + numberValue
          }, 0)

          return Math.round(total / cities.length)
        }

        setCityStats([
          {
            title: 'جودة الهواء',
            value: String(average('air')),
            color: 'cyan',
          },
          {
            title: 'حركة المرور',
            value: `${average('traffic')}%`,
            color: 'orange',
          },
          {
            title: 'الطاقة',
            value: `${average('energy')}%`,
            color: 'yellow',
          },
          {
            title: 'السلامة',
            value: `${average('security')}%`,
            color: 'green',
          },
        ])

        setChartData(
          cities.map((city) => ({
            name: city.city,
            traffic: Number(String(city.traffic).replace('%', '')),
            air: Number(city.air),
          }))
        )
      } catch (error) {
        console.log('Dashboard data error:', error)
      }
    }

    fetchDashboardData()
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