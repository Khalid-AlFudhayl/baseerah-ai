import {
  BrainCircuit,
  Car,
  Wind,
  Zap,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  RefreshCw
} from 'lucide-react'

function AIInsights() {

  const insights = [
    {
      title: 'تحليل مروري',
      description:
        'تم رصد ارتفاع تدريجي في الحركة المرورية حول طريق الملك فهد خلال آخر 30 دقيقة.',
      level: 'متوسط',
      color: 'orange',
      icon: <Car size={18} />
    },
    {
      title: 'جودة الهواء',
      description:
        'مؤشرات جودة الهواء مستقرة داخل نطاق أبها مع تحسن بنسبة 12٪ مقارنة بالأمس.',
      level: 'مستقر',
      color: 'cyan',
      icon: <Wind size={18} />
    },
    {
      title: 'استهلاك الطاقة',
      description:
        'النظام يتوقع ارتفاعًا في استهلاك الطاقة خلال ساعات الذروة المسائية.',
      level: 'تنبيه',
      color: 'yellow',
      icon: <Zap size={18} />
    },
    {
      title: 'السلامة العامة',
      description:
        'جميع أنظمة المراقبة والسلامة تعمل ضمن المعدلات الطبيعية.',
      level: 'ممتاز',
      color: 'green',
      icon: <ShieldCheck size={18} />
    }
  ]

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

          <button className="
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
          ">

            <RefreshCw size={15} />

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
                  97%
                </h3>

                <span className="text-green-300 text-sm mb-1">
                  ممتاز
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

            <div className="
              h-full
              w-[97%]
              bg-cyan-400
              rounded-full
            "></div>

          </div>

          <div className="flex justify-between text-xs mt-3">

            <span className="text-gray-500">
              AI Prediction Engine
            </span>

            <span className="text-cyan-300 font-bold">
              Active
            </span>

          </div>

        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

          {insights.map((item, index) => {

            const style =
              getStyles(item.color)

            return (

              <div
                key={index}
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
                      {item.icon}
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
                          {item.title}
                        </h3>

                      </div>

                      <p className="
                        text-gray-400
                        text-sm
                        leading-8
                        mt-4
                      ">
                        {item.description}
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

                        تحديث لحظي من محرك الذكاء الاصطناعي

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
                    {item.level}
                  </div>

                </div>

              </div>

            )

          })}

        </div>

      </div>

    </div>
  )
}

export default AIInsights