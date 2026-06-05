import { useEffect, useState } from 'react'

import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Radio,
  Car,
  Wind,
  Activity
} from 'lucide-react'

import API from '../services/api'

function NotificationsPanel() {
  const [alerts, setAlerts] = useState([])

  const fetchAlerts = async () => {
    try {
      const response = await API.get('/alerts')
      setAlerts(response.data || [])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchAlerts()

    const interval = setInterval(fetchAlerts, 30000)

    return () => clearInterval(interval)
  }, [])

  const normalize = (value) => {
    return String(value || '').trim().toUpperCase()
  }

  const getAlertTitle = (alert) => {
  if (alert.title) return alert.title

  const type = normalize(alert.alert_type)

  if (type.includes('TRAFFIC')) return 'تنبيه مروري'
  if (type.includes('AIR')) return 'تنبيه جودة الهواء'
  if (type.includes('SECURITY')) return 'تنبيه أمني'
  if (type.includes('ENERGY')) return 'تنبيه الطاقة'
  if (type.includes('WATER')) return 'تنبيه المياه'

  return 'تنبيه تشغيلي'
}

  const getArabicSeverity = (alert) => {
  const value = normalize(alert.severity || alert.level)

    if (value.includes('CRITICAL')) return 'حرج'
    if (value.includes('HIGH')) return 'مرتفع'
    if (value.includes('MEDIUM')) return 'متوسط'
    if (value.includes('LOW')) return 'منخفض'

    return 'متوسط'
  }

  const getAlertIcon = (alert) => {
    const type = normalize(alert.alert_type)
    const severity = normalize(alert.severity)

    if (type.includes('TRAFFIC')) return <Car size={18} />
    if (type.includes('AIR')) return <Wind size={18} />
    if (type.includes('SECURITY')) return <ShieldAlert size={18} />

    if (severity.includes('CRITICAL') || severity.includes('HIGH')) {
      return <ShieldAlert size={18} />
    }

    if (severity.includes('MEDIUM')) {
      return <AlertTriangle size={18} />
    }

    return <Activity size={18} />
  }

  const getAlertStyle = (severity) => {
    const value = normalize(severity)

    if (value.includes('CRITICAL') || value.includes('HIGH')) {
      return {
        iconBox: 'bg-red-500/10 border-red-400/20 text-red-300',
        border: 'border-red-400/15',
        glow: 'rgba(248,113,113,0.10)',
        dot: 'bg-red-400',
        badge: 'bg-red-500/10 border-red-400/20 text-red-300'
      }
    }

    if (value.includes('MEDIUM')) {
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

  return (
    <div className="relative overflow-hidden bg-[#101827]/85 border border-cyan-500/10 rounded-3xl p-5 h-[560px] backdrop-blur-xl transition duration-300 hover:border-cyan-400/25 hover:shadow-[0_0_45px_rgba(0,230,255,0.07)]">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,138,0,0.08),transparent_35%)]"></div>
      <div className="absolute top-0 right-0 h-[2px] w-28 bg-orange-400/60"></div>

      <div className="relative z-10 h-full flex flex-col">

        <div className="flex justify-between items-start mb-5">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-orange-500/10 border border-orange-400/20 flex items-center justify-center text-orange-300">
              <Bell size={22} />
            </div>

            <div>
              <h2 className="text-xl font-black">التنبيهات الذكية</h2>
              <p className="text-gray-400 text-sm mt-1">
                إنذارات تشغيلية من قاعدة البيانات
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-400/20 text-orange-300 px-3 py-2 rounded-2xl text-xs">
            <Radio size={13} />
            LIVE
          </div>

        </div>

        <div className="bg-[#08111F]/85 border border-cyan-500/10 rounded-3xl p-5 mb-4">

          <div className="flex justify-between items-center">

            <div>
              <p className="text-gray-400 text-sm">إجمالي التنبيهات</p>

              <h3 className="text-5xl font-black text-orange-300 mt-2">
                {alerts.length}
              </h3>
            </div>

            <div className="w-16 h-16 rounded-3xl bg-orange-500/10 border border-orange-400/20 flex items-center justify-center text-orange-300 shadow-[0_0_25px_rgba(255,138,0,0.10)]">
              <Bell size={28} />
            </div>

          </div>

        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 [scrollbar-width:thin] [scrollbar-color:#00E6FF20_transparent] [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-cyan-400/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-cyan-400/40">

          {alerts.length === 0 ? (

            <div className="bg-[#08111F]/85 p-5 rounded-2xl border border-green-500/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-green-500/10 border border-green-400/20 flex items-center justify-center text-green-300">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <p className="text-green-300 font-bold">
                    لا توجد تنبيهات مسجلة
                  </p>

                  <p className="text-gray-500 text-sm mt-1">
                    قاعدة البيانات لا تحتوي على تنبيهات حالية
                  </p>
                </div>
              </div>
            </div>

          ) : (

            alerts.map((alert) => {
              const style = getAlertStyle(alert.severity)

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
                        <p className="text-gray-500 text-xs">وقت التنبيه</p>
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