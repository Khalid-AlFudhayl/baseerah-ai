import { useEffect, useState } from 'react'

import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { io } from 'socket.io-client'
import { LineChart } from 'react-native-chart-kit'

import { API_URL, apiGet } from '@/utils/baseerahApi'

const socket = io(API_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
})

const screenWidth = Dimensions.get('window').width

export default function HomeScreen() {
  const [stats, setStats] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [trafficData, setTrafficData] = useState([55, 62, 58, 70, 66, 74])
  const [healthScore, setHealthScore] = useState(0)

  const getNumber = (value: any) => {
    return Number(String(value).replace('%', '')) || 0
  }

  const getAverage = (items: any[], key: string) => {
    if (!Array.isArray(items) || items.length === 0) return 0

    return Math.floor(
      items.reduce((sum: number, item: any) => {
        return sum + getNumber(item[key])
      }, 0) / items.length
    )
  }

  const updateStatsFromCities = (cityData: any[]) => {
    if (!Array.isArray(cityData) || cityData.length === 0) return

    const trafficAverage = getAverage(cityData, 'traffic')
    const airAverage = getAverage(cityData, 'air')
    const energyAverage = getAverage(cityData, 'energy')
    const waterAverage = getAverage(cityData, 'water')
    const securityAverage = getAverage(cityData, 'security')

    setCities(cityData)
    setHealthScore(securityAverage)

    setStats([
      {
        title: 'جودة الهواء',
        value: `${airAverage}`,
        progress: airAverage,
        color: '#22D3EE',
      },
      {
        title: 'حركة المرور',
        value: `${trafficAverage}%`,
        progress: trafficAverage,
        color: '#FB923C',
      },
      {
        title: 'الطاقة',
        value: `${energyAverage}%`,
        progress: energyAverage,
        color: '#FACC15',
      },
      {
        title: 'المياه',
        value: `${waterAverage}%`,
        progress: waterAverage,
        color: '#60A5FA',
      },
    ])

    setTrafficData((prev) => {
      const updated = [...prev, trafficAverage]

      if (updated.length > 7) {
        updated.shift()
      }

      return updated
    })
  }

  const fetchDashboardData = async () => {
    try {
      const [citiesData, alertsData, recommendationsData] = await Promise.all([
        apiGet('/cities'),
        apiGet('/alerts'),
        apiGet('/ai-recommendations'),
      ])

      if (Array.isArray(citiesData)) {
        updateStatsFromCities(citiesData)
      }

      if (Array.isArray(alertsData)) {
        setAlerts(alertsData)
      }

      if (Array.isArray(recommendationsData)) {
        setRecommendations(recommendationsData)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()

    socket.on('cities:update', (liveCities) => {
      updateStatsFromCities(liveCities)
    })

    socket.on('alerts:update', (liveAlerts) => {
      setAlerts(liveAlerts || [])
    })

    return () => {
      socket.off('cities:update')
      socket.off('alerts:update')
    }
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchDashboardData()
  }

  const normalize = (value: any) => {
    return String(value || '').trim().toUpperCase()
  }

  const getAlertTypeName = (alert: any) => {
    const type = normalize(alert.alert_type)

    if (type.includes('TRAFFIC')) return 'تنبيه مروري'
    if (type.includes('AIR')) return 'تنبيه جودة الهواء'
    if (type.includes('ENERGY')) return 'تنبيه الطاقة'
    if (type.includes('WATER')) return 'تنبيه المياه'
    if (type.includes('SECURITY')) return 'تنبيه أمني'

    return 'تنبيه تشغيلي'
  }

  const getAlertColor = (alert: any) => {
    const severity = normalize(alert.severity || alert.level)

    if (severity.includes('CRITICAL') || severity.includes('HIGH')) {
      return '#FB923C'
    }

    if (severity.includes('MEDIUM')) {
      return '#FACC15'
    }

    return '#22D3EE'
  }

  const getRegionName = (alert: any) => {
    const city = cities.find((item) => {
      return Number(item.id) === Number(alert.region_id)
    })

    return city?.city || 'منطقة غير محددة'
  }

  const latestAlerts = alerts.slice(0, 3)
  const latestRecommendation = recommendations[0]?.recommendation

  const healthStatus =
    healthScore >= 85
      ? 'Excellent'
      : healthScore >= 70
        ? 'Stable'
        : 'Needs Review'

  const healthArabicStatus =
    healthScore >= 85
      ? 'ممتاز'
      : healthScore >= 70
        ? 'مستقر'
        : 'يحتاج متابعة'

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

      <ImageBackground
       source={require('@/assets/images/abha.jpg')}
       style={styles.heroImage}
       imageStyle={styles.heroImageStyle}
       resizeMode="cover"
      >
        <View style={styles.heroOverlay}>
          <Text style={styles.badge}>BASEERAH AI</Text>

          <Text style={styles.title}>أبها</Text>

          <Text style={styles.subtitle}>
            منصة ذكاء اصطناعي وتوأم رقمي لمراقبة المؤشرات الحضرية وتحليل البيانات التشغيلية.
          </Text>

          <View style={styles.liveRow}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>مباشر</Text>
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

              <View
                style={[
                  styles.progressBar,
                  {
                    backgroundColor: `${item.color}25`,
                  },
                ]}
              >
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: item.color,
                      width: `${Math.min(item.progress, 100)}%`,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.aiCardFeatured}>
        <View style={styles.cardHeaderRow}>
          <View>
            <Text style={styles.aiTitle}>توصية بصيرة</Text>
            <Text style={styles.aiSubTitle}>آخر توصية تشغيلية من الذكاء الاصطناعي</Text>
          </View>

          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>AI</Text>
          </View>
        </View>

        <Text style={styles.aiText}>
          {latestRecommendation ||
            'لا توجد توصية AI محفوظة حاليًا. سيتم عرض التوصيات بعد تحديث التحليل الذكي.'}
        </Text>
      </View>

      <View style={styles.alertCard}>
        <View style={styles.cardHeaderRow}>
          <View>
            <Text style={styles.alertTitle}>آخر التنبيهات</Text>
            <Text style={styles.alertSubTitle}>أحدث الحالات التشغيلية</Text>
          </View>

          <Text style={styles.alertCount}>{latestAlerts.length}</Text>
        </View>

        {latestAlerts.length === 0 ? (
          <Text style={styles.emptyTextSmall}>
            لا توجد تنبيهات حالية.
          </Text>
        ) : (
          latestAlerts.map((alert, index) => (
            <View key={alert.id || index} style={styles.alertRow}>
              <Text
                style={[
                  styles.alertDot,
                  {
                    color: getAlertColor(alert),
                  },
                ]}
              >
                ●
              </Text>

              <Text style={styles.alertItem}>
                {getAlertTypeName(alert)} - {getRegionName(alert)}
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.healthCard}>
        <Text style={styles.healthLabel}>CITY HEALTH SCORE</Text>

        <Text style={styles.healthValue}>
          {healthScore || 0}
        </Text>

        <Text style={styles.healthStatus}>
          {healthStatus}
        </Text>

        <View style={styles.healthBar}>
          <View
            style={[
              styles.healthFill,
              {
                width: `${healthScore || 0}%`,
              },
            ]}
          />
        </View>

        <Text style={styles.healthText}>
          مؤشر السلامة الحالي: {healthArabicStatus}. يتم احتسابه من متوسط مؤشرات السلامة في المناطق.
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
          height={220}
          chartConfig={{
            backgroundGradientFrom: '#0F172A',
            backgroundGradientTo: '#0F172A',
            decimalPlaces: 0,
            color: () => '#22D3EE',
            labelColor: () => '#64748B',
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#22D3EE',
            },
          }}
          bezier
          style={styles.chart}
        />
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
    marginBottom: 24,
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
   backgroundColor: 'rgba(3,7,18,0.38)',
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
   textShadowColor: 'rgba(0,0,0,0.65)',
   textShadowOffset: {
    width: 0,
    height: 2,
   },
   textShadowRadius: 8,
  },

  subtitle: {
  color: '#FFFFFF',
  fontSize: 15,
  lineHeight: 28,
  marginTop: 12,
  textAlign: 'right',

  textShadowColor: 'rgba(0,0,0,0.85)',
  textShadowOffset: {
    width: 0,
    height: 2,
  },
  textShadowRadius: 8,
},

ssubtitle: {
  color: '#E2E8F0',
  fontSize: 15,
  lineHeight: 28,
  marginTop: 12,
  textAlign: 'right',
  textShadowColor: 'rgba(0,0,0,0.65)',
  textShadowOffset: {
    width: 0,
    height: 1,
  },
  textShadowRadius: 6,
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

  aiCardFeatured: {
    backgroundColor: 'rgba(7,17,31,0.94)',
    borderRadius: 32,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.22)',
    marginTop: 24,
    shadowColor: '#22D3EE',
    shadowOpacity: 0.16,
    shadowRadius: 22,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 12,
  },

  cardHeaderRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },

  aiTitle: {
    color: '#22D3EE',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'right',
  },

  aiSubTitle: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'right',
  },

  aiBadge: {
    width: 46,
    height: 46,
    borderRadius: 18,
    backgroundColor: 'rgba(34,211,238,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  aiBadgeText: {
    color: '#22D3EE',
    fontSize: 16,
    fontWeight: '900',
  },

  aiText: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 28,
    textAlign: 'right',
  },

  alertCard: {
    backgroundColor: 'rgba(15,23,42,0.90)',
    borderRadius: 30,
    padding: 22,
    marginTop: 22,
    borderWidth: 1,
    borderColor: 'rgba(251,146,60,0.18)',
  },

  alertTitle: {
    color: '#FB923C',
    fontSize: 21,
    fontWeight: '900',
    textAlign: 'right',
  },

  alertSubTitle: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'right',
  },

  alertCount: {
    color: '#FB923C',
    fontSize: 30,
    fontWeight: '900',
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

  emptyTextSmall: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 24,
    textAlign: 'right',
  },

  healthCard: {
    backgroundColor: 'rgba(7,17,31,0.92)',
    borderRadius: 34,
    padding: 24,
    alignItems: 'center',
    marginTop: 22,
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
    fontSize: 68,
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
    marginTop: 22,
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
})