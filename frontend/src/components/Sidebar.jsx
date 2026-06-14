import { NavLink } from 'react-router-dom'
import logo from '../assets/baseerah-logo.png'

import {
  LayoutDashboard,
  MapPinned,
  ChartSpline,
  BellRing,
  BrainCircuit,
  Settings,
  UserRound,
  Radio,
  UsersRound
} from 'lucide-react'

function Sidebar() {
  const user = JSON.parse(
    localStorage.getItem('baseerah_user') || '{}'
  )

  const role = user.role || 'viewer'

  const navLinks = [
    { to: '/', label: 'الرئيسية', icon: <LayoutDashboard size={17} /> },
    { to: '/cities', label: 'المدن والمناطق', icon: <MapPinned size={17} /> },
    { to: '/analytics', label: 'البيانات والتحليلات', icon: <ChartSpline size={17} /> },
    { to: '/alerts', label: 'التنبيهات', icon: <BellRing size={17} /> },
    { to: '/ai', label: 'المساعد الذكي', icon: <BrainCircuit size={17} /> },
    { to: '/settings', label: 'الإعدادات', icon: <Settings size={17} /> }
  ]

  if (role === 'admin') {
    navLinks.push({
      to: '/users',
      label: 'إدارة المستخدمين',
      icon: <UsersRound size={17} />
    })
  }

  return (
    <aside
      className="
        w-[245px]
        h-screen
        bg-[#07111F]/95
        border-r
        border-cyan-500/10
        px-4
        py-4
        flex
        flex-col
        justify-between
        backdrop-blur-xl
        overflow-hidden
        shrink-0
      "
    >
      <div className="min-h-0">
        <div
          className="
            relative
            overflow-hidden
            flex
            items-center
            gap-3
            mb-6
            px-3
            py-3
            rounded-3xl
            border
            border-cyan-500/10
            bg-[#101827]/70
          "
        >
          <div
            className="
              absolute
              inset-0
              bg-[radial-gradient(circle_at_top_right,rgba(0,230,255,0.10),transparent_35%)]
            "
          ></div>

          <img
            src={logo}
            alt="Baseerah AI"
            className="
              relative
              z-10
              w-12
              h-12
              object-contain
              mix-blend-screen
              drop-shadow-[0_0_18px_rgba(0,230,255,0.35)]
            "
          />

          <div className="relative z-10">
            <h1
              className="
                text-2xl
                font-black
                text-white
                leading-none
              "
            >
              بصيرة
            </h1>

            <p
              className="
                text-cyan-400
                text-[9px]
                tracking-[0.28em]
                mt-1.5
              "
            >
              BASEERAH AI
            </p>
          </div>
        </div>

        <ul className="space-y-2">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to}>
                {({ isActive }) => (
                  <div
                    className={`
                      group
                      relative
                      overflow-hidden
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3
                      rounded-2xl
                      transition
                      duration-300
                      text-sm
                      border
                      ${isActive
                        ? 'bg-cyan-500/10 text-cyan-300 border-cyan-400/25 shadow-[0_0_22px_rgba(0,230,255,0.08)]'
                        : 'text-gray-400 border-transparent hover:text-white hover:bg-white/[0.04]'
                      }
                    `}
                  >
                    {isActive && (
                      <div
                        className="
                          absolute
                          right-0
                          top-1/2
                          -translate-y-1/2
                          w-[3px]
                          h-7
                          rounded-full
                          bg-cyan-400
                          shadow-[0_0_14px_rgba(0,230,255,0.9)]
                        "
                      ></div>
                    )}

                    <span
                      className={`
                        w-9
                        h-9
                        rounded-2xl
                        flex
                        items-center
                        justify-center
                        transition
                        ${isActive
                          ? 'bg-cyan-400/10 text-cyan-300 border border-cyan-400/20'
                          : 'bg-white/[0.03] text-gray-500 group-hover:text-cyan-300'
                        }
                      `}
                    >
                      {link.icon}
                    </span>

                    <span className="font-medium leading-none">
                      {link.label}
                    </span>
                  </div>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="
          relative
          overflow-hidden
          bg-[#101827]/85
          border
          border-cyan-500/10
          rounded-3xl
          p-4
          mt-4
        "
      >
        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_top_right,rgba(0,230,255,0.10),transparent_35%)]
          "
        ></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <div
              className="
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
                shrink-0
              "
            >
              <UserRound size={18} />
            </div>

            <div className="min-w-0">
              <h3 className="text-white font-black text-[15px] leading-5 truncate">
                {user.full_name || 'Unknown User'}
              </h3>

              <p className="text-gray-400 text-xs mt-0.5">
                {role === 'admin'
                  ? 'مدير النظام'
                  : role === 'manager'
                    ? 'مشرف'
                    : 'مستخدم عرض'}
              </p>
            </div>
          </div>

          <div
            className="
              mt-4
              bg-green-500/10
              border
              border-green-400/20
              text-green-300
              text-xs
              rounded-2xl
              px-3
              py-2.5
              flex
              items-center
              gap-2
            "
          >
            <Radio size={13} />
            <span className="truncate">النظام يعمل بشكل طبيعي</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar