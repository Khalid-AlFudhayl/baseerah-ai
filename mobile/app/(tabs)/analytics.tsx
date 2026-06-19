import { useEffect, useState } from 'react'

import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { LineChart } from 'react-native-chart-kit'

import { apiGet } from '@/utils/baseerahApi'

const screenWidth = Dimensions.get('window').width

export default function AnalyticsScreen() {
  const [cities, setCities] = useState<any[]>([])
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

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

  const fetchAnalyticsData = async () => {
    try {
      setErrorMessage('')

      const [citiesData, recommendationsData] = await Promise.all([
        apiGet('/cities'),
        apiGet('/ai-recommendations'),
      ])

      if (Array.isArray(citiesData)) {
        setCities(citiesData)
      }

      if (Array.isArray(recommendationsData)) {
        setRecommendations(recommendationsData)
      }
    } catch (error) {
      console.log(error)
      setErrorMessage('تعذر تحميل بيانات التحليلات. تأكد من الاتصال بالإنترنت.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchAnalyticsData()
  }

  const trafficAverage = getAverage(cities, 'traffic')
  const airAverage = getAverage(cities, 'air')
  const energyAverage = getAverage(cities, 'energy')
  const waterAverage = getAverage(cities, 'water')
  const securityAverage = getAverage(cities, 'security')

  const chartValues = [
    trafficAverage,
    airAverage,
    energyAverage,
    waterAverage,
    securityAverage,
  ].map((value) => value || 0)

  const strongestIssue = [
    {
      label: 'حركة المرور',
      value: trafficAverage,
      color: '#FB923C',
    },
    {
      label: 'جودة الهواء',
      value: airAverage,
      color: '#22D3EE',
    },
    {
      label: 'الطاقة',
      value: energyAverage,
      color: '#FACC15',
    },
    {
      label: 'المياه',
      value: waterAverage,
      color: '#60A5FA',
    },
  ].sort((a, b) => b.value - a.value)[0]

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
        <Text style={styles.badge}>AI ANALYTICS</Text>

        <Text style={styles.title}>
          التحليلات والتوصيات
        </Text>

        <Text style={styles.subtitle}>
          قراءة ذكية لمؤشرات المدينة مع عرض آخر توصيات الذكاء الاصطناعي المحفوظة.
        </Text>

        <View style={styles.headerStatsRow}>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatValue}>
              {cities.length}
            </Text>

            <Text style={styles.headerStatLabel}>
              مناطق
            </Text>
          </View>

          <View style={styles.headerStat}>
            <Text style={[styles.headerStatValue, { color: '#22D3EE' }]}>
              {recommendations.length}
            </Text>

            <Text style={styles.headerStatLabel}>
              توصيات
            </Text>
          </View>

          <View style={styles.headerStat}>
            <Text style={[styles.headerStatValue, { color: '#4ADE80' }]}>
              {securityAverage || 0}
            </Text>

            <Text style={styles.headerStatLabel}>
              السلامة
            </Text>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator
            size="large"
            color="#22D3EE"
          />
        </View>
      ) : errorMessage ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>!</Text>

          <Text style={styles.emptyTitle}>
            تعذر تحميل التحليلات
          </Text>

          <Text style={styles.emptyText}>
            {errorMessage}
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.insightCard}>
            <Text style={styles.insightLabel}>
              المؤشر الأعلى حاليًا
            </Text>

            <Text style={[styles.insightValue, { color: strongestIssue?.color || '#22D3EE' }]}>
              {strongestIssue?.label || 'غير محدد'}
            </Text>

            <Text style={styles.insightText}>
              متوسط القيمة الحالية: {strongestIssue?.value || 0}
            </Text>
          </View>

          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>
                مقارنة المؤشرات
              </Text>

              <Text style={styles.chartSub}>
                المرور، الهواء، الطاقة، المياه، السلامة
              </Text>
            </View>

            <LineChart
              data={{
                labels: ['مرور', 'هواء', 'طاقة', 'مياه', 'سلامة'],
                datasets: [{ data: chartValues }],
              }}
              width={screenWidth - 70}
              height={230}
              chartConfig={{
                backgroundGradientFrom: '#0F172A',
                backgroundGradientTo: '#0F172A',
                decimalPlaces: 0,
                color: () => '#22D3EE',
                labelColor: () => '#94A3B8',
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

          <View style={styles.recommendationsCard}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>
                  توصيات الذكاء الاصطناعي
                </Text>

                <Text style={styles.sectionSubTitle}>
                  آخر التوصيات التشغيلية المحفوظة
                </Text>
              </View>

              <View style={styles.aiBadge}>
                <Text style={styles.aiBadgeText}>AI</Text>
              </View>
            </View>

            {recommendations.length === 0 ? (
              <Text style={styles.emptyTextSmall}>
                لا توجد توصيات AI محفوظة حاليًا.
              </Text>
            ) : (
              recommendations.slice(0, 6).map((item, index) => (
                <View
                  key={item.id || index}
                  style={styles.recommendationItem}
                >
                  <View style={styles.recommendationTopRow}>
                    <Text style={styles.recommendationCity}>
                      {item.city_name || 'منطقة غير محددة'}
                    </Text>

                    <Text style={styles.recommendationNumber}>
                      #{index + 1}
                    </Text>
                  </View>

                  <Text style={styles.recommendationText}>
                    {item.recommendation || 'لا توجد توصية'}
                  </Text>
                </View>
              ))
            )}
          </View>
        </>
      )}
    </ScrollView>
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
    width: 230,
    height: 230,
    borderRadius: 999,
    backgroundColor: 'rgba(34,211,238,0.08)',
    top: -80,
    right: -80,
  },

  glowCircleTwo: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: 'rgba(168,85,247,0.07)',
    top: 430,
    left: -100,
  },

  headerCard: {
    backgroundColor: 'rgba(11,18,32,0.92)',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.14)',
    marginBottom: 18,
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

  headerStatsRow: {
    flexDirection: 'row-reverse',
    gap: 10,
    marginTop: 20,
  },

  headerStat: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.78)',
    borderRadius: 18,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },

  headerStatValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
  },

  headerStatLabel: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 5,
    textAlign: 'center',
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
    borderColor: 'rgba(239,68,68,0.18)',
  },

  emptyIcon: {
    color: '#EF4444',
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

  insightCard: {
    backgroundColor: 'rgba(7,17,31,0.94)',
    borderRadius: 30,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.18)',
    marginBottom: 18,
  },

  insightLabel: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'right',
  },

  insightValue: {
    fontSize: 34,
    fontWeight: '900',
    marginTop: 10,
    textAlign: 'right',
  },

  insightText: {
    color: '#CBD5E1',
    fontSize: 13,
    marginTop: 10,
    textAlign: 'right',
  },

  chartCard: {
    backgroundColor: 'rgba(15,23,42,0.88)',
    borderRadius: 32,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.12)',
    marginBottom: 18,
  },

  chartHeader: {
    marginBottom: 10,
  },

  chartTitle: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '900',
    textAlign: 'right',
  },

  chartSub: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 6,
    textAlign: 'right',
  },

  chart: {
    borderRadius: 24,
    marginTop: 12,
  },

  recommendationsCard: {
    backgroundColor: 'rgba(7,17,31,0.94)',
    borderRadius: 32,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.16)',
  },

  sectionHeaderRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'right',
  },

  sectionSubTitle: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'right',
  },

  aiBadge: {
    width: 46,
    height: 46,
    borderRadius: 18,
    backgroundColor: 'rgba(168,85,247,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  aiBadgeText: {
    color: '#C084FC',
    fontSize: 16,
    fontWeight: '900',
  },

  recommendationItem: {
    backgroundColor: 'rgba(15,23,42,0.86)',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 12,
  },

  recommendationTopRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  recommendationCity: {
    color: '#C084FC',
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'right',
  },

  recommendationNumber: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '800',
  },

  recommendationText: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 25,
    textAlign: 'right',
  },

  emptyTextSmall: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 24,
    textAlign: 'right',
  },
})