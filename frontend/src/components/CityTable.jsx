import { useEffect, useState } from 'react'
import API from '../services/api'

import {
  Database,
  Pencil,
  Trash2,
  MapPin,
  ShieldCheck,
  Activity,
  Wind,
  Zap,
  Droplets
} from 'lucide-react'

import AddCityForm from './AddCityForm'
import EditCityModal from './EditCityModal'

function CityTable() {

  const [cities, setCities] = useState([])
  const [selectedCity, setSelectedCity] = useState(null)

  const fetchCities = async () => {
    try {
      const response = await API.get('/cities')
      setCities(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchCities()

    const interval = setInterval(() => {
      fetchCities()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const deleteCity = async (id) => {
    const confirmDelete = confirm('هل أنت متأكد من حذف المنطقة؟')
    if (!confirmDelete) return

    await API.delete(`/cities/${id}`)

    fetchCities()
  }

  const getStatusStyle = (status) => {
    if (status === 'مستقر') {
      return 'bg-green-500/10 border-green-400/20 text-green-300'
    }

    if (status === 'نشط') {
      return 'bg-orange-500/10 border-orange-400/20 text-orange-300'
    }

    return 'bg-red-500/10 border-red-400/20 text-red-300'
  }

  return (
    <div className="space-y-6">

      <AddCityForm refreshCities={fetchCities} />

      <div className="
        relative
        overflow-hidden
        bg-[#101827]/85
        border
        border-cyan-500/10
        rounded-3xl
        p-5
        backdrop-blur-xl
      ">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,230,255,0.10),transparent_38%)]"></div>
        <div className="absolute top-0 right-0 h-[2px] w-36 bg-cyan-400/60"></div>

        <div className="relative z-10">

          <div className="flex justify-between items-start mb-6">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-300">
                <Database size={22} />
              </div>

              <div>
                <h2 className="text-2xl font-black">
                  بيانات المناطق
                </h2>

                <p className="text-gray-400 text-sm mt-1">
                  قاعدة البيانات التشغيلية لمنصة بصيرة
                </p>
              </div>

            </div>

            <div className="bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 px-4 py-2 rounded-2xl text-sm">
              {cities.length} مناطق
            </div>

          </div>

          <div className="rounded-3xl border border-cyan-500/10 overflow-hidden">

            <table className="w-full table-fixed">

              <colgroup>
                <col className="w-[23%]" />
                <col className="w-[11%]" />
                <col className="w-[11%]" />
                <col className="w-[11%]" />
                <col className="w-[11%]" />
                <col className="w-[11%]" />
                <col className="w-[11%]" />
                <col className="w-[11%]" />
              </colgroup>

              <thead>
                <tr className="bg-[#08111F]/90 border-b border-cyan-500/10">

                  <th className="text-right pr-[74px] py-5 text-gray-400 font-medium text-sm">
                    المنطقة
                  </th>

                  <th className="text-center py-5 text-gray-400 font-medium text-sm">
                    المرور
                  </th>

                  <th className="text-center py-5 text-gray-400 font-medium text-sm">
                    الهواء
                  </th>

                  <th className="text-center py-5 text-gray-400 font-medium text-sm">
                    الطاقة
                  </th>

                  <th className="text-center py-5 text-gray-400 font-medium text-sm">
                    المياه
                  </th>

                  <th className="text-center py-5 text-gray-400 font-medium text-sm">
                    الأمان
                  </th>

                  <th className="text-center py-5 text-gray-400 font-medium text-sm">
                    الحالة
                  </th>

                  <th className="text-center py-5 text-gray-400 font-medium text-sm">
                    التحكم
                  </th>

                </tr>
              </thead>

              <tbody>

                {cities.map((city) => (

                  <tr
                    key={city.id}
                    className="border-b border-cyan-500/5 transition duration-300 hover:bg-cyan-500/[0.03]"
                  >

                    <td className="py-5 px-5">
                      <div className="flex items-center gap-3 min-w-0">

                        <div className="w-10 h-10 shrink-0 rounded-2xl bg-cyan-500/10 border border-cyan-400/15 flex items-center justify-center text-cyan-300">
                          <MapPin size={16} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-white font-bold truncate">
                            {city.city}
                          </p>

                          <p className="text-gray-500 text-xs mt-1">
                            Live Zone
                          </p>
                        </div>

                      </div>
                    </td>

                    <td className="py-5 text-center">
                      <div className="flex items-center justify-center gap-2 text-orange-300">
                        <Activity size={15} />
                        {city.traffic}
                      </div>
                    </td>

                    <td className="py-5 text-center">
                      <div className="flex items-center justify-center gap-2 text-cyan-300">
                        <Wind size={15} />
                        {city.air}
                      </div>
                    </td>

                    <td className="py-5 text-center">
                      <div className="flex items-center justify-center gap-2 text-yellow-300">
                        <Zap size={15} />
                        {city.energy}
                      </div>
                    </td>

                    <td className="py-5 text-center">
                      <div className="flex items-center justify-center gap-2 text-blue-300">
                        <Droplets size={15} />
                        {city.water}
                      </div>
                    </td>

                    <td className="py-5 text-center">
                      <div className="flex items-center justify-center gap-2 text-green-300">
                        <ShieldCheck size={15} />
                        {city.security}
                      </div>
                    </td>

                    <td className="py-5 text-center">
                      <span className={`inline-flex justify-center min-w-[76px] px-3 py-2 rounded-2xl border text-xs ${getStatusStyle(city.status)}`}>
                        {city.status}
                      </span>
                    </td>

                    <td className="py-5">
                      <div className="flex items-center justify-center gap-2">

                        <button
                          onClick={() => setSelectedCity(city)}
                          className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 flex items-center justify-center transition hover:bg-cyan-500/20"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          onClick={() => deleteCity(city.id)}
                          className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-400/20 text-red-300 flex items-center justify-center transition hover:bg-red-500/20"
                        >
                          <Trash2 size={15} />
                        </button>

                      </div>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

        {selectedCity && (
          <EditCityModal
            city={selectedCity}
            closeModal={() => setSelectedCity(null)}
            refreshCities={fetchCities}
          />
        )}

      </div>

    </div>
  )
}

export default CityTable