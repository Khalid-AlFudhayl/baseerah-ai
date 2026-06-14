function Settings() {

  const cards = [
    {
      title: 'حالة الخادم',
      value: 'متصل',
      status: 'ACTIVE',
      color: 'text-green-300',
      border: 'border-green-400/20',
      bg: 'bg-green-500/10',
      description: 'الخادم الرئيسي يعمل بشكل مستقر'
    },
    {
      title: 'قاعدة البيانات',
      value: 'PostgreSQL',
      status: 'ONLINE',
      color: 'text-cyan-300',
      border: 'border-cyan-400/20',
      bg: 'bg-cyan-500/10',
      description: 'الاتصال بقاعدة البيانات مفعل'
    },
    {
      title: 'محرك الذكاء الاصطناعي',
      value: 'نشط',
      status: 'AI READY',
      color: 'text-purple-300',
      border: 'border-purple-400/20',
      bg: 'bg-purple-500/10',
      description: 'التحليل والتوصيات الذكية جاهزة'
    },
    {
      title: 'التحديث المباشر',
      value: 'الآن',
      status: 'LIVE',
      color: 'text-orange-300',
      border: 'border-orange-400/20',
      bg: 'bg-orange-500/10',
      description: 'يتم تحديث البيانات بشكل لحظي'
    }
  ]

  return (
    <section className="mb-8 space-y-6">

      <div className="
        relative
        overflow-hidden
        bg-[#101827]/85
        border
        border-cyan-500/10
        rounded-3xl
        p-8
        backdrop-blur-xl
      ">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,230,255,0.10),transparent_35%)]"></div>
        <div className="absolute top-0 right-0 h-[2px] w-40 bg-cyan-400/60"></div>

        <div className="relative z-10 flex justify-between items-start gap-6">

          <div>
            <h1 className="text-4xl font-black">
              إعدادات النظام
            </h1>

            <p className="text-gray-400 mt-4 leading-8 max-w-3xl">
              مركز التحكم الخاص بمنصة بصيرة لإدارة الأنظمة الذكية، مراقبة الاتصال،
              والتحكم بالبنية التشغيلية للمدينة الرقمية.
            </p>
          </div>

          <div className="
            bg-cyan-500/10
            border
            border-cyan-400/20
            text-cyan-300
            px-5
            py-3
            rounded-2xl
            text-sm
            whitespace-nowrap
          ">
            SYSTEM CONTROL
          </div>

        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        {cards.map((card, index) => (

          <div
            key={index}
            className="
              relative
              overflow-hidden
              bg-[#101827]/85
              border
              border-cyan-500/10
              rounded-3xl
              p-5
              backdrop-blur-xl
              transition
              duration-300
              hover:border-cyan-400/20
              hover:-translate-y-[2px]
            "
          >

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,230,255,0.08),transparent_40%)]"></div>

            <div className="relative z-10">

              <div className={`
                inline-flex
                px-3
                py-2
                rounded-2xl
                border
                text-xs
                mb-5
                ${card.bg}
                ${card.border}
                ${card.color}
              `}>
                {card.status}
              </div>

              <p className="text-gray-400 text-sm">
                {card.title}
              </p>

              <h3 className={`text-3xl font-black mt-3 ${card.color}`}>
                {card.value}
              </h3>

              <p className="text-gray-500 text-sm leading-7 mt-4">
                {card.description}
              </p>

            </div>

          </div>

        ))}

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <div className="
          bg-[#101827]/85
          border
          border-cyan-500/10
          rounded-3xl
          p-6
          backdrop-blur-xl
        ">

          <h2 className="text-2xl font-black">
            إعدادات الذكاء الاصطناعي
          </h2>

          <div className="space-y-5 mt-6">

            <div className="flex justify-between items-center bg-[#08111F]/85 border border-cyan-500/10 rounded-2xl p-4">
              <div>
                <p className="text-white font-bold">
                  التحليل التنبؤي
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  توقع الازدحام والحركة المستقبلية
                </p>
              </div>

              <div className="bg-green-500/10 border border-green-400/20 text-green-300 px-4 py-2 rounded-2xl text-sm">
                مفعل
              </div>
            </div>

            <div className="flex justify-between items-center bg-[#08111F]/85 border border-cyan-500/10 rounded-2xl p-4">
              <div>
                <p className="text-white font-bold">
                  التوصيات الذكية
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  اقتراح حلول تشغيلية لحظية
                </p>
              </div>

              <div className="bg-green-500/10 border border-green-400/20 text-green-300 px-4 py-2 rounded-2xl text-sm">
                مفعل
              </div>
            </div>

          </div>

        </div>

        <div className="
          bg-[#101827]/85
          border
          border-cyan-500/10
          rounded-3xl
          p-6
          backdrop-blur-xl
        ">

          <h2 className="text-2xl font-black">
            معلومات النظام
          </h2>

          <div className="space-y-4 mt-6">

            <div className="flex justify-between">
              <span className="text-gray-400">الإصدار</span>
              <span className="text-white font-bold">Baseerah AI v1.0</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">المطور</span>
              <span className="text-cyan-300 font-bold">Khalid AlFudhayl</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">البيئة التشغيلية</span>
              <span className="text-cyan-300 font-bold">Development</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">التحديث الأخير</span>
              <span className="text-white font-bold">الآن</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">المدينة المستهدفة</span>
              <span className="text-white font-bold">أبها</span>
            </div>

          </div>

        </div>

      </div>

    </section>
  )
}

export default Settings