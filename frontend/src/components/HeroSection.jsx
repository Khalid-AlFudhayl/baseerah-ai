import logo from '../assets/baseerah-logo.png'

function HeroSection() {

  return (
    <div className="
      relative
      overflow-hidden
      rounded-[2rem]
      border
      border-cyan-400/20
      h-[430px]
      mb-8
      bg-[#07111F]
      shadow-[0_0_70px_rgba(0,230,255,0.08)]
    ">

      <div
        className="
          absolute
          inset-0
          bg-cover
          bg-center
          opacity-100
          scale-100
        "
        style={{
          backgroundImage: "url('/abha-hero.jpg')"
        }}
      ></div>

      <div className="
        absolute
        inset-0
        bg-gradient-to-l
        from-[#050B14]/72
        via-[#07111F]/30
        to-transparent
      "></div>

      <div className="
        absolute
        inset-0
        bg-gradient-to-t
        from-[#050B14]/76
        via-transparent
        to-transparent
      "></div>

      <div className="
        absolute
        inset-0
        bg-[radial-gradient(circle_at_top_right,rgba(0,230,255,0.14),transparent_24%)]
      "></div>

      <div className="
        relative
        z-10
        h-full
        grid
        grid-cols-1
        xl:grid-cols-2
        gap-8
        items-center
        px-11
      ">

        <div className="max-w-xl">

          <div className="
            inline-flex
            items-center
            gap-2
            bg-green-500/10
            border
            border-green-400/20
            text-green-300
            px-4
            py-2
            rounded-2xl
            text-sm
            mb-6
            backdrop-blur-xl
            shadow-[0_0_25px_rgba(0,200,150,0.08)]
          ">

            <span className="
              w-2
              h-2
              rounded-full
              bg-green-400
              animate-pulse
            "></span>

            داعمة لك

          </div>

          <p className="
            text-cyan-400
            text-sm
            tracking-[0.35em]
            mb-4
          ">
            BASEERAH AI
          </p>

          <h2 className="
            text-7xl
            font-black
            text-white
            leading-none
            drop-shadow-[0_0_25px_rgba(0,0,0,0.45)]
          ">
            أبها
          </h2>

          <p className="
            text-cyan-100
            text-2xl
            mt-4
            font-medium
          ">
            مدينة الضباب
          </p>

          <p className="
            text-gray-200
            text-lg
            leading-9
            mt-7
            max-w-xl
          ">
            منصة ذكاء اصطناعي وتوأم رقمي لمراقبة المؤشرات
            الحضرية وتحليل البيانات التشغيلية لدعم اتخاذ القرار.
          </p>

          <div className="flex gap-3 mt-8">

            <div className="
              bg-cyan-500/10
              border
              border-cyan-400/20
              text-cyan-300
              px-5
              py-3
              rounded-2xl
              text-sm
              backdrop-blur-xl
              shadow-[0_0_20px_rgba(0,230,255,0.08)]
            ">
              AI Monitoring
            </div>

            <div className="
              bg-green-500/10
              border
              border-green-400/20
              text-green-300
              px-5
              py-3
              rounded-2xl
              text-sm
              backdrop-blur-xl
              shadow-[0_0_20px_rgba(0,200,150,0.08)]
            ">
              Digital Twin
            </div>

          </div>

        </div>

        <div className="
          hidden
          xl:flex
          relative
          h-full
          items-center
          justify-center
        ">

          <div className="
            absolute
            w-[350px]
            h-[350px]
            rounded-full
            bg-cyan-400/12
            blur-3xl
          "></div>

          <div className="
            absolute
            w-[420px]
            h-[420px]
            rounded-full
            border
            border-cyan-400/10
          "></div>

          <div className="
            absolute
            w-[520px]
            h-[520px]
            rounded-full
            border
            border-cyan-400/5
          "></div>

          <img
            src={logo}
            alt="Baseerah AI"
            className="
              relative
              z-10
              w-[330px]
              max-h-[330px]
              object-contain
              mix-blend-screen
              opacity-95
              drop-shadow-[0_0_70px_rgba(0,230,255,0.65)]
            "
          />

          <div className="
            absolute
            top-8
            right-6
            bg-black/30
            backdrop-blur-xl
            border
            border-cyan-400/10
            rounded-2xl
            px-5
            py-3
            shadow-[0_0_30px_rgba(0,230,255,0.06)]
          ">

            <p className="text-gray-400 text-xs">
              AI CORE
            </p>

            <p className="text-cyan-300 font-black mt-1">
              ACTIVE
            </p>

          </div>

          <div className="
            absolute
            bottom-8
            left-6
            bg-black/30
            backdrop-blur-xl
            border
            border-green-400/10
            rounded-2xl
            px-5
            py-3
            shadow-[0_0_30px_rgba(0,200,150,0.06)]
          ">

            <p className="text-gray-400 text-xs">
              SYSTEM STATUS
            </p>

            <p className="text-green-300 font-black mt-1">
              OPERATIONAL
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}

export default HeroSection