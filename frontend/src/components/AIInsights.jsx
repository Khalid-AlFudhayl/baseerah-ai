import { useEffect, useState } from 'react'

import {
  BrainCircuit,
  Car,
  Wind,
  Zap,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  RefreshCw,
  Droplets,
  Activity
} from 'lucide-react'

import API from '../services/api'

function AIInsights() {
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchRecommendations = async () => {
    try {
      setLoading(true)

      const response = await API.get('/ai-recommendations')
      const data = response.data || []

      setInsights(data)
    } catch (error) {
      console.log('AI recommendations error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecommendations()

    const interval = setInterval(fetchRecommendations, 30000)

    return () => clearInterval(interval)
  }, [])

  const getTypeFromText = (text) => {
    const value = String(text || '')

    if (value.includes('مروري') || value.includes('الحركة المرورية')) {
      return 'traffic'
    }

    if (value.includes('جودة الهواء') || value.includes('الهواء')) {
      return 'air'
    }

    if (value.includes('الطاقة') || value.includes('الكهربائية')) {
      return 'energy'
    }

    if (value.includes('المياه') || value.includes('المائية')) {
      return 'water'
    }

    if (value.includes('السلامة') || value.includes('الأمنية')) {
      return 'security'
    }

    return 'general'
  }

  const getTitle = (recommendation) => {
    const type = getTypeFromText(recommendation)

    if (type === 'traffic') return 'توصية مرورية'
    if (type === 'air') return 'توصية جودة الهواء'
    if (type === 'energy') return 'توصية الطاقة'
    if (type === 'water') return 'توصية المياه'
    if (type === 'security') return 'توصية السلامة العامة'

    return 'توصية تشغيلية'
  }

  const getLevel = (recommendation) => {
    const type = getTypeFromText(recommendation)

    if (type === 'traffic') return 'مرتفع'
    if (type === 'energy') return 'تنبيه'
    if (type === 'water') return 'تنبيه'
    if (type === 'security') return 'متابعة'
    if (type === 'air') return 'متوسط'

    return 'تحليل'
  }

  const getIcon = (recommendation) => {
    const type = getTypeFromText(recommendation)

    if (type === 'traffic') return <Car size={18} />
    if (type === 'air') return <Wind size={18} />
    if (type === 'energy') return <Zap size={18} />
    if (type === 'water') return <Droplets size={18} />
    if (type === 'security') return <ShieldCheck size={18} />

    return <Activity size={18} />
  }

  const getColor = (recommendation) => {
    const type = getTypeFromText(recommendation)

    if (type === 'traffic') return 'orange'
    if (type === 'energy') return 'yellow'
    if (type === 'security') return 'green'
    if (type === 'water') return 'cyan'
    if (type === 'air') return 'cyan'

    return 'cyan'
  }

  const getStyles = (color) => {
    if (color === 'orange') {
      return {
        border: 'border-orange-400/15',
        text: 'text-orange-300',
        bg: 'bg-orange-500/10',
        dot: 'bg-orange-400',
        iconBox: 'bg-orange-500/10 border-orange-400/20 text-orange-300',
        glow: 'rgba(255,138,0,0.10)'
      }
    }

    if (color === 'yellow') {
      return {
        border: 'border-yellow-400/15',
        text: 'text-yellow-300',
        bg: 'bg-yellow-500/10',
        dot: 'bg-yellow-400',
        iconBox: 'bg-yellow-500/10 border-yellow-400/20 text-yellow-300',
        glow: 'rgba(250,204,21,0.10)'
      }
    }

    if (color === 'green') {
      return {
        border: 'border-green-400/15',
        text: 'text-green-300',
        bg: 'bg-green-500/10',
        dot: 'bg-green-400',
        iconBox: 'bg-green-500/10 border-green-400/20 text-green-300',
        glow: 'rgba(74,222,128,0.10)'
      }
    }

    return {
      border: 'border-cyan-400/15',
      text: 'text-cyan-300',
      bg: 'bg-cyan-500/10',
      dot: 'bg-cyan-400',
      iconBox: 'bg-cyan-500/10 border-cyan-400/20 text-cyan-300',
      glow: 'rgba(0,230,255,0.10)'
    }
  }

  return (
    <div className="
      relative
      overflow-hidden
      bg-[#101827]/85
      border
      border-cyan-500/10
      rounded-3xl
      p-6
      backdrop-blur-xl
      transition
      duration-300
      hover:border-cyan-400/20
      hover:shadow-[0_0_45px_rgba(0,230,255,0.07)]
    ">

      <div className="
        absolute
        inset-0
        bg-[radial-gradient(circle_at_top_right,rgba(0,230,255,0.10),transparent_36%)]
      "></div>

      <div className="
        absolute
        top-0
        right-0
        h-[2px]
        w-32
        bg-cyan-400/60
      "></div>

      <div className="relative z-10">

        <div className="
          flex
          justify-between
          items-start
          mb-6
        ">

          <div className="flex items-center gap-3">

            <div className="
              w-12
              h-12
              rounded-2xl
              bg-cyan-500/10
              border
              border-cyan-400/20
              flex
              items-center
              justify-center
              text-cyan-300
            ">
              <BrainCircuit size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-black">
                تحليلات الذكاء الاصطناعي
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                توصيات تشغيلية مبنية على البيانات الحية
              </p>
            </div>

          </div>

          <button
            onClick={fetchRecommendations}
            disabled={loading}
            className="
              flex
              items-center
              gap-2
              bg-cyan-500/10
              border
              border-cyan-400/20
              text-cyan-300
              px-4
              py-2
              rounded-2xl
              text-sm
              transition
              hover:bg-cyan-500/15
              disabled:opacity-60
              disabled:cursor-not-allowed
            "
          >
            <RefreshCw
              size={15}
              className={loading ? 'animate-spin' : ''}
            />

            تحديث التحليل
          </button>

        </div>

        <div className="
          bg-[#08111F]/85
          border
          border-cyan-500/10
          rounded-3xl
          p-5
          mb-5
        ">

          <div className="
            flex
            justify-between
            items-center
          ">

            <div>
              <p className="text-gray-400 text-sm">
                مؤشر الذكاء التشغيلي
              </p>

              <div className="flex items-end gap-2 mt-2">

                <h3 className="
                  text-5xl
                  font-black
                  text-cyan-300
                  leading-none
                ">
                  {insights.length > 0 ? '97%' : '0%'}
                </h3>

                <span className="text-green-300 text-sm mb-1">
                  {insights.length > 0 ? 'Active' : 'Waiting'}
                </span>

              </div>
            </div>

            <div className="
              w-16
              h-16
              rounded-3xl
              bg-cyan-500/10
              border
              border-cyan-400/20
              flex
              items-center
              justify-center
              text-cyan-300
              shadow-[0_0_25px_rgba(0,230,255,0.10)]
            ">
              <Sparkles size={28} />
            </div>

          </div>

          <div className="
            h-[6px]
            bg-[#06101E]
            rounded-full
            overflow-hidden
            mt-5
          ">

            <div
              className="
                h-full
                bg-cyan-400
                rounded-full
                transition-all
                duration-500
              "
              style={{
                width: insights.length > 0 ? '97%' : '0%'
              }}
            ></div>

          </div>

          <div className="flex justify-between text-xs mt-3">
            <span className="text-gray-500">
              AI Recommendation Engine
            </span>

            <span className="text-cyan-300 font-bold">
              {loading ? 'Analyzing...' : 'Connected'}
            </span>
          </div>

        </div>

        {insights.length === 0 ? (
          <div className="
            bg-[#08111F]/85
            border
            border-cyan-500/10
            rounded-3xl
            p-6
            text-center
          ">
            <p className="text-cyan-300 font-bold">
              لا توجد توصيات ذكية حالياً
            </p>

            <p className="text-gray-500 text-sm mt-2">
              ستظهر التوصيات هنا بعد تحليل بيانات المدن.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

            {insights.map((item) => {
              const color = getColor(item.recommendation)
              const style = getStyles(color)

              return (
                <div
                  key={item.id}
                  className={`
                    group
                    relative
                    overflow-hidden
                    bg-[#08111F]/85
                    border
                    ${style.border}
                    rounded-3xl
                    p-5
                    transition
                    duration-300
                    hover:-translate-y-[2px]
                    hover:border-cyan-400/20
                  `}
                >

                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300"
                    style={{
                      background: `radial-gradient(circle at top right, ${style.glow}, transparent 42%)`
                    }}
                  ></div>

                  <div className="
                    relative
                    z-10
                    flex
                    items-start
                    justify-between
                    gap-4
                  ">

                    <div className="flex gap-4">

                      <div className={`
                        w-11
                        h-11
                        rounded-2xl
                        border
                        flex
                        items-center
                        justify-center
                        shrink-0
                        ${style.iconBox}
                      `}>
                        {getIcon(item.recommendation)}
                      </div>

                      <div>
                        <div className="
                          flex
                          items-center
                          gap-2
                        ">

                          <span className={`
                            w-2.5
                            h-2.5
                            rounded-full
                            ${style.dot}
                          `}></span>

                          <h3 className="
                            text-white
                            font-black
                            text-lg
                          ">
                            {getTitle(item.recommendation)}
                          </h3>

                        </div>

                        <p className="
                          text-gray-400
                          text-sm
                          leading-8
                          mt-4
                        ">
                          {item.recommendation}
                        </p>

                        <div className="
                          flex
                          items-center
                          gap-2
                          mt-4
                          text-xs
                          text-gray-500
                        ">

                          <TrendingUp size={13} />

                          {item.city_name || 'منطقة تشغيلية'} - تحليل لحظي
                        </div>
                      </div>

                    </div>

                    <div className={`
                      ${style.bg}
                      ${style.text}
                      border
                      ${style.border}
                      px-3
                      py-2
                      rounded-2xl
                      text-xs
                      whitespace-nowrap
                    `}>
                      {getLevel(item.recommendation)}
                    </div>

                  </div>

                </div>
              )
            })}

          </div>
        )}

      </div>

    </div>
  )
}

export default AIInsights