import { useState } from 'react'
import logo from '../assets/baseerah-logo.png'

import {
  LockKeyhole,
  Mail,
  ShieldCheck,
  Radio,
  Sparkles
} from 'lucide-react'

function Login({ onLogin }) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()

    if (
      email === 'admin@baseerah.ai' &&
      password === '123456'
    ) {
      localStorage.setItem('isLoggedIn', 'true')
      onLogin()
    } else {
      alert('بيانات الدخول غير صحيحة')
    }
  }

  return (
    <div className="
      min-h-screen
      relative
      overflow-hidden
      bg-[#050B14]
      text-white
      flex
      items-center
      justify-center
      p-6
    ">

      <div
        className="
          absolute
          inset-0
          bg-cover
          bg-center
          opacity-35
        "
        style={{
          backgroundImage: "url('/abha-hero.jpg')"
        }}
      ></div>

      <div className="absolute inset-0 bg-[#050B14]/80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,230,255,0.18),transparent_32%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,200,150,0.12),transparent_35%)]"></div>

      <div className="
        absolute
        inset-0
        opacity-25
        bg-[linear-gradient(rgba(0,230,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(0,230,255,0.07)_1px,transparent_1px)]
        bg-[size:52px_52px]
      "></div>

      <div className="
        relative
        z-10
        w-full
        max-w-[1040px]
        grid
        grid-cols-1
        xl:grid-cols-2
        gap-6
        items-stretch
      ">

        <div className="
          hidden
          xl:flex
          relative
          overflow-hidden
          rounded-[2rem]
          border
          border-cyan-500/10
          bg-[#101827]/70
          backdrop-blur-xl
          p-8
          min-h-[620px]
        ">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,230,255,0.14),transparent_34%)]"></div>
          <div className="absolute top-0 right-0 h-[2px] w-44 bg-cyan-400/60"></div>

          <div className="
            relative
            z-10
            flex
            flex-col
            justify-between
            w-full
          ">

            <div>

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
              ">
                <Radio size={14} />
                SYSTEM ONLINE
              </div>

              <h1 className="
                text-6xl
                font-black
                leading-tight
                mt-8
              ">
                بصيرة
                <br />
                Baseerah AI
              </h1>

              <p className="
                text-gray-300
                text-lg
                leading-9
                mt-6
                max-w-md
              ">
                منصة التوأم الرقمي الذكي لمدينة أبها، لمراقبة المؤشرات
                الحضرية وتحليل البيانات التشغيلية باستخدام الذكاء الاصطناعي.
              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <div className="
                bg-[#08111F]/80
                border
                border-cyan-500/10
                rounded-3xl
                p-5
              ">
                <p className="text-gray-400 text-sm">
                  AI Engine
                </p>

                <h3 className="text-cyan-300 text-2xl font-black mt-2">
                  Active
                </h3>
              </div>

              <div className="
                bg-[#08111F]/80
                border
                border-green-500/10
                rounded-3xl
                p-5
              ">
                <p className="text-gray-400 text-sm">
                  Digital Twin
                </p>

                <h3 className="text-green-300 text-2xl font-black mt-2">
                  Ready
                </h3>
              </div>

            </div>

          </div>

        </div>

        <div className="
          relative
          overflow-hidden
          bg-[#101827]/85
          border
          border-cyan-500/15
          rounded-[2rem]
          p-8
          backdrop-blur-xl
          shadow-[0_0_80px_rgba(0,230,255,0.12)]
        ">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,230,255,0.12),transparent_36%)]"></div>
          <div className="absolute top-0 right-0 h-[2px] w-40 bg-cyan-400/60"></div>

          <div className="relative z-10">

            <div className="text-center mb-8">

              <img
                src={logo}
                alt="Baseerah AI"
                className="
                  w-28
                  h-28
                  mx-auto
                  object-contain
                  mix-blend-screen
                  drop-shadow-[0_0_35px_rgba(0,230,255,0.45)]
                "
              />

              <h1 className="text-5xl font-black mt-3">
                بصيرة
              </h1>

              <p className="text-cyan-400 mt-3 tracking-[0.35em] text-sm">
                BASEERAH AI
              </p>

              <p className="text-gray-400 mt-5 leading-7">
                تسجيل الدخول إلى لوحة التحكم التشغيلية
              </p>

            </div>

            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              <div className="
                flex
                items-center
                gap-3
                bg-[#08111F]/90
                border
                border-cyan-500/10
                rounded-2xl
                px-4
                focus-within:border-cyan-400/40
                transition
              ">

                <Mail size={18} className="text-cyan-300" />

                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                    w-full
                    bg-transparent
                    py-4
                    outline-none
                    text-white
                    placeholder:text-gray-500
                  "
                />

              </div>

              <div className="
                flex
                items-center
                gap-3
                bg-[#08111F]/90
                border
                border-cyan-500/10
                rounded-2xl
                px-4
                focus-within:border-cyan-400/40
                transition
              ">

                <LockKeyhole size={18} className="text-cyan-300" />

                <input
                  type="password"
                  placeholder="كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full
                    bg-transparent
                    py-4
                    outline-none
                    text-white
                    placeholder:text-gray-500
                  "
                />

              </div>

              <button
                type="submit"
                className="
                  w-full
                  bg-cyan-400
                  hover:bg-cyan-300
                  transition
                  rounded-2xl
                  p-4
                  font-black
                  text-black
                  shadow-[0_0_35px_rgba(0,230,255,0.25)]
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                <ShieldCheck size={18} />
                تسجيل الدخول
              </button>

            </form>

            <div className="
              mt-6
              bg-[#08111F]/75
              border
              border-cyan-500/10
              rounded-2xl
              p-4
            ">

              <div className="flex items-center gap-3">

                <div className="
                  w-10
                  h-10
                  rounded-2xl
                  bg-cyan-500/10
                  border
                  border-cyan-400/20
                  flex
                  items-center
                  justify-center
                  text-cyan-300
                ">
                  <Sparkles size={18} />
                </div>

                <div>
                  <p className="text-gray-400 text-sm">
                    Demo Access
                  </p>

                  <p className="text-cyan-300 text-sm mt-1">
                    admin@baseerah.ai / 123456
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Login