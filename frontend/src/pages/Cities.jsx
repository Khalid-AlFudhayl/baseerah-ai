import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import API from '../services/api'

function Cities() {
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await API.get('/cities')
        setCities(res.data)
      } catch (error) {
        console.log('Error loading cities:', error)
        setCities([])
      } finally {
        setLoading(false)
      }
    }

    fetchCities()
  }, [])

  return (
    <div className="p-8">

      <Navbar />

      {loading ? (
        <div className="text-cyan-300 text-xl font-bold">
          جاري تحميل بيانات المناطق...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {cities.map((city) => (

            <div
              key={city.id}
              className="
                bg-[#111827]/70
                border
                border-cyan-500/10
                rounded-3xl
                p-6
                backdrop-blur-xl
                hover:border-cyan-400/30
                transition
              "
            >

              <div className="flex justify-between items-center mb-6">

                <h2 className="text-2xl font-bold text-white">
                  {city.city}
                </h2>

                <div className="
                  bg-cyan-500/10
                  text-cyan-300
                  px-3
                  py-1
                  rounded-xl
                  text-sm
                ">
                  {city.status}
                </div>

              </div>

              <div className="space-y-4">

                <div>

                  <div className="flex justify-between mb-2">
                    <p className="text-gray-400">
                      حركة المرور
                    </p>

                    <p className="text-white">
                      {city.traffic}
                    </p>
                  </div>

                  <div className="w-full h-3 bg-[#08111F] rounded-full">

                    <div
                      className="h-3 bg-cyan-400 rounded-full"
                      style={{ width: city.traffic }}
                    ></div>

                  </div>

                </div>

                <div>

                  <div className="flex justify-between mb-2">
                    <p className="text-gray-400">
                      جودة الهواء
                    </p>

                    <p className="text-white">
                      {city.air}
                    </p>
                  </div>

                  <div className="w-full h-3 bg-[#08111F] rounded-full">

                    <div
                      className="h-3 bg-green-400 rounded-full"
                      style={{ width: `${city.air}%` }}
                    ></div>

                  </div>

                </div>

                <div>

                  <div className="flex justify-between mb-2">
                    <p className="text-gray-400">
                      الطاقة
                    </p>

                    <p className="text-white">
                      {city.energy}
                    </p>
                  </div>

                  <div className="w-full h-3 bg-[#08111F] rounded-full">

                    <div
                      className="h-3 bg-yellow-400 rounded-full"
                      style={{ width: city.energy }}
                    ></div>

                  </div>

                </div>

                <div>

                  <div className="flex justify-between mb-2">
                    <p className="text-gray-400">
                      المياه
                    </p>

                    <p className="text-white">
                      {city.water}
                    </p>
                  </div>

                  <div className="w-full h-3 bg-[#08111F] rounded-full">

                    <div
                      className="h-3 bg-blue-400 rounded-full"
                      style={{ width: city.water }}
                    ></div>

                  </div>

                </div>

                <div>

                  <div className="flex justify-between mb-2">
                    <p className="text-gray-400">
                      السلامة
                    </p>

                    <p className="text-white">
                      {city.security}%
                    </p>
                  </div>

                  <div className="w-full h-3 bg-[#08111F] rounded-full">

                    <div
                      className="h-3 bg-green-400 rounded-full"
                      style={{ width: `${city.security}%` }}
                    ></div>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  )
}

export default Cities