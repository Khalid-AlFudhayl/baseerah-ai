import Navbar from '../components/Navbar'

const cities = [
  {
    name: 'أبها',
    status: 'مستقرة',
    traffic: '61%',
    air: '38',
  },

  {
    name: 'خميس مشيط',
    status: 'مزدحمة',
    traffic: '72%',
    air: '41',
  },

  {
    name: 'جازان',
    status: 'ممتازة',
    traffic: '48%',
    air: '29',
  },

  {
    name: 'الرياض',
    status: 'نشطة',
    traffic: '83%',
    air: '52',
  },
]

function Cities() {
  return (
    <div className="p-8">

      <Navbar />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {cities.map((city, index) => (

          <div
            key={index}
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
                {city.name}
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

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

export default Cities