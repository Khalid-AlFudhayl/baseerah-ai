import { useEffect, useState } from 'react'
import API from '../services/api'

import {
  Activity,
  Car,
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  PlusCircle,
  Pencil,
  LogIn,
  Radio
} from 'lucide-react'

function ActivityPanel() {

  const [activities, setActivities] = useState([])

  const generateActivities = async () => {
    try {
      const response = await API.get('/activity-logs')
      const logs = response.data || []

      const generatedActivities = logs.map((log) => {
        let title = 'نشاط بالنظام'
        let type = 'info'
        let iconType = 'default'

        if (log.action.includes('LOGIN')) {
          title = 'تسجيل دخول'
          type = 'success'
          iconType = 'login'
        }

        else if (log.action.includes('ADD_CITY')) {
          title = 'إضافة منطقة'
          type = 'success'
          iconType = 'add'
        }

        else if (log.action.includes('UPDATE_CITY')) {
          title = 'تحديث بيانات منطقة'
          type = 'warning'
          iconType = 'update'
        }

        else if (log.action.includes('DELETE_CITY')) {
          title = 'حذف منطقة'
          type = 'critical'
          iconType = 'delete'
        }

        else if (log.action.includes('AI_REQUEST')) {
          title = 'طلب ذكاء اصطناعي'
          type = 'info'
          iconType = 'ai'
        }

        return {
          title,
          description: `${log.user_name} - ${log.action}`,
          time: new Date(log.created_at).toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          type,
          iconType
        }
      })

      setActivities(generatedActivities.slice(0, 8))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    generateActivities()

    const interval = setInterval(() => {
      generateActivities()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const getIcon = (activity) => {
    if (activity.iconType === 'login') return <LogIn size={18} />
    if (activity.iconType === 'add') return <PlusCircle size={18} />
    if (activity.iconType === 'update') return <Pencil size={18} />
    if (activity.iconType === 'delete') return <Trash2 size={18} />
    if (activity.iconType === 'ai') return <BrainCircuit size={18} />
    if (activity.type === 'success') return <CheckCircle2 size={18} />
    if (activity.type === 'critical') return <AlertTriangle size={18} />
    return <Car size={18} />
  }

  const getStyle = (activity) => {
    if (activity.type === 'success') {
      return {
        iconBox: 'bg-green-500/10 border-green-400/20 text-green-300',
        border: 'border-green-400/15',
        glow: 'rgba(0,200,150,0.10)',
        dot: 'bg-green-400',
        badge: 'bg-green-500/10 border-green-400/20 text-green-300'
      }
    }

    if (activity.type === 'warning') {
      return {
        iconBox: 'bg-orange-500/10 border-orange-400/20 text-orange-300',
        border: 'border-orange-400/15',
        glow: 'rgba(255,138,0,0.10)',
        dot: 'bg-orange-400',
        badge: 'bg-orange-500/10 border-orange-400/20 text-orange-300'
      }
    }

    if (activity.type === 'critical') {
      return {
        iconBox: 'bg-red-500/10 border-red-400/20 text-red-300',
        border: 'border-red-400/15',
        glow: 'rgba(248,113,113,0.10)',
        dot: 'bg-red-400',
        badge: 'bg-red-500/10 border-red-400/20 text-red-300'
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

  return (
    <div className="relative overflow-hidden bg-[#101827]/85 border border-cyan-500/10 rounded-3xl p-5 h-[420px] backdrop-blur-xl transition duration-300 hover:border-cyan-400/25 hover:shadow-[0_0_45px_rgba(0,230,255,0.07)]">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,230,255,0.10),transparent_36%)]"></div>
      <div className="absolute top-0 right-0 h-[2px] w-28 bg-cyan-400/60"></div>

      <div className="relative z-10 h-full flex flex-col">

        <div className="flex items-center justify-between mb-5">

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-300">
              <Activity size={22} />
            </div>

            <div>
              <h2 className="text-xl font-black">النشاطات</h2>
              <p className="text-gray-400 text-sm mt-1">سجل العمليات من قاعدة البيانات</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 px-3 py-2 rounded-2xl text-xs">
            <Radio size={13} />
            LIVE
          </div>

        </div>

        <div className="
          flex-1 overflow-y-auto space-y-3 pr-2
          [scrollbar-width:thin]
          [scrollbar-color:#00E6FF20_transparent]
          [&::-webkit-scrollbar]:w-[6px]
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-cyan-400/20
          [&::-webkit-scrollbar-thumb]:rounded-full
          hover:[&::-webkit-scrollbar-thumb]:bg-cyan-400/40
        ">

          {activities.length === 0 ? (

            <div className="bg-[#08111F]/85 p-4 rounded-2xl border border-cyan-500/10">
              <p className="text-cyan-300 text-sm">لا توجد نشاطات مسجلة حتى الآن...</p>
            </div>

          ) : (

            activities.map((activity, index) => {
              const style = getStyle(activity)

              return (
                <div
                  key={index}
                  className={`group relative overflow-hidden bg-[#08111F]/85 rounded-2xl border ${style.border} p-4 transition duration-300 hover:-translate-y-[2px] hover:border-cyan-400/25`}
                >

                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300"
                    style={{
                      background: `radial-gradient(circle at top right, ${style.glow}, transparent 42%)`
                    }}
                  ></div>

                  <div className="relative z-10 flex items-start gap-3">

                    <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${style.iconBox}`}>
                      {getIcon(activity)}
                    </div>

                    <div className="flex-1 min-w-0">

                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">

                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>

                            <p className="text-white font-black text-sm truncate">
                              {activity.title}
                            </p>
                          </div>

                          <p className="text-gray-400 text-sm leading-7 mt-2">
                            {activity.description}
                          </p>

                        </div>

                        <span className={`px-3 py-1 rounded-xl border text-[11px] whitespace-nowrap ${style.badge}`}>
                          {activity.time}
                        </span>

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

export default ActivityPanel