import { useState } from 'react'
import API from '../services/api'

import {
  Plus,
  MapPin,
  Activity,
  Wind,
  Zap,
  Droplets,
  ShieldCheck,
  Radio
} from 'lucide-react'

function AddCityForm({ refreshCities }) {

  const [formData, setFormData] = useState({
    city: '',
    traffic: '',
    air: '',
    energy: '',
    water: '',
    security: '',
    status: 'مستقر'
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !formData.city ||
      !formData.traffic ||
      !formData.air ||
      !formData.energy ||
      !formData.water ||
      !formData.security ||
      !formData.status
    ) {
      alert('عبّئ كل الحقول')
      return
    }

    try {
      const response = await API.get('/cities')
      const cities = response.data

      const cityExists = cities.some((city) => {
        return String(city.city).trim().toLowerCase() ===
          String(formData.city).trim().toLowerCase()
      })

      if (cityExists) {
        alert('المنطقة موجودة مسبقًا')
        return
      }

      await API.post('/cities', formData)

      setFormData({
        city: '',
        traffic: '',
        air: '',
        energy: '',
        water: '',
        security: '',
        status: 'مستقر'
      })

      refreshCities()
    } catch (error) {
      console.log(error)
      alert('حدث خطأ أثناء إضافة المنطقة')
    }
  }

  const fieldClass = `
    flex
    items-center
    gap-3
    h-[56px]
    bg-[#08111F]/90
    border
    border-cyan-500/10
    rounded-2xl
    px-4
    text-white
    text-sm
    transition
    focus-within:border-cyan-400/30
  `

  const inputClass = `
    w-full
    min-w-0
    bg-transparent
    outline-none
    text-white
    placeholder:text-gray-600
    text-sm
  `

  return (
    <div className="
      relative
      overflow-hidden
      bg-[#101827]/85
      border
      border-cyan-500/10
      rounded-3xl
      p-5
      backdrop-blur-xl
      shadow-[0_0_45px_rgba(0,230,255,0.05)]
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
              <Plus size={22} />
            </div>

            <div>
              <h2 className="text-2xl font-black">
                إضافة منطقة مراقبة
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                إدخال منطقة تشغيلية جديدة داخل منصة بصيرة
              </p>
            </div>

          </div>

          <div className="
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
            text-xs
          ">
            <Radio size={13} />
            NEW NODE
          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-4
            gap-3
          "
        >

          <div className={`xl:col-span-2 ${fieldClass}`}>
            <MapPin size={16} className="text-cyan-300 shrink-0" />

            <input
              type="text"
              name="city"
              placeholder="المنطقة"
              value={formData.city}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className={fieldClass}>
            <Activity size={16} className="text-orange-300 shrink-0" />

            <input
              type="text"
              name="traffic"
              placeholder="المرور 65%"
              value={formData.traffic}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className={fieldClass}>
            <Wind size={16} className="text-cyan-300 shrink-0" />

            <input
              type="text"
              name="air"
              placeholder="الهواء"
              value={formData.air}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className={fieldClass}>
            <Zap size={16} className="text-yellow-300 shrink-0" />

            <input
              type="text"
              name="energy"
              placeholder="الطاقة 78%"
              value={formData.energy}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className={fieldClass}>
            <Droplets size={16} className="text-blue-300 shrink-0" />

            <input
              type="text"
              name="water"
              placeholder="المياه 71%"
              value={formData.water}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className={fieldClass}>
            <ShieldCheck size={16} className="text-green-300 shrink-0" />

            <input
              type="text"
              name="security"
              placeholder="الأمان 91%"
              value={formData.security}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className={fieldClass}>
            <Radio size={16} className="text-green-300 shrink-0" />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="
                w-full
                min-w-0
                bg-[#08111F]
                outline-none
                text-white
                text-sm
              "
            >
              <option value="مستقر">
                مستقر
              </option>

              <option value="نشط">
                نشط
              </option>

              <option value="مزدحم">
                مزدحم
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="
              md:col-span-2
              xl:col-span-4
              h-[56px]
              flex
              items-center
              justify-center
              gap-2
              bg-cyan-400
              hover:bg-cyan-300
              transition
              rounded-2xl
              font-black
              text-black
              text-sm
              shadow-[0_0_30px_rgba(0,230,255,0.18)]
            "
          >
            <Plus size={17} />
            إضافة المنطقة
          </button>

        </form>

      </div>

    </div>
  )
}

export default AddCityForm