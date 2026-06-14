import { useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'

import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Radio,
  Car,
  Wind,
  Activity,
  Zap,
  Droplets
} from 'lucide-react'

import API from '../services/api'

const socket = io('https://baseerah-ai-backend.onrender.com', {
  transports: ['websocket', 'polling'],
  reconnection: true
})

function NotificationsPanel() {
  const [alerts, setAlerts] = useState([])
  const [cities, setCities] = useState([])

  const [typeFilter, setTypeFilter] = useState('ALL')
  const [severityFilter, setSeverityFilter] = useState('ALL')
  const [regionFilter, setRegionFilter] = useState('ALL')

  const [timeSortMode, setTimeSortMode] = useState('NEWEST')
  const [severitySortMode, setSeveritySortMode] = useState('NONE')

  const fetchAlerts = async () => {
    try {
      const response = await API.get('/alerts')
      setAlerts(response.data || [])
    } catch (error) {
      console.log(error)
    }
  }

  const fetchCities = async () => {
    try {
      const response = await API.get('/cities')
      setCities(response.data || [])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchAlerts()
    fetchCities()

    socket.on('alerts:update', (liveAlerts) => {
      setAlerts(liveAlerts || [])
    })

    socket.on('cities:update', (liveCities) => {
      setCities(liveCities || [])
    })

    return () => {
      socket.off('alerts:update')
      socket.off('cities:update')
    }
  }, [])

  const normalize = (value) => {
    return String(value || '').trim().toUpperCase()
  }

  const getAlertType = (alert) => {
    const type = normalize(alert.alert_type)

    if (type.includes('TRAFFIC')) return 'TRAFFIC'
    if (type.includes('AIR')) return 'AIR'
    if (type.includes('SECURITY')) return 'SECURITY'
    if (type.includes('ENERGY')) return 'ENERGY'
    if (type.includes('WATER')) return 'WATER'

    return 'OTHER'
  }

  const getAlertSeverity = (alert) => {
    const severity = normalize(alert.severity || alert.level)

    if (severity.includes('CRITICAL')) return 'CRITICAL'
    if (severity.includes('HIGH')) return 'HIGH'
    if (severity.includes('MEDIUM')) return 'MEDIUM'
    if (severity.includes('LOW')) return 'LOW'

    return 'MEDIUM'
  }

  const getSeverityRank = (alert) => {
    const severity = getAlertSeverity(alert)

    if (severity === 'CRITICAL') return 4
    if (severity === 'HIGH') return 3
    if (severity === 'MEDIUM') return 2
    if (severity === 'LOW') return 1

    return 0
  }

  const getAlertTimestamp = (alert) => {
    const value = alert.created_at || alert.time

    const timestamp = new Date(value).getTime()

    return Number.isNaN(timestamp) ? 0 : timestamp
  }

  const getRegionValue = (alert) => {
    return alert.region_id ? String(alert.region_id) : 'UNKNOWN'
  }

  const getRegionName = (alert) => {
    const city = cities.find((item) => {
      return Number(item.id) === Number(alert.region_id)
    })

    return city?.city || 'منطقة غير محددة'
  }

  const regionOptions = useMemo(() => {
    return cities
      .filter((city) => city.id && city.city)
      .map((city) => ({
        value: String(city.id),
        label: city.city
      }))
  }, [cities])

  const filteredAlerts = useMemo(() => {
    const result = alerts.filter((alert) => {
      const alertType = getAlertType(alert)
      const alertSeverity = getAlertSeverity(alert)
      const alertRegion = getRegionValue(alert)

      const typeMatches =
        typeFilter === 'ALL' || alertType === typeFilter

      const severityMatches =
        severityFilter === 'ALL' || alertSeverity === severityFilter

      const regionMatches =
        regionFilter === 'ALL' || alertRegion === regionFilter

      return typeMatches && severityMatches && regionMatches
    })

    return [...result].sort((a, b) => {
      if (severitySortMode === 'HIGHEST_FIRST') {
        const severityDifference = getSeverityRank(b) - getSeverityRank(a)

        if (severityDifference !== 0) {
          return severityDifference
        }
      }

      if (severitySortMode === 'LOWEST_FIRST') {
        const severityDifference = getSeverityRank(a) - getSeverityRank(b)

        if (severityDifference !== 0) {
          return severityDifference
        }
      }

      if (timeSortMode === 'NEWEST') {
        return getAlertTimestamp(b) - getAlertTimestamp(a)
      }

      if (timeSortMode === 'OLDEST') {
        return getAlertTimestamp(a) - getAlertTimestamp(b)
      }

      return 0
    })
  }, [
    alerts,
    typeFilter,
    severityFilter,
    regionFilter,
    timeSortMode,
    severitySortMode
  ])

  const getAlertTitle = (alert) => {
    if (alert.title) return alert.title

    const type = getAlertType(alert)

    if (type === 'TRAFFIC') return 'تنبيه مروري'
    if (type === 'AIR') return 'تنبيه جودة الهواء'
    if (type === 'SECURITY') return 'تنبيه أمني'
    if (type === 'ENERGY') return 'تنبيه الطاقة'
    if (type === 'WATER') return 'تنبيه المياه'

    return 'تنبيه تشغيلي'
  }

  const getArabicSeverity = (alert) => {
    const value = getAlertSeverity(alert)

    if (value === 'CRITICAL') return 'حرج'
    if (value === 'HIGH') return 'مرتفع'
    if (value === 'MEDIUM') return 'متوسط'
    if (value === 'LOW') return 'منخفض'

    return 'متوسط'
  }

  const getAlertIcon = (alert) => {
    const type = getAlertType(alert)
    const severity = getAlertSeverity(alert)

    if (type === 'TRAFFIC') return <Car size={18} />
    if (type === 'AIR') return <Wind size={18} />
    if (type === 'SECURITY') return <ShieldAlert size={18} />
    if (type === 'ENERGY') return <Zap size={18} />
    if (type === 'WATER') return <Droplets size={18} />

    if (severity === 'CRITICAL' || severity === 'HIGH') {
      return <ShieldAlert size={18} />
    }

    if (severity === 'MEDIUM') {
      return <AlertTriangle size={18} />
    }

    return <Activity size={18} />
  }

  const getAlertStyle = (alert) => {
    const value = getAlertSeverity(alert)

    if (value === 'CRITICAL' || value === 'HIGH') {
      return {
        iconBox: 'bg-red-500/10 border-red-400/20 text-red-300',
        border: 'border-red-400/15',
        glow: 'rgba(248,113,113,0.10)',
        dot: 'bg-red-400',
        badge: 'bg-red-500/10 border-red-400/20 text-red-300'
      }
    }

    if (value === 'MEDIUM') {
      return {
        iconBox: 'bg-orange-500/10 border-orange-400/20 text-orange-300',
        border: 'border-orange-400/15',
        glow: 'rgba(255,138,0,0.10)',
        dot: 'bg-orange-400',
        badge: 'bg-orange-500/10 border-orange-400/20 text-orange-300'
      }
    }

    return {
      iconBox: 'bg-cyan-500/10 border-cyan-400/20 text-cyan-300',
      border: 'border-cyan-400/15',
      glow: 'rgba(0,230,255,0.10)',
      dot: 'bg-cyan-400',
      badge: 'bg-cyan-500/10 border-cyan-400/20 text-cyan-300'
    }
  }

  const formatTime = (createdAt) => {
    if (!createdAt) return 'الآن'

    return new Date(createdAt).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const selectClass = `
    w-full
    bg-[#06101E]/90
    border
    border-cyan-500/10
    text-gray-300
    text-xs
    rounded-2xl
    px-3
    py-2.5
    outline-none
    transition
    focus:border-cyan-400/30
    focus:text-white
  `

  return (
    <div className="relative overflow-hidden bg-[#101827]/85 border border-cyan-500/10 rounded-3xl p-5 h-[620px] backdrop-blur-xl transition duration-300 hover:border-cyan-400/25 hover:shadow-[0_0_45px_rgba(0,230,255,0.07)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,138,0,0.08),transparent_35%)]"></div>
      <div className="absolute top-0 right-0 h-[2px] w-28 bg-orange-400/60"></div>

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-orange-500/10 border border-orange-400/20 flex items-center justify-center text-orange-300">
              <Bell size={22} />
            </div>

            <div>
              <h2 className="text-xl font-black">التنبيهات الذكية</h2>
              <p className="text-gray-400 text-sm mt-1">
                إنذارات تشغيلية فورية من قاعدة البيانات
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-400/20 text-orange-300 px-3 py-2 rounded-2xl text-xs">
            <Radio size={13} />
            LIVE
          </div>
        </div>

        <div className="bg-[#08111F]/85 border border-cyan-500/10 rounded-3xl p-4 mb-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#06101E]/75 border border-orange-400/10 rounded-2xl px-4 py-3">
              <p className="text-gray-400 text-xs">إجمالي التنبيهات</p>

              <h3 className="text-3xl font-black text-orange-300 mt-1">
                {alerts.length}
              </h3>
            </div>

            <div className="bg-[#06101E]/75 border border-cyan-400/10 rounded-2xl px-4 py-3">
              <p className="text-gray-400 text-xs">المعروض حاليًا</p>

              <h3 className="text-3xl font-black text-cyan-300 mt-1">
                {filteredAlerts.length}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-[#08111F]/85 border border-cyan-500/10 rounded-3xl p-3 mb-3">
          <div className="grid grid-cols-5 gap-2">
            <div>
              <p className="text-gray-500 text-[11px] mb-1">النوع</p>

              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className={selectClass}
              >
                <option value="ALL">كل الأنواع</option>
                <option value="TRAFFIC">المرور</option>
                <option value="AIR">الهواء</option>
                <option value="ENERGY">الطاقة</option>
                <option value="WATER">المياه</option>
                <option value="SECURITY">الأمن</option>
              </select>
            </div>

            <div>
              <p className="text-gray-500 text-[11px] mb-1">الخطورة</p>

              <select
                value={severityFilter}
                onChange={(event) => setSeverityFilter(event.target.value)}
                className={selectClass}
              >
                <option value="ALL">كل المستويات</option>
                <option value="CRITICAL">حرج</option>
                <option value="HIGH">مرتفع</option>
                <option value="MEDIUM">متوسط</option>
                <option value="LOW">منخفض</option>
              </select>
            </div>

            <div>
              <p className="text-gray-500 text-[11px] mb-1">المنطقة</p>

              <select
                value={regionFilter}
                onChange={(event) => setRegionFilter(event.target.value)}
                className={selectClass}
              >
                <option value="ALL">كل المناطق</option>

                {regionOptions.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="text-gray-500 text-[11px] mb-1">ترتيب الوقت</p>

              <select
                value={timeSortMode}
                onChange={(event) => setTimeSortMode(event.target.value)}
                className={selectClass}
              >
                <option value="NEWEST">الأحدث أولًا</option>
                <option value="OLDEST">الأقدم أولًا</option>
              </select>
            </div>

            <div>
              <p className="text-gray-500 text-[11px] mb-1">ترتيب الخطورة</p>

              <select
                value={severitySortMode}
                onChange={(event) => setSeveritySortMode(event.target.value)}
                className={selectClass}
              >
                <option value="NONE">حسب الوقت فقط</option>
                <option value="HIGHEST_FIRST">الأخطر أولًا</option>
                <option value="LOWEST_FIRST">الأقل خطورة أولًا</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 [scrollbar-width:thin] [scrollbar-color:#00E6FF20_transparent] [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-cyan-400/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-cyan-400/40">
          {filteredAlerts.length === 0 ? (
            <div className="bg-[#08111F]/85 p-5 rounded-2xl border border-green-500/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-green-500/10 border border-green-400/20 flex items-center justify-center text-green-300">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <p className="text-green-300 font-bold">
                    لا توجد تنبيهات مطابقة
                  </p>

                  <p className="text-gray-500 text-sm mt-1">
                    غيّر الفلاتر أو انتظر تحديث البيانات الحية
                  </p>
                </div>
              </div>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const style = getAlertStyle(alert)

              return (
                <div
                  key={alert.id}
                  className={`group relative overflow-hidden bg-[#08111F]/85 p-4 rounded-2xl border ${style.border} transition duration-300 hover:-translate-y-[2px] hover:border-cyan-400/20`}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300"
                    style={{
                      background: `radial-gradient(circle at top right, ${style.glow}, transparent 42%)`
                    }}
                  ></div>

                  <div className="relative z-10 flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${style.iconBox}`}>
                      {getAlertIcon(alert)}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full animate-pulse ${style.dot}`}></span>

                            <p className="text-white font-bold text-sm leading-7">
                              {getAlertTitle(alert)}
                            </p>
                          </div>

                          <p className="text-gray-400 text-sm mt-2 leading-7">
                            {alert.message || alert.description}
                          </p>
                        </div>

                        <span className={`px-3 py-1 rounded-xl border text-xs whitespace-nowrap ${style.badge}`}>
                          {getArabicSeverity(alert)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-3">
                          <p className="text-gray-500 text-xs">وقت التنبيه</p>

                          {alert.region_id && (
                            <p className="text-cyan-400/80 text-xs">
                              {getRegionName(alert)}
                            </p>
                          )}
                        </div>

                        <p className="text-gray-400 text-xs">
                          {alert.time || formatTime(alert.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default NotificationsPanel