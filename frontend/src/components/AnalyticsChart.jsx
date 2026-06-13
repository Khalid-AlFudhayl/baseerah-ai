import { useEffect, useRef, useState } from 'react'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts'

import {
  Activity,
  Car,
  Wind,
  TrendingUp
} from 'lucide-react'

function AnalyticsChart({ chartData }) {
  const chartContainerRef = useRef(null)

  const [chartSize, setChartSize] = useState({
    width: 0,
    height: 0
  })

  const safeData =
    chartData && chartData.length > 0
      ? chartData
      : [
          { name: '00:00', traffic: 64, air: 42 },
          { name: '00:05', traffic: 71, air: 45 },
          { name: '00:10', traffic: 68, air: 43 },
          { name: '00:15', traffic: 79, air: 48 },
          { name: '00:20', traffic: 74, air: 44 }
        ]

  const latestData = safeData[safeData.length - 1]

  useEffect(() => {
    const element = chartContainerRef.current

    if (!element) return

    const updateChartSize = () => {
      const rect = element.getBoundingClientRect()

      setChartSize({
        width: Math.max(Math.floor(rect.width), 1),
        height: Math.max(Math.floor(rect.height), 1)
      })
    }

    updateChartSize()

    const observer = new ResizeObserver(updateChartSize)
    observer.observe(element)

    window.addEventListener('resize', updateChartSize)

    const timeout = setTimeout(updateChartSize, 100)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateChartSize)
      clearTimeout(timeout)
    }
  }, [])

  const chartIsReady = chartSize.width > 1 && chartSize.height > 1

  return (
    <div
      className="
        relative
        overflow-hidden
        bg-[#101827]/85
        border
        border-cyan-500/10
        rounded-3xl
        p-6
        h-[420px]
        backdrop-blur-xl
        transition
        duration-300
        hover:border-cyan-400/25
        hover:shadow-[0_0_45px_rgba(0,230,255,0.08)]
      "
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,230,255,0.12),transparent_35%)]"></div>
      <div className="absolute top-0 right-0 h-[2px] w-40 bg-cyan-400/60"></div>

      <div className="relative z-10 h-full flex flex-col min-w-0">
        <div className="flex justify-between items-start mb-5">
          <div>
            <div className="flex items-center gap-3">
              <div
                className="
                  w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-400/20
                  flex items-center justify-center text-cyan-300
                "
              >
                <Activity size={22} />
              </div>

              <div>
                <h2 className="text-2xl font-black">
                  التحليلات الحية
                </h2>

                <p className="text-gray-400 mt-1 text-sm">
                  قراءة تشغيلية مباشرة لمؤشرات المدينة
                </p>
              </div>
            </div>
          </div>

          <div
            className="
              flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20
              text-cyan-300 px-4 py-2 rounded-2xl text-xs
            "
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            LIVE AI ANALYTICS
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-[#08111F]/85 border border-orange-400/10 rounded-2xl px-4 py-3">
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-xs">المرور</p>
              <Car size={17} className="text-orange-300" />
            </div>

            <h3 className="text-2xl font-black text-orange-300 mt-2">
              {latestData.traffic}%
            </h3>
          </div>

          <div className="bg-[#08111F]/85 border border-cyan-400/10 rounded-2xl px-4 py-3">
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-xs">الهواء</p>
              <Wind size={17} className="text-cyan-300" />
            </div>

            <h3 className="text-2xl font-black text-cyan-300 mt-2">
              {latestData.air}
            </h3>
          </div>

          <div className="bg-[#08111F]/85 border border-green-400/10 rounded-2xl px-4 py-3">
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-xs">الاتجاه</p>
              <TrendingUp size={17} className="text-green-300" />
            </div>

            <h3 className="text-lg font-black text-green-300 mt-3">
              مستقر
            </h3>
          </div>
        </div>

        <div
          className="
            relative
            rounded-3xl
            border
            border-cyan-500/10
            bg-[#06101E]/70
            p-3
            overflow-hidden
            h-[205px]
            min-h-[205px]
            w-full
            min-w-0
          "
        >
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,230,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,230,255,0.035)_1px,transparent_1px)] bg-[size:36px_36px]"></div>

          <div
            ref={chartContainerRef}
            className="relative z-10 w-full h-full min-w-0 overflow-hidden"
          >
            {chartIsReady ? (
              <AreaChart
                width={chartSize.width}
                height={chartSize.height}
                data={safeData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -15,
                  bottom: 0
                }}
              >
                <defs>
                  <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF8A00" stopOpacity={0.35} />
                    <stop offset="80%" stopColor="#FF8A00" stopOpacity={0.02} />
                  </linearGradient>

                  <linearGradient id="airGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00E6FF" stopOpacity={0.35} />
                    <stop offset="80%" stopColor="#00E6FF" stopOpacity={0.02} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="rgba(0,230,255,0.06)"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fill: '#64748B',
                    fontSize: 10
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fill: '#64748B',
                    fontSize: 10
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    background: '#07111F',
                    border: '1px solid rgba(0,230,255,0.2)',
                    borderRadius: '18px',
                    color: '#fff',
                    boxShadow: '0 0 35px rgba(0,230,255,0.12)'
                  }}
                  labelStyle={{
                    color: '#67E8F9'
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="traffic"
                  name="حركة المرور"
                  stroke="#FF8A00"
                  strokeWidth={3}
                  fill="url(#trafficGradient)"
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: '#FF8A00',
                    stroke: '#06101E',
                    strokeWidth: 3
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="air"
                  name="جودة الهواء"
                  stroke="#00E6FF"
                  strokeWidth={3}
                  fill="url(#airGradient)"
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: '#00E6FF',
                    stroke: '#06101E',
                    strokeWidth: 3
                  }}
                />
              </AreaChart>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-cyan-300 text-sm">
                جاري تحميل الرسم البياني...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsChart