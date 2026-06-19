import { useEffect, useState } from 'react'

import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import MapView, { Callout, Marker } from 'react-native-maps'
import { io } from 'socket.io-client'

import { API_URL, apiGet } from '@/utils/baseerahApi'

const socket = io(API_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
})

const zoneCoordinates: any = {
  'وسط أبها': {
    latitude: 18.2119,
    longitude: 42.5022,
  },
  'جامعة الملك خالد': {
    latitude: 18.0912,
    longitude: 42.7189,
  },
  'طريق الملك فهد': {
    latitude: 18.2308,
    longitude: 42.5601,
  },
  'مطار أبها': {
    latitude: 18.2404,
    longitude: 42.6566,
  },
  'حي الموظفين': {
    latitude: 18.2301,
    longitude: 42.5938,
  },
}

export default function ExploreScreen() {
  const [cities, setCities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const fetchCities = async () => {
    try {
      setErrorMessage('')

      const citiesData = await apiGet('/cities')

      if (Array.isArray(citiesData)) {
        setCities(citiesData)
      }
    } catch (error) {
      console.log(error)
      setErrorMessage('تعذر تحميل بيانات المدن. تأكد من الاتصال بالإنترنت.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchCities()

    socket.on('cities:update', (updatedCities) => {
      if (Array.isArray(updatedCities)) {
        setCities(updatedCities)
      }
    })

    return () => {
      socket.off('cities:update')
    }
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchCities()
  }

  const getNumber = (value: any) => {
    return Number(String(value).replace('%', '')) || 0
  }

  const getStatusColor = (status: string) => {
    if (status === 'مستقر') return '#4ADE80'
    if (status === 'نشط') return '#FACC15'
    if (status === 'مزدحم') return '#FB923C'

    return '#22D3EE'
  }

  const getStatusLabel = (city: any) => {
    if (city.status) return city.status

    const traffic = getNumber(city.traffic)

    if (traffic >= 80) return 'مزدحم'
    if (traffic >= 60) return 'نشط'

    return 'مستقر'
  }

  const stableCount = cities.filter((city) => {
    return getStatusLabel(city) === 'مستقر'
  }).length

  const activeCount = cities.filter((city) => {
    return getStatusLabel(city) === 'نشط'
  }).length

  const crowdedCount = cities.filter((city) => {
    return getStatusLabel(city) === 'مزدحم'
  }).length

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor="#22D3EE"
        />
      }
    >
      <View style={styles.glowCircle} />
      <View style={styles.glowCircleTwo} />

      <View style={styles.headerCard}>
        <View style={styles.headerTopRow}>
          <View>
            <Text style={styles.badge}>BASEERAH LIVE MAP</Text>

            <Text style={styles.title}>المدن والمناطق</Text>
          </View>

          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>مباشر</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>
          خريطة تشغيلية لمراقبة مناطق أبها وربط المؤشرات الحضرية ببيانات منصة بصيرة.
        </Text>

        <View style={styles.summaryRow}>
          <SummaryBox
            label="المناطق"
            value={cities.length}
            color="#22D3EE"
          />

          <SummaryBox
            label="مستقرة"
            value={stableCount}
            color="#4ADE80"
          />

          <SummaryBox
            label="نشطة"
            value={activeCount}
            color="#FACC15"
          />

          <SummaryBox
            label="مزدحمة"
            value={crowdedCount}
            color="#FB923C"
          />
        </View>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 18.2305,
            longitude: 42.555,
            latitudeDelta: 0.13,
            longitudeDelta: 0.13,
          }}
        >
          {cities.map((city, index) => {
            const coordinate =
              zoneCoordinates[city.city] ||
              Object.values(zoneCoordinates)[index % 5]

            const status = getStatusLabel(city)
            const color = getStatusColor(status)

            return (
              <Marker
                key={city.id || index}
                coordinate={coordinate as any}
              >
                <View style={styles.markerWrapper}>
                  <View
                    style={[
                      styles.markerPulse,
                      {
                        backgroundColor: `${color}30`,
                        borderColor: `${color}70`,
                      },
                    ]}
                  />

                  <View
                    style={[
                      styles.markerCore,
                      {
                        backgroundColor: color,
                        shadowColor: color,
                      },
                    ]}
                  />
                </View>

                <Callout tooltip>
                  <View style={styles.calloutCard}>
                    <Text style={styles.calloutTitle}>
                      {city.city}
                    </Text>

                    <Text style={[styles.calloutStatus, { color }]}>
                      {status}
                    </Text>

                    <Text style={styles.calloutText}>
                      المرور: {city.traffic}
                    </Text>

                    <Text style={styles.calloutText}>
                      الهواء: {city.air}
                    </Text>

                    <Text style={styles.calloutText}>
                      الطاقة: {city.energy}
                    </Text>

                    <Text style={styles.calloutText}>
                      المياه: {city.water}
                    </Text>

                    <Text style={styles.calloutText}>
                      السلامة: {city.security}
                    </Text>
                  </View>
                </Callout>
              </Marker>
            )
          })}
        </MapView>

        <View style={styles.mapOverlay}>
          <Text style={styles.mapTitle}>Abha Live Map</Text>
          <Text style={styles.mapSubtitle}>Real-Time Digital Twin</Text>
        </View>

        <View style={styles.legendBox}>
          <Legend color="#4ADE80" label="مستقر" />
          <Legend color="#FACC15" label="نشط" />
          <Legend color="#FB923C" label="مزدحم" />
        </View>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#22D3EE" />
        </View>
      ) : errorMessage ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>!</Text>

          <Text style={styles.emptyTitle}>
            تعذر تحميل المناطق
          </Text>

          <Text style={styles.emptyText}>
            {errorMessage}
          </Text>
        </View>
      ) : cities.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>✓</Text>

          <Text style={styles.emptyTitle}>
            لا توجد مناطق مسجلة
          </Text>

          <Text style={styles.emptyText}>
            لم يتم العثور على بيانات مناطق حالية.
          </Text>
        </View>
      ) : (
        cities.map((city, index) => {
          const status = getStatusLabel(city)
          const statusColor = getStatusColor(status)

          return (
            <View key={city.id || index} style={styles.cityCard}>
              <View style={styles.cityTopRow}>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: `${statusColor}20`,
                      borderColor: `${statusColor}40`,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor: statusColor,
                      },
                    ]}
                  />

                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: statusColor,
                      },
                    ]}
                  >
                    {status}
                  </Text>
                </View>

                <Text style={styles.cityName}>{city.city}</Text>
              </View>

              <View style={styles.metricsGrid}>
                <Metric label="المرور" value={city.traffic} color="#FB923C" />
                <Metric label="الهواء" value={city.air} color="#22D3EE" />
                <Metric label="الطاقة" value={city.energy} color="#FACC15" />
                <Metric label="المياه" value={city.water} color="#60A5FA" />
              </View>

              <View style={styles.securityCard}>
                <View>
                  <Text style={styles.securityLabel}>مؤشر السلامة</Text>
                  <Text style={styles.securityHint}>متابعة تشغيلية مباشرة</Text>
                </View>

                <Text style={styles.securityValue}>{city.security}</Text>
              </View>
            </View>
          )
        })
      )}
    </ScrollView>
  )
}

function SummaryBox({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <View style={styles.summaryBox}>
      <Text style={[styles.summaryValue, { color }]}>
        {value}
      </Text>

      <Text style={styles.summaryLabel}>
        {label}
      </Text>
    </View>
  )
}

function Metric({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color: string
}) {
  const progress = Math.min(
    100,
    Number(String(value).replace('%', '')) || 0
  )

  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>

      <Text style={[styles.metricValue, { color }]}>
        {value}
      </Text>

      <View style={[styles.metricBar, { backgroundColor: `${color}22` }]}>
        <View
          style={[
            styles.metricFill,
            {
              backgroundColor: color,
              width: `${progress}%`,
            },
          ]}
        />
      </View>
    </View>
  )
}

function Legend({
  color,
  label,
}: {
  color: string
  label: string
}) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#030712',
  },

  content: {
    padding: 18,
    paddingTop: 58,
    paddingBottom: 110,
  },

  glowCircle: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: 'rgba(34,211,238,0.08)',
    top: -80,
    right: -70,
  },

  glowCircleTwo: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: 'rgba(74,222,128,0.05)',
    top: 420,
    left: -90,
  },

  headerCard: {
    backgroundColor: 'rgba(11,18,32,0.92)',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.14)',
    marginBottom: 20,
  },

  headerTopRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },

  badge: {
    color: '#22D3EE',
    fontSize: 10,
    letterSpacing: 3,
    marginBottom: 12,
    textAlign: 'right',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'right',
  },

  subtitle: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 24,
    marginTop: 12,
    textAlign: 'right',
  },

  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(74,222,128,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.22)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#4ADE80',
  },

  liveText: {
    color: '#4ADE80',
    fontSize: 12,
    fontWeight: '900',
  },

  summaryRow: {
    flexDirection: 'row-reverse',
    gap: 10,
    marginTop: 18,
  },

  summaryBox: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.78)',
    borderRadius: 18,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },

  summaryValue: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },

  summaryLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 4,
    textAlign: 'center',
  },

  mapContainer: {
    height: 320,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 22,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.16)',
    backgroundColor: '#07111F',
  },

  map: {
    flex: 1,
  },

  mapOverlay: {
    position: 'absolute',
    top: 18,
    right: 18,
    backgroundColor: 'rgba(3,7,18,0.72)',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.16)',
  },

  mapTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'right',
  },

  mapSubtitle: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 3,
    textAlign: 'right',
  },

  markerWrapper: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },

  markerPulse: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 999,
    borderWidth: 2,
  },

  markerCore: {
    width: 16,
    height: 16,
    borderRadius: 999,
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 10,
  },

  calloutCard: {
    width: 190,
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.22)',
  },

  calloutTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'right',
  },

  calloutStatus: {
    fontSize: 13,
    fontWeight: '900',
    marginTop: 6,
    textAlign: 'right',
  },

  calloutText: {
    color: '#CBD5E1',
    fontSize: 12,
    marginTop: 6,
    textAlign: 'right',
  },

  legendBox: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    left: 14,
    backgroundColor: 'rgba(15,23,42,0.90)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 10,
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
  },

  legendItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },

  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },

  legendText: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '700',
  },

  loaderContainer: {
    marginTop: 50,
    alignItems: 'center',
  },

  emptyCard: {
    backgroundColor: 'rgba(15,23,42,0.88)',
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.18)',
  },

  emptyIcon: {
    color: '#4ADE80',
    fontSize: 42,
    fontWeight: '900',
  },

  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 12,
    textAlign: 'center',
  },

  emptyText: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 24,
  },

  cityCard: {
    backgroundColor: 'rgba(15,23,42,0.88)',
    borderRadius: 28,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },

  cityTopRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  cityName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'right',
    maxWidth: '62%',
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 16,
    borderWidth: 1,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '800',
  },

  metricsGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },

  metricCard: {
    width: '47%',
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },

  metricLabel: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'right',
  },

  metricValue: {
    fontSize: 24,
    fontWeight: '900',
    marginTop: 10,
    textAlign: 'right',
  },

  metricBar: {
    width: '100%',
    height: 6,
    borderRadius: 999,
    marginTop: 12,
    overflow: 'hidden',
  },

  metricFill: {
    height: '100%',
    borderRadius: 999,
  },

  securityCard: {
    backgroundColor: '#07111F',
    borderRadius: 22,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.08)',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  securityLabel: {
    color: '#CBD5E1',
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'right',
  },

  securityHint: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'right',
  },

  securityValue: {
    color: '#4ADE80',
    fontSize: 26,
    fontWeight: '900',
  },
})