import {
  Wind,
  Car,
  Zap,
  Droplets,
  ShieldCheck
} from 'lucide-react'

function StatCard({ title, value, color }) {
  const numberValue = Number(String(value).replace('%', '')) || 0

  const getIcon = () => {
    if (title.includes('الهواء')) return <Wind size={24} />
    if (title.includes('المرور')) return <Car size={24} />
    if (title.includes('الطاقة')) return <Zap size={24} />
    if (title.includes('المياه')) return <Droplets size={24} />
    if (title.includes('السلامة')) return <ShieldCheck size={24} />
    return <Wind size={24} />
  }

  const getStatusLabel = () => {
    if (title.includes('المرور')) {
      if (numberValue >= 80) return 'مرتفع'
      if (numberValue >= 65) return 'نشط'
      return 'مستقر'
    }

    if (numberValue >= 85) return 'ممتاز'
    if (numberValue >= 70) return 'مستقر'
    return 'متابعة'
  }

  const progressWidth =
    title.includes('جودة الهواء')
      ? Math.min(numberValue * 2, 100)
      : Math.min(numberValue, 100)

  return (
    <div className="
      group relative overflow-hidden bg-[#101827]/85 border border-cyan-500/10
      rounded-3xl p-5 h-[160px] backdrop-blur-xl transition duration-300
      hover:-translate-y-1 hover:border-cyan-400/25
      hover:shadow-[0_0_35px_rgba(0,230,255,0.08)]
    ">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,230,255,0.10),transparent_36%)]"></div>

      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start gap-4">
          <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <h2 className={`text-4xl font-black mt-3 ${color}`}>{value}</h2>
          </div>

          <div className="
            w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/15
            flex items-center justify-center text-cyan-300
            shadow-[0_0_22px_rgba(0,230,255,0.08)]
          ">
            {getIcon()}
          </div>
        </div>

        <div>
          <div className="h-[4px] bg-[#06101E] rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-cyan-400/80 rounded-full transition-all duration-500"
              style={{ width: `${progressWidth}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">PostgreSQL</span>
            <span className="text-cyan-300 font-bold">{getStatusLabel()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatCard