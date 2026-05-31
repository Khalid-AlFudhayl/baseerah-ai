import {
  Server,
  Car,
  Wind,
  Zap,
  Droplets,
  ShieldCheck,
  Radio
} from 'lucide-react'

function SystemStatus() {

  const systems = [
    {
      name: 'المرور الذكي',
      value: 92,
      color: 'bg-cyan-400',
      icon: <Car size={17} />,
      theme: 'text-cyan-300 bg-cyan-500/10 border-cyan-400/20'
    },
    {
      name: 'جودة الهواء',
      value: 84,
      color: 'bg-green-400',
      icon: <Wind size={17} />,
      theme: 'text-green-300 bg-green-500/10 border-green-400/20'
    },
    {
      name: 'الطاقة',
      value: 71,
      color: 'bg-yellow-400',
      icon: <Zap size={17} />,
      theme: 'text-yellow-300 bg-yellow-500/10 border-yellow-400/20'
    },
    {
      name: 'المياه',
      value: 63,
      color: 'bg-blue-400',
      icon: <Droplets size={17} />,
      theme: 'text-blue-300 bg-blue-500/10 border-blue-400/20'
    },
    {
      name: 'الأمان والسلامة',
      value: 96,
      color: 'bg-emerald-400',
      icon: <ShieldCheck size={17} />,
      theme: 'text-emerald-300 bg-emerald-500/10 border-emerald-400/20'
    }
  ]

  return (
    <div className="
      relative
      overflow-hidden
      bg-[#101827]/85
      border
      border-cyan-500/10
      rounded-3xl
      p-5
      h-[560px]
      backdrop-blur-xl
      transition
      duration-300
      hover:border-cyan-400/25
      hover:shadow-[0_0_45px_rgba(0,230,255,0.07)]
    ">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,230,255,0.10),transparent_36%)]"></div>
      <div className="absolute top-0 right-0 h-[2px] w-28 bg-cyan-400/60"></div>

      <div className="relative z-10 h-full flex flex-col">

        <div className="flex justify-between items-start mb-5">

          <div className="flex items-center gap-3">

            <div className="
              w-11
              h-11
              rounded-2xl
              bg-cyan-500/10
              border
              border-cyan-400/20
              flex
              items-center
              justify-center
              text-cyan-300
            ">
              <Server size={22} />
            </div>

            <div>
              <h2 className="text-xl font-black">
                حالة الأنظمة
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                المؤشرات التشغيلية الحالية
              </p>
            </div>

          </div>

          <div className="
            flex
            items-center
            gap-2
            bg-green-500/10
            border
            border-green-400/20
            text-green-300
            px-3
            py-2
            rounded-2xl
            text-xs
          ">
            <Radio size={13} />
            ONLINE
          </div>

        </div>

        <div className="
          relative
          overflow-hidden
          bg-[#08111F]/85
          border
          border-cyan-500/10
          rounded-3xl
          p-5
          mb-4
        ">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,230,255,0.12),transparent_42%)]"></div>

          <div className="relative z-10">

            <div className="flex justify-between items-center mb-5">

              <div>
                <p className="text-gray-400 text-sm">
                  أداء النظام العام
                </p>

                <div className="flex items-end gap-2 mt-2">
                  <h3 className="
                    text-5xl
                    font-black
                    text-cyan-300
                    leading-none
                  ">
                    94%
                  </h3>

                  <span className="text-green-300 text-sm mb-1">
                    مستقر
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
                <Server size={28} />
              </div>

            </div>

            <div className="
              h-[6px]
              bg-[#06101E]
              rounded-full
              overflow-hidden
            ">
              <div className="
                h-full
                w-[94%]
                bg-cyan-400
                rounded-full
              "></div>
            </div>

            <div className="flex justify-between text-xs mt-3">
              <span className="text-gray-500">
                Health Score
              </span>

              <span className="text-cyan-300 font-bold">
                Operational
              </span>
            </div>

          </div>

        </div>

        <div className="
          flex-1
          space-y-3
          overflow-y-auto
          pr-2
          [scrollbar-width:thin]
          [scrollbar-color:#00E6FF20_transparent]
          [&::-webkit-scrollbar]:w-[6px]
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-cyan-400/20
          [&::-webkit-scrollbar-thumb]:rounded-full
          hover:[&::-webkit-scrollbar-thumb]:bg-cyan-400/40
        ">

          {systems.map((system, index) => (

            <div
              key={index}
              className="
                group
                bg-[#08111F]/85
                border
                border-cyan-500/10
                rounded-2xl
                p-4
                transition
                duration-300
                hover:-translate-y-[2px]
                hover:border-cyan-400/20
              "
            >

              <div className="flex items-center justify-between mb-3">

                <div className="flex items-center gap-3">

                  <div className={`
                    w-9
                    h-9
                    rounded-2xl
                    border
                    flex
                    items-center
                    justify-center
                    ${system.theme}
                  `}>
                    {system.icon}
                  </div>

                  <p className="text-white text-sm font-bold">
                    {system.name}
                  </p>

                </div>

                <p className="text-gray-300 text-sm font-bold">
                  {system.value}%
                </p>

              </div>

              <div className="
                h-[5px]
                bg-[#06101E]
                rounded-full
                overflow-hidden
              ">
                <div
                  className={`
                    h-full
                    rounded-full
                    transition-all
                    duration-500
                    ${system.color}
                  `}
                  style={{
                    width: `${system.value}%`
                  }}
                ></div>
              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  )
}

export default SystemStatus