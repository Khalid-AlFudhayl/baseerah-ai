import { useState } from 'react'
import API from '../services/api'

import {
  BrainCircuit,
  SendHorizonal,
  Sparkles,
  User,
  Bot,
  Radio,
  LoaderCircle
} from 'lucide-react'

function AIAssistant() {

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text:
        'مرحبًا، أنا مساعد بصيرة الذكي. أستطيع مساعدتك في تحليل المرور، جودة الهواء، الطاقة، المياه، والتنبيهات التشغيلية داخل مدينة أبها.'
    }
  ])

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {

    if (!input.trim()) return

    const currentInput = input

    const userMessage = {
      sender: 'user',
      text: currentInput
    }

    setMessages((prev) => [
      ...prev,
      userMessage
    ])

    setInput('')
    setLoading(true)

    try {

      const response = await API.post('/ai', {
  message: currentInput
})

const data = response.data

      const aiMessage = {
        sender: 'ai',
        text:
          data.reply ||
          'لم يتم استلام رد من خدمة الذكاء الاصطناعي.'
      }

      setMessages((prev) => [
        ...prev,
        aiMessage
      ])

    } catch (error) {

      console.log(error)

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text:
            'حدث خطأ أثناء الاتصال بخدمة الذكاء الاصطناعي.'
        }
      ])

    }

    setLoading(false)

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
        bg-[radial-gradient(circle_at_top_right,rgba(0,230,255,0.10),transparent_38%)]
      "></div>

      <div className="
        absolute
        top-0
        right-0
        h-[2px]
        w-36
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

              <h2 className="text-3xl font-black">
                مساعد بصيرة الذكي
              </h2>

              <p className="text-gray-400 mt-1 text-sm">
                تحليل وتشغيل ذكي لبيانات مدينة أبها
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
            px-4
            py-2
            rounded-2xl
            text-sm
          ">

            <Radio size={14} />

            AI ACTIVE

          </div>

        </div>

        <div className="
          bg-[#08111F]/85
          border
          border-cyan-500/10
          rounded-3xl
          p-5
          h-[480px]
          overflow-y-auto
          space-y-5

          [scrollbar-width:thin]
          [scrollbar-color:#00E6FF20_transparent]

          [&::-webkit-scrollbar]:w-[6px]
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-cyan-400/20
          [&::-webkit-scrollbar-thumb]:rounded-full
        ">

          <div className="
            flex
            items-center
            gap-3
            bg-cyan-500/5
            border
            border-cyan-400/10
            rounded-2xl
            p-4
          ">

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

              <p className="text-cyan-300 font-bold text-sm">
                قدرات المساعد
              </p>

              <p className="text-gray-400 text-sm mt-1">
                تحليل المرور • التنبيهات • جودة الهواء • التوصيات التشغيلية
              </p>

            </div>

          </div>

          {messages.map((message, index) => (

            <div
              key={index}
              className={`
                flex
                items-end
                gap-3

                ${message.sender === 'user'
                  ? 'justify-end'
                  : 'justify-start'}
              `}
            >

              {message.sender === 'ai' && (

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
                  shrink-0
                ">
                  <Bot size={18} />
                </div>

              )}

              <div className={`
                relative
                overflow-hidden
                max-w-[78%]
                px-5
                py-4
                rounded-3xl
                leading-8
                border
                text-sm

                ${message.sender === 'user'
                  ? `
                    bg-cyan-400
                    text-black
                    border-cyan-300
                    shadow-[0_0_25px_rgba(0,230,255,0.15)]
                  `
                  : `
                    bg-[#101827]
                    text-white
                    border-cyan-500/10
                  `
                }
              `}>

                {message.sender === 'ai' && (
                  <div className="
                    absolute
                    inset-0
                    bg-[radial-gradient(circle_at_top_right,rgba(0,230,255,0.06),transparent_40%)]
                  "></div>
                )}

                <div className="relative z-10">
                  {message.text}
                </div>

              </div>

              {message.sender === 'user' && (

                <div className="
                  w-10
                  h-10
                  rounded-2xl
                  bg-white/5
                  border
                  border-white/10
                  flex
                  items-center
                  justify-center
                  text-white
                  shrink-0
                ">
                  <User size={18} />
                </div>

              )}

            </div>

          ))}

          {loading && (

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
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />
              </div>

              <div className="
                bg-[#101827]
                border
                border-cyan-500/10
                rounded-3xl
                px-5
                py-4
                text-cyan-300
                text-sm
              ">
                الذكاء الاصطناعي يقوم بتحليل البيانات...
              </div>

            </div>

          )}

        </div>

        <div className="flex gap-4 mt-6">

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}

            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSend()
              }
            }}

            placeholder="اسأل عن المرور، التنبيهات، جودة الهواء..."

            className="
              flex-1
              bg-[#08111F]
              border
              border-cyan-500/10
              rounded-2xl
              px-5
              py-4
              outline-none
              text-white
              placeholder:text-gray-500
              focus:border-cyan-400/40
              transition
            "
          />

          <button
            onClick={handleSend}
            className="
              flex
              items-center
              justify-center
              gap-2
              bg-cyan-400
              hover:bg-cyan-300
              transition
              text-black
              font-black
              px-7
              rounded-2xl
              shadow-[0_0_30px_rgba(0,230,255,0.20)]
            "
          >

            <SendHorizonal size={18} />

            إرسال

          </button>

        </div>

      </div>

    </div>
  )
}

export default AIAssistant