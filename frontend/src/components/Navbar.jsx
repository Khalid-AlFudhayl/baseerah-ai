import { useEffect, useState } from 'react'

import {
  MapPin,
  Radio,
  CloudSun,
  LogOut,
  ShieldCheck,
  Wifi,
  WifiOff
} from 'lucide-react'

import { io } from 'socket.io-client'

const API_URL = 'https://baseerah-ai-backend.onrender.com'

function Navbar({ onLogout }) {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socket = io(API_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    })

    socket.on('connect', () => {
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    socket.on('connect_error', () => {
      setIsConnected(false)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 bg-[#101827]/85 border border-cyan-500/10 px-5 py-3 rounded-2xl backdrop-blur-xl shadow-[0_0_25px_rgba(0,230,255,0.04)]">
          <div className="w-9 h-9 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-300">
            <MapPin size={16} />
          </div>

          <div>
            <p className="text-white text-sm font-black">
              أبها
            </p>

            <p className="text-gray-500 text-xs mt-0.5">
              Smart City Digital Twin
            </p>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 px-4 py-3 rounded-2xl text-sm backdrop-blur-xl">
          <ShieldCheck size={15} />
          منصة بصيرة التشغيلية
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className={`
          flex items-center gap-2 px-4 py-3 rounded-2xl text-sm backdrop-blur-xl border transition
          ${isConnected
            ? 'bg-green-500/10 border-green-400/20 text-green-300'
            : 'bg-red-500/10 border-red-400/20 text-red-300'
          }
        `}>
          {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}

          {isConnected ? 'Real-time Connected' : 'Connection Lost'}
        </div>

        <div className="flex items-center gap-2 bg-green-500/10 border border-green-400/20 px-4 py-3 rounded-2xl text-green-300 text-sm backdrop-blur-xl">
          <Radio size={14} />
          مباشر
        </div>

        <div className="flex items-center gap-3 bg-[#101827]/90 border border-yellow-500/10 px-4 py-3 rounded-2xl backdrop-blur-xl">
          <CloudSun size={17} className="text-yellow-300" />

          <span className="text-white text-sm font-bold">
            22°C
          </span>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 text-red-300 px-5 py-3 rounded-2xl text-sm transition hover:bg-red-500/15 hover:border-red-400/40"
        >
          <LogOut size={15} />
          تسجيل الخروج
        </button>
      </div>
    </div>
  )
}

export default Navbar