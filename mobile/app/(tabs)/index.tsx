import { useEffect, useState } from 'react'

import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import axios from 'axios'
import { io } from 'socket.io-client'
import { LineChart } from 'react-native-chart-kit'

const API_URL = 'http://192.168.8.219:5000'
const socket = io(API_URL)
const screenWidth = Dimensions.get('window').width

export default function HomeScreen() {
  const [stats, setStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [trafficData, setTrafficData] = useState([55, 62, 58, 70, 66, 74])

  const getNumber = (value: any) => {
    return Number(String(value).replace('%', '')) || 0
  }

  const updateStatsFromCities = (cities: any[]) => {
    if (!Array.isArray(cities) || cities.length === 0) return

    const trafficAverage = Math.floor(
      cities.reduce((sum: number, city: any) => sum + getNumber(city.traffic), 0) / cities.length
    )

    const airAverage = Math.floor(
      cities.reduce((sum: number, city: any) => sum + getNumber(city.air), 0) / cities.length
    )

    const energyAverage = Math.floor(
      cities.reduce((sum: number, city: any) => sum + getNumber(city.energy), 0) / cities.length
    )

    const waterAverage = Math.floor(
      cities.reduce((sum: number, city: any) => sum + getNumber(city.water), 0) / cities.length
    )

    setStats([
      { title: 'الهواء', value: `${airAverage}`, color: '#22D3EE' },
      { title: 'المرور', value: `${trafficAverage}%`, color: '#FB923C' },
      { title: 'الطاقة', value: `${energyAverage}%`, color: '#FACC15' },
      { title: 'المياه', value: `${waterAverage}%`, color: '#60A5FA' },
    ])

    setTrafficData((prev) => {
      const updated = [...prev, trafficAverage]
      if (updated.length > 7) updated.shift()
      return updated
    })

    setLoading(false)
  }

  const fetchCities = async () => {
    try {
      const response = await axios.get(`${API_URL}/cities`)
      updateStatsFromCities(response.data)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCities()

    socket.on('cities:update', (cities) => {
      updateStatsFromCities(cities)
    })

    return () => {
      socket.off('cities:update')
    }
  }, [])

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.glowCircle} />
      <View style={styles.glowCircleTwo} />

      <ImageBackground
        source={require('@/assets/images/abha.jpg')}
        style={styles.heroImage}
        imageStyle={styles.heroImageStyle}
      >
        <View style={styles.heroOverlay}>
          <Text style={styles.badge}>SMART CITY CONTROL</Text>

          <Text style={styles.title}>بصيرة</Text>

          <Text style={styles.subtitle}>
            منصة تشغيل وتحليل المدن الذكية المدعومة بالذكاء الاصطناعي.
          </Text>

          <View style={styles.liveRow}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>

            <View style={styles.liveBadge}>
              <Text style={styles.liveText}>Abha Digital Twin</Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#22D3EE" />
        </View>
      ) : (
        <View style={styles.grid}>
          {stats.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>

              <Text style={[styles.cardValue, { color: item.color }]}>
                {item.value}
              </Text>

              <View style={[styles.progressBar, { backgroundColor: `${item.color}25` }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: item.color,
                      width: item.value,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.healthCard}>
        <Text style={styles.healthLabel}>CITY HEALTH SCORE</Text>

        <Text style={styles.healthValue}>92</Text>

        <Text style={styles.healthStatus}>Excellent</Text>

        <View style={styles.healthBar}>
          <View style={styles.healthFill} />
        </View>

        <Text style={styles.healthText}>
          الحالة التشغيلية العامة مستقرة، مع مراقبة مستمرة لحركة المرور والطاقة.
        </Text>
      </View>

      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>التحليل المروري</Text>
          <Text style={styles.chartSub}>آخر التحديثات الحية</Text>
        </View>

        <LineChart
          data={{
            labels: ['1', '2', '3', '4', '5', '6', '7'],
            datasets: [{ data: trafficData }],
          }}
          width={screenWidth - 70}
          height={240}
          chartConfig={{
            backgroundGradientFrom: '#0F172A',
            backgroundGradientTo: '#0F172A',
            decimalPlaces: 0,
            color: () => '#22D3EE',
            labelColor: () => '#64748B',
            propsForDots: {
              r: '5',
              strokeWidth: '2',
              stroke: '#22D3EE',
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.alertCard}>
        <Text style={styles.alertTitle}>آخر التنبيهات</Text>

        <View style={styles.alertRow}>
          <Text style={styles.alertDot}>●</Text>
          <Text style={styles.alertItem}>ازدحام مروري - طريق الملك فهد</Text>
        </View>

        <View style={styles.alertRow}>
          <Text style={[styles.alertDot, { color: '#FACC15' }]}>●</Text>
          <Text style={styles.alertItem}>ارتفاع استهلاك الطاقة</Text>
        </View>

        <View style={styles.alertRow}>
          <Text style={[styles.alertDot, { color: '#22D3EE' }]}>●</Text>
          <Text style={styles.alertItem}>تحسن جودة الهواء</Text>
        </View>
      </View>

      <View style={styles.aiCard}>
        <Text style={styles.aiTitle}>توصية بصيرة</Text>

        <Text style={styles.aiText}>
          يوصي النظام بمراقبة طريق الملك فهد خلال ساعات الذروة القادمة بسبب ارتفاع الكثافة المرورية مقارنة بالمناطق الأخرى.
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#030712',
  },

  content: {
    padding: 20,
    paddingTop: 65,
    paddingBottom: 120,
  },

  glowCircle: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: 'rgba(34,211,238,0.10)',
    top: -80,
    right: -70,
  },

  glowCircleTwo: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: 'rgba(74,222,128,0.06)',
    top: 360,
    left: -90,
  },

  heroImage: {
    height: 285,
    borderRadius: 36,
    overflow: 'hidden',
    marginBottom: 26,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.22)',
    shadowColor: '#22D3EE',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    elevation: 14,
  },

  heroImageStyle: {
    borderRadius: 36,
  },

  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3,7,18,0.62)',
    padding: 24,
    justifyContent: 'flex-end',
  },

  badge: {
    color: '#22D3EE',
    letterSpacing: 4,
    fontSize: 11,
    marginBottom: 16,
    textAlign: 'right',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 52,
    fontWeight: '900',
    textAlign: 'right',
  },

  subtitle: {
    color: '#E2E8F0',
    fontSize: 15,
    lineHeight: 28,
    marginTop: 12,
    textAlign: 'right',
  },

  liveRow: {
    flexDirection: 'row-reverse',
    gap: 12,
    marginTop: 22,
  },

  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(15,23,42,0.86)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.18)',
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#4ADE80',
  },

  liveText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '800',
  },

  loaderContainer: {
    marginTop: 60,
    alignItems: 'center',
  },

  grid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 14,
  },

  card: {
    width: '47%',
    backgroundColor: 'rgba(15,23,42,0.88)',
    borderRadius: 30,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    shadowColor: '#22D3EE',
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 10,
  },

  cardTitle: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'right',
  },

  cardValue: {
    fontSize: 32,
    fontWeight: '900',
    marginTop: 12,
    textAlign: 'right',
  },

  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 999,
    marginTop: 18,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 999,
  },

  healthCard: {
    backgroundColor: 'rgba(7,17,31,0.92)',
    borderRadius: 34,
    padding: 24,
    alignItems: 'center',
    marginTop: 26,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.20)',
    shadowColor: '#4ADE80',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 10,
  },

  healthLabel: {
    color: '#4ADE80',
    fontSize: 12,
    letterSpacing: 3,
    fontWeight: '900',
  },

  healthValue: {
    color: '#FFFFFF',
    fontSize: 72,
    fontWeight: '900',
    marginTop: 8,
  },

  healthStatus: {
    color: '#4ADE80',
    fontSize: 18,
    fontWeight: '900',
    marginTop: -4,
  },

  healthBar: {
    width: '100%',
    height: 9,
    borderRadius: 999,
    backgroundColor: 'rgba(74,222,128,0.16)',
    marginTop: 20,
    overflow: 'hidden',
  },

  healthFill: {
    width: '92%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#4ADE80',
  },

  healthText: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 25,
    textAlign: 'center',
    marginTop: 16,
  },

  chartCard: {
    backgroundColor: 'rgba(15,23,42,0.88)',
    borderRadius: 34,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.12)',
    marginTop: 26,
    shadowColor: '#22D3EE',
    shadowOpacity: 0.16,
    shadowRadius: 22,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 12,
  },

  chartHeader: {
    marginBottom: 10,
  },

  chartTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'right',
  },

  chartSub: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 6,
    textAlign: 'right',
  },

  chart: {
    borderRadius: 24,
    marginTop: 12,
  },

  alertCard: {
    backgroundColor: 'rgba(15,23,42,0.90)',
    borderRadius: 30,
    padding: 22,
    marginTop: 26,
    borderWidth: 1,
    borderColor: 'rgba(251,146,60,0.18)',
  },

  alertTitle: {
    color: '#FB923C',
    fontSize: 21,
    fontWeight: '900',
    textAlign: 'right',
    marginBottom: 16,
  },

  alertRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },

  alertDot: {
    color: '#FB923C',
    fontSize: 12,
  },

  alertItem: {
    color: '#E2E8F0',
    fontSize: 14,
    lineHeight: 25,
    textAlign: 'right',
    flex: 1,
  },

  aiCard: {
    backgroundColor: 'rgba(7,17,31,0.90)',
    borderRadius: 34,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.14)',
    marginTop: 26,
    shadowColor: '#22D3EE',
    shadowOpacity: 0.14,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 10,
  },

  aiTitle: {
    color: '#22D3EE',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'right',
  },

  aiText: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 28,
    marginTop: 12,
    textAlign: 'right',
  },
})