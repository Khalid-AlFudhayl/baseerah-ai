import { useState } from 'react'

import {
  X,
  Save,
  MapPin,
  Activity,
  Wind,
  Zap,
  Droplets,
  ShieldCheck,
  Radio
} from 'lucide-react'

function EditCityModal({ city, closeModal, refreshCities }) {
  const [formData, setFormData] = useState({
    city: city.city,
    traffic: city.traffic,
    air: city.air,
    energy: city.energy,
    water: city.water,
    security: city.security,
    status: city.status
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await fetch(`http://localhost:5000/cities/${city.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      refreshCities()
      closeModal()
    } catch (error) {
      console.log(error)
      alert('حدث خطأ أثناء التعديل')
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
      fixed inset-0 z-50 bg-black/80 backdrop-blur-sm
      flex items-center justify-center p-6
    ">

      <div className="
        relative overflow-hidden bg-[#101827]/95 border border-cyan-400/20
        rounded-3xl p-6 w-full max-w-[860px]
        shadow-[0_0_70px_rgba(0,230,255,0.10)]
      ">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,230,255,0.10),transparent_35%)]"></div>
        <div className="absolute top-0 right-0 h-[2px] w-40 bg-cyan-400/60"></div>

        <div className="relative z-10">

          <div className="flex justify-between items-start mb-6">

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-300">
                <Save size={20} />
              </div>

              <div>
                <h2 className="text-2xl font-black">
                  تعديل بيانات المنطقة
                </h2>

                <p className="text-gray-400 text-sm mt-1">
                  تحديث مؤشرات المراقبة التشغيلية داخل منصة بصيرة
                </p>
              </div>
            </div>

            <button
              onClick={closeModal}
              className="
                w-11 h-11 rounded-2xl bg-white/[0.04] border border-cyan-500/10
                text-gray-400 hover:text-white hover:bg-white/[0.07]
                transition flex items-center justify-center
              "
            >
              <X size={18} />
            </button>

          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >

            <div className={`md:col-span-2 ${fieldClass}`}>
              <MapPin size={16} className="text-cyan-300 shrink-0" />

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="اسم المنطقة"
                className={inputClass}
              />
            </div>

            <div className={fieldClass}>
              <Activity size={16} className="text-orange-300 shrink-0" />

              <input
                type="text"
                name="traffic"
                value={formData.traffic}
                onChange={handleChange}
                placeholder="المرور 65%"
                className={inputClass}
              />
            </div>

            <div className={fieldClass}>
              <Wind size={16} className="text-cyan-300 shrink-0" />

              <input
                type="text"
                name="air"
                value={formData.air}
                onChange={handleChange}
                placeholder="جودة الهواء"
                className={inputClass}
              />
            </div>

            <div className={fieldClass}>
              <Zap size={16} className="text-yellow-300 shrink-0" />

              <input
                type="text"
                name="energy"
                value={formData.energy}
                onChange={handleChange}
                placeholder="الطاقة 78%"
                className={inputClass}
              />
            </div>

            <div className={fieldClass}>
              <Droplets size={16} className="text-blue-300 shrink-0" />

              <input
                type="text"
                name="water"
                value={formData.water}
                onChange={handleChange}
                placeholder="المياه 71%"
                className={inputClass}
              />
            </div>

            <div className={fieldClass}>
              <ShieldCheck size={16} className="text-green-300 shrink-0" />

              <input
                type="text"
                name="security"
                value={formData.security}
                onChange={handleChange}
                placeholder="الأمان 91%"
                className={inputClass}
              />
            </div>

            <div className={fieldClass}>
              <Radio size={16} className="text-green-300 shrink-0" />

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full min-w-0 bg-[#08111F] outline-none text-white text-sm"
              >
                <option value="مستقر">مستقر</option>
                <option value="نشط">نشط</option>
                <option value="مزدحم">مزدحم</option>
              </select>
            </div>

            <div className="md:col-span-2 flex gap-3 pt-2">

              <button
                type="submit"
                className="
                  flex-1 h-[56px] bg-cyan-400 hover:bg-cyan-300
                  transition text-black font-black rounded-2xl text-sm
                  flex items-center justify-center gap-2
                  shadow-[0_0_30px_rgba(0,230,255,0.18)]
                "
              >
                <Save size={17} />
                حفظ التعديلات
              </button>

              <button
                type="button"
                onClick={closeModal}
                className="
                  flex-1 h-[56px] bg-red-500/10 border border-red-400/20
                  text-red-300 rounded-2xl text-sm hover:bg-red-500/15
                  transition flex items-center justify-center gap-2
                "
              >
                <X size={17} />
                إلغاء
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  )
}

export default EditCityModal