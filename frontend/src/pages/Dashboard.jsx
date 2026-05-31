import Navbar from '../components/Navbar'
import StatCard from '../components/StatCard'
import AnalyticsChart from '../components/AnalyticsChart'
import ActivityPanel from '../components/ActivityPanel'
import SmartCityMap from '../components/SmartCityMap'
import SystemStatus from '../components/SystemStatus'
import NotificationsPanel from '../components/NotificationsPanel'
import CityTable from '../components/CityTable'

import { cityStats } from '../data/dashboardData'

function Dashboard() {
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
          <AnalyticsChart />
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