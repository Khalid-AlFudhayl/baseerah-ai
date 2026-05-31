import { useEffect, useState } from 'react'

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap
} from 'react-leaflet'

import {
  Map,
  Radio,
  MapPin,
  Navigation
} from 'lucide-react'

import 'leaflet/dist/leaflet.css'

function MapResizeFix() {

  const map = useMap()

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize()
    }, 300)
  }, [map])

  return null
}

function SmartCityMap() {

  const [cities, setCities] = useState([])

  const normalizeName = (name) => {
    return String(name)
      .trim()
      .replace(/\s+/g, ' ')
  }

  const locations = {
    'أبها': [18.2164, 42.5053],
    'وسط أبها': [18.2119, 42.5022],
    'جامعة الملك خالد': [18.0912, 42.7189],
    'طريق الملك فهد': [18.2308, 42.5601],
    'مطار أبها': [18.2404, 42.6566],
    'حي الموظفين': [18.2301, 42.5938]
  }

  const fetchCities = async () => {
    try {
      const response = await fetch('http://localhost:5000/cities')
      const data = await response.json()
      setCities(data)
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

  const getColor = (traffic) => {
    const value = Number(String(traffic).replace('%', ''))

    if (value >= 80) return '#FF4D4D'
    if (value >= 65) return '#FF8A00'
    return '#00C896'
  }

  const getLevel = (traffic) => {
    const value = Number(String(traffic).replace('%', ''))

    if (value >= 80) return 'مرتفع'
    if (value >= 65) return 'نشط'
    return 'مستقر'
  }

  const visibleCities =
    cities.filter((city) => {
      const cityName = normalizeName(city.city)
      return locations[cityName]
    })

  return (
    <div className="
      relative
      overflow-hidden
      bg-[#101827]/85
      border
      border-cyan-500/10
      rounded-3xl
      p-5
      h-[560px]
      backdrop-blur-xl
      transition
      duration-300
      hover:border-cyan-400/20
      hover:shadow-[0_0_45px_rgba(0,230,255,0.07)]
    ">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,230,255,0.10),transparent_36%)]"></div>
      <div className="absolute top-0 right-0 h-[2px] w-32 bg-cyan-400/60"></div>

      <div className="relative z-10 h-full flex flex-col">

        <div className="flex justify-between items-start mb-5">

          <div className="flex items-center gap-3">

            <div className="
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
            ">
              <Map size={22} />
            </div>

            <div>
              <h2 className="text-xl font-black">
                الخريطة الذكية
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                مراقبة حية لنطاق أبها وجامعة الملك خالد
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
            px-3
            py-2
            rounded-2xl
            text-xs
          ">
            <Radio size={13} />
            LIVE MAP
          </div>

        </div>

        <div className="
          grid
          grid-cols-3
          gap-3
          mb-4
        ">

          <div className="bg-[#08111F]/85 border border-cyan-400/10 rounded-2xl px-4 py-3">
            <p className="text-gray-400 text-xs">
              مناطق مرصودة
            </p>

            <h3 className="text-2xl font-black text-cyan-300 mt-1">
              {visibleCities.length}
            </h3>
          </div>

          <div className="bg-[#08111F]/85 border border-green-400/10 rounded-2xl px-4 py-3">
            <p className="text-gray-400 text-xs">
              النطاق
            </p>

            <h3 className="text-sm font-black text-green-300 mt-2">
              أبها
            </h3>
          </div>

          <div className="bg-[#08111F]/85 border border-orange-400/10 rounded-2xl px-4 py-3">
            <p className="text-gray-400 text-xs">
              التحديث
            </p>

            <h3 className="text-sm font-black text-orange-300 mt-2">
              30 ثانية
            </h3>
          </div>

        </div>

        <div className="
          relative
          flex-1
          rounded-3xl
          overflow-hidden
          border
          border-cyan-500/10
          bg-[#08111F]
        ">

          <MapContainer
            center={[18.1900, 42.6000]}
            zoom={10}
            scrollWheelZoom={true}
            className="h-full w-full"
          >

            <MapResizeFix />

            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {visibleCities.map((city) => {

              const cityName = normalizeName(city.city)
              const position = locations[cityName]
              const color = getColor(city.traffic)

              return (
                <CircleMarker
                  key={city.id}
                  center={position}
                  radius={17}
                  pathOptions={{
                    color,
                    fillColor: color,
                    fillOpacity: 0.82,
                    weight: 4
                  }}
                >

                  <Popup>
                    <div style={{
                      direction: 'rtl',
                      textAlign: 'right',
                      minWidth: '180px'
                    }}>

                      <strong style={{
                        color: '#0F172A',
                        fontSize: '15px'
                      }}>
                        {city.city}
                      </strong>

                      <div style={{
                        marginTop: '10px',
                        lineHeight: '1.9',
                        color: '#334155'
                      }}>
                        المرور: {city.traffic}
                        <br />
                        جودة الهواء: {city.air}
                        <br />
                        الحالة: {city.status}
                        <br />
                        المستوى: {getLevel(city.traffic)}
                      </div>

                    </div>
                  </Popup>

                </CircleMarker>
              )

            })}

          </MapContainer>

          <div className="
            pointer-events-none
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,transparent_55%,rgba(5,11,20,0.28))]
          "></div>

          <div className="
            absolute
            bottom-4
            right-4
            bg-[#07111F]/85
            border
            border-cyan-500/10
            rounded-2xl
            px-4
            py-3
            backdrop-blur-xl
            flex
            items-center
            gap-3
          ">

            <div className="
              w-9
              h-9
              rounded-2xl
              bg-cyan-500/10
              border
              border-cyan-400/20
              text-cyan-300
              flex
              items-center
              justify-center
            ">
              <MapPin size={16} />
            </div>

            <div>
              <p className="text-gray-400 text-xs">
                نقاط المراقبة
              </p>

              <p className="text-cyan-300 font-black mt-1">
                {visibleCities.length} مناطق
              </p>
            </div>

          </div>

          <div className="
            absolute
            top-4
            left-4
            bg-[#07111F]/85
            border
            border-green-500/10
            rounded-2xl
            px-4
            py-3
            backdrop-blur-xl
            flex
            items-center
            gap-2
            text-green-300
            text-xs
          ">
            <Navigation size={14} />
            ABHA DIGITAL TWIN
          </div>

        </div>

      </div>

    </div>
  )
}

export default SmartCityMap