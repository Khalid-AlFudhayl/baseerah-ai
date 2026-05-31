import { useEffect, useState } from 'react'

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import MapView, { Callout, Marker } from 'react-native-maps'
import axios from 'axios'
import { io } from 'socket.io-client'

const API_URL = 'http://192.168.8.219:5000'
const socket = io(API_URL)

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

  const fetchCities = async () => {
    try {
      const response = await axios.get(`${API_URL}/cities`)

      if (Array.isArray(response.data)) {
        setCities(response.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
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

  const getStatusColor = (status: string) => {
    if (status === 'مستقر') return '#4ADE80'
    if (status === 'نشط') return '#FACC15'
    if (status === 'مزدحم') return '#FB923C'
    return '#22D3EE'
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.glowCircle} />

      <View style={styles.headerCard}>
        <Text style={styles.badge}>REAL SMART MAP</Text>

        <Text style={styles.title}>المدن الذكية</Text>

        <Text style={styles.subtitle}>
          خريطة تشغيلية حقيقية لمراقبة مناطق أبها المرتبطة بمنصة بصيرة.
        </Text>
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

            const color = getStatusColor(city.status)

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
                      {city.status}
                    </Text>

                    <Text style={styles.calloutText}>
                      المرور: {city.traffic}
                    </Text>

                    <Text style={styles.calloutText}>
                      الطاقة: {city.energy}
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
      ) : (
        cities.map((city, index) => (
          <View key={city.id || index} style={styles.cityCard}>
            <View style={styles.cityTopRow}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: `${getStatusColor(city.status)}20`,
                  },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: getStatusColor(city.status),
                    },
                  ]}
                />

                <Text
                  style={[
                    styles.statusText,
                    {
                      color: getStatusColor(city.status),
                    },
                  ]}
                >
                  {city.status}
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
              <Text style={styles.securityLabel}>مؤشر السلامة</Text>
              <Text style={styles.securityValue}>{city.security}</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
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
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
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

  headerCard: {
    backgroundColor: 'rgba(11,18,32,0.92)',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.14)',
    marginBottom: 20,
  },

  badge: {
    color: '#22D3EE',
    fontSize: 10,
    letterSpacing: 4,
    marginBottom: 12,
    textAlign: 'right',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
    textAlign: 'right',
  },

  subtitle: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 24,
    marginTop: 10,
    textAlign: 'right',
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
    width: 180,
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
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'right',
    maxWidth: '60%',
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 16,
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
    fontWeight: '700',
  },

  securityValue: {
    color: '#4ADE80',
    fontSize: 26,
    fontWeight: '900',
  },
})