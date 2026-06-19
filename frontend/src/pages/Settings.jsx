function Settings() {
  const WEB_DASHBOARD_URL = 'https://baseerah-ai-ten.vercel.app'

  const MOBILE_APP_URL = 'exp://piupolu-khalid-alfudhil-8082.exp.direct'

  const hasMobileAppUrl = MOBILE_APP_URL.trim().length > 0

  const qrCodeUrl = hasMobileAppUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(MOBILE_APP_URL)}`
    : ''

  const cards = [
    {
      title: 'حالة الخادم',
      value: 'متصل',
      status: 'ACTIVE',
      color: 'text-green-300',
      border: 'border-green-400/20',
      bg: 'bg-green-500/10',
      description: 'الخادم الرئيسي يعمل بشكل مستقر',
    },
    {
      title: 'قاعدة البيانات',
      value: 'PostgreSQL',
      status: 'ONLINE',
      color: 'text-cyan-300',
      border: 'border-cyan-400/20',
      bg: 'bg-cyan-500/10',
      description: 'الاتصال بقاعدة البيانات مفعل',
    },
    {
      title: 'محرك الذكاء الاصطناعي',
      value: 'نشط',
      status: 'AI READY',
      color: 'text-purple-300',
      border: 'border-purple-400/20',
      bg: 'bg-purple-500/10',
      description: 'التحليل والتوصيات الذكية جاهزة',
    },
    {
      title: 'التحديث المباشر',
      value: 'الآن',
      status: 'LIVE',
      color: 'text-orange-300',
      border: 'border-orange-400/20',
      bg: 'bg-orange-500/10',
      description: 'يتم تحديث البيانات بشكل لحظي',
    },
  ]

  const mobileSteps = [
  <>
    حمّل تطبيق <span dir="ltr" className="inline-block">Expo Go</span> على الجوال.
  </>,
  <>
    افتح الرابط أو امسح رمز <span dir="ltr" className="inline-block">QR</span>.
  </>,
  <>
    إذا ظهرت صفحة <span dir="ltr" className="inline-block">Expo</span> اضغط زر <span dir="ltr" className="inline-block">Open in Expo Go</span>.
  </>,
  <>
    بعد فتح التطبيق ستظهر نسخة <span dir="ltr" className="inline-block">Baseerah AI</span> للجوال.
  </>,
]

  return (
    <section className="mb-8 space-y-6">
      <div
        className="
          relative
          overflow-hidden
          bg-[#101827]/85
          border
          border-cyan-500/10
          rounded-3xl
          p-8
          backdrop-blur-xl
        "
      >
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

          <div
            className="
              bg-cyan-500/10
              border
              border-cyan-400/20
              text-cyan-300
              px-5
              py-3
              rounded-2xl
              text-sm
              whitespace-nowrap
            "
          >
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
              <div
                className={`
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
                `}
              >
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

      <div
        className="
          relative
          overflow-hidden
          bg-[#101827]/85
          border
          border-cyan-500/10
          rounded-3xl
          p-6
          backdrop-blur-xl
        "
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,230,255,0.10),transparent_35%)]"></div>
        <div className="absolute bottom-0 left-0 h-[2px] w-44 bg-cyan-400/50"></div>

        <div className="relative z-10 grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
          <div>
            <div
              className="
                inline-flex
                px-4
                py-2
                rounded-2xl
                border
                border-cyan-400/20
                bg-cyan-500/10
                text-cyan-300
                text-xs
                mb-5
              "
            >
              MOBILE APP
            </div>

            <h2 className="text-3xl font-black">
              تطبيق بصيرة للجوال
            </h2>

            <p dir="rtl" className="text-gray-400 mt-4 leading-8 max-w-3xl text-right">
             يمكن تجربة تطبيق <span dir="ltr" className="inline-block">Baseerah AI</span> للجوال عبر تطبيق <span dir="ltr" className="inline-block">Expo Go</span>. هذه نسخة تجريبية تعمل أثناء تشغيل خادم <span dir="ltr" className="inline-block">Expo</span> الخاص بالمشروع.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
              {mobileSteps.map((step, index) => (
                <div
                  key={index}
                  className="
                    flex
                    gap-3
                    items-start
                    bg-[#08111F]/85
                    border
                    border-cyan-500/10
                    rounded-2xl
                    p-4
                  "
                >
                  <div
                    className="
                      w-8
                      h-8
                      rounded-xl
                      bg-cyan-500/10
                      border
                      border-cyan-400/20
                      text-cyan-300
                      flex
                      items-center
                      justify-center
                      text-sm
                      font-black
                      shrink-0
                    "
                  >
                    {index + 1}
                  </div>

                  <p dir="rtl" className="text-gray-300 text-sm leading-7 text-right">
                  {step}
                   </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              {hasMobileAppUrl ? (
                <a
                  href={MOBILE_APP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    bg-cyan-400
                    text-[#03111F]
                    px-6
                    py-3
                    rounded-2xl
                    font-black
                    transition
                    hover:bg-cyan-300
                  "
                >
                  فتح تطبيق الجوال
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="
                    bg-gray-700/60
                    text-gray-400
                    px-6
                    py-3
                    rounded-2xl
                    font-black
                    cursor-not-allowed
                  "
                >
                  أضف رابط Expo أولاً
                </button>
              )}

              <a
                href={WEB_DASHBOARD_URL}
                target="_blank"
                rel="noreferrer"
                className="
                  bg-[#08111F]
                  border
                  border-cyan-500/20
                  text-cyan-300
                  px-6
                  py-3
                  rounded-2xl
                  font-black
                  transition
                  hover:border-cyan-400/40
                "
              >
                فتح لوحة الويب
              </a>
            </div>

            <p className="text-gray-500 text-xs mt-5 break-all">
             {hasMobileAppUrl
             ? 'ملاحظة: رابط التطبيق التجريبي يعمل أثناء تشغيل خادم Expo من جهاز المطور.'
              : 'لم يتم إضافة رابط Expo بعد. ضع الرابط داخل MOBILE_APP_URL في ملف Settings.jsx'}
            </p>
          </div>

          <div
            className="
              bg-[#08111F]/90
              border
              border-cyan-500/10
              rounded-3xl
              p-6
              flex
              flex-col
              items-center
              justify-center
              min-h-[310px]
            "
          >
            {hasMobileAppUrl ? (
              <>
                <div className="bg-white p-4 rounded-3xl">
                  <img
                    src={qrCodeUrl}
                    alt="Baseerah AI Mobile App QR Code"
                    className="w-[220px] h-[220px]"
                  />
                </div>

                <p className="text-gray-400 text-sm mt-5 text-center leading-7">
                  امسح الرمز بالجوال لفتح تطبيق بصيرة عبر Expo Go.
                </p>
              </>
            ) : (
              <>
                <div
                  className="
                    w-[220px]
                    h-[220px]
                    rounded-3xl
                    border
                    border-dashed
                    border-cyan-400/25
                    bg-cyan-500/5
                    flex
                    items-center
                    justify-center
                    text-center
                    p-6
                  "
                >
                  <p className="text-cyan-300 font-bold leading-8">
                    QR Code سيظهر هنا بعد إضافة رابط Expo
                  </p>
                </div>

                <p className="text-gray-500 text-sm mt-5 text-center leading-7">
                  جهّز رابط Expo النهائي ثم ضعه في متغير MOBILE_APP_URL.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div
          className="
            bg-[#101827]/85
            border
            border-cyan-500/10
            rounded-3xl
            p-6
            backdrop-blur-xl
          "
        >
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

        <div
          className="
            bg-[#101827]/85
            border
            border-cyan-500/10
            rounded-3xl
            p-6
            backdrop-blur-xl
          "
        >
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

            <div className="flex justify-between">
              <span className="text-gray-400">تطبيق الجوال</span>
              <span className="text-cyan-300 font-bold">
                Expo Go Preview
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Settings