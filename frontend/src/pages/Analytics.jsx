import Navbar from '../components/Navbar'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

const data = [
  { day: 'Sat', ai: 35 },
  { day: 'Sun', ai: 48 },
  { day: 'Mon', ai: 52 },
  { day: 'Tue', ai: 61 },
  { day: 'Wed', ai: 72 },
  { day: 'Thu', ai: 90 },
]

function Analytics() {
  return (
    <div className="p-8">

      <Navbar />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <div className="
          xl:col-span-2
          bg-[#111827]/70
          border
          border-cyan-500/10
          rounded-3xl
          p-6
          backdrop-blur-xl
        ">

          <h2 className="text-2xl font-bold mb-6">
            تحليلات الذكاء الاصطناعي
          </h2>

          <ResponsiveContainer width="100%" height={400}>

            <AreaChart data={data}>

              <XAxis dataKey="day" stroke="#777" />

              <YAxis stroke="#777" />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="ai"
                stroke="#00E6FF"
                fill="#00E6FF33"
                strokeWidth={4}
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

        <div className="
          bg-[#111827]/70
          border
          border-cyan-500/10
          rounded-3xl
          p-6
          backdrop-blur-xl
        ">

          <h2 className="text-2xl font-bold mb-6">
            AI Insights
          </h2>

          <div className="space-y-4">

            <div className="bg-[#08111F] p-4 rounded-2xl">
              <p className="text-white">
                ارتفاع متوقع في المرور خلال 24 ساعة
              </p>
            </div>

            <div className="bg-[#08111F] p-4 rounded-2xl">
              <p className="text-white">
                تحسن جودة الهواء بنسبة 18%
              </p>
            </div>

            <div className="bg-[#08111F] p-4 rounded-2xl">
              <p className="text-white">
                الذكاء الاصطناعي رصد منطقة مزدحمة
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Analytics