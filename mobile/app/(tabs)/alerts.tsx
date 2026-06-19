import { useEffect, useState } from 'react'

import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { apiGet } from '@/utils/baseerahApi'

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const fetchAlerts = async () => {
    try {
      setErrorMessage('')

      const [alertsData, citiesData] = await Promise.all([
        apiGet('/alerts'),
        apiGet('/cities'),
      ])

      if (Array.isArray(alertsData)) {
        setAlerts(alertsData)
      }

      if (Array.isArray(citiesData)) {
        setCities(citiesData)
      }
    } catch (error) {
      console.log(error)
      setErrorMessage('تعذر تحميل التنبيهات. تأكد من اتصال الإنترنت ووجود حساب demo@baseerah.ai على Render.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAlerts()

    const interval = setInterval(() => {
      fetchAlerts()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchAlerts()
  }

  const normalize = (value: any) => {
    return String(value || '').trim().toUpperCase()
  }

  const getAlertType = (alert: any) => {
    const type = normalize(alert.alert_type)

    if (type.includes('TRAFFIC')) return 'TRAFFIC'
    if (type.includes('AIR')) return 'AIR'
    if (type.includes('SECURITY')) return 'SECURITY'
    if (type.includes('ENERGY')) return 'ENERGY'
    if (type.includes('WATER')) return 'WATER'

    return 'OTHER'
  }

  const getAlertTitle = (alert: any) => {
    if (alert.title) return alert.title

    const type = getAlertType(alert)

    if (type === 'TRAFFIC') return 'تنبيه مروري'
    if (type === 'AIR') return 'تنبيه جودة الهواء'
    if (type === 'SECURITY') return 'تنبيه أمني'
    if (type === 'ENERGY') return 'تنبيه الطاقة'
    if (type === 'WATER') return 'تنبيه المياه'

    return 'تنبيه تشغيلي'
  }

  const getAlertLevel = (alert: any) => {
    const severity = normalize(alert.severity || alert.level)

    if (severity.includes('CRITICAL')) return 'حرج'
    if (severity.includes('HIGH')) return 'مرتفع'
    if (severity.includes('MEDIUM')) return 'متوسط'
    if (severity.includes('LOW')) return 'منخفض'

    return 'متوسط'
  }

  const getRegionName = (alert: any) => {
    const city = cities.find((item) => {
      return Number(item.id) === Number(alert.region_id)
    })

    return city?.city || 'منطقة غير محددة'
  }

  const getLevelColor = (level: string) => {
    if (level === 'حرج') return '#DC2626'
    if (level === 'مرتفع') return '#EF4444'
    if (level === 'متوسط') return '#F59E0B'
    return '#22D3EE'
  }

  const getLevelIcon = (level: string) => {
    if (level === 'حرج') return '●'
    if (level === 'مرتفع') return '●'
    if (level === 'متوسط') return '◆'
    return '•'
  }

  const formatTime = (createdAt: string) => {
    if (!createdAt) return 'الآن'

    return new Date(createdAt).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const highCount = alerts.filter((item) => {
    const level = getAlertLevel(item)
    return level === 'حرج' || level === 'مرتفع'
  }).length

  const mediumCount = alerts.filter((item) => {
    return getAlertLevel(item) === 'متوسط'
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
      <View style={styles.redGlow} />

      <View style={styles.headerCard}>
        <Text style={styles.badge}>
          EMERGENCY CENTER
        </Text>

        <Text style={styles.title}>
          التنبيهات
        </Text>

        <Text style={styles.subtitle}>
          مركز مراقبة التنبيهات التشغيلية والحالات الحرجة داخل منصة بصيرة.
        </Text>

        <View style={styles.headerStatsRow}>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatValue}>
              {alerts.length}
            </Text>

            <Text style={styles.headerStatLabel}>
              نشطة
            </Text>
          </View>

          <View style={styles.headerStat}>
            <Text style={[styles.headerStatValue, { color: '#EF4444' }]}>
              {highCount}
            </Text>

            <Text style={styles.headerStatLabel}>
              مرتفع
            </Text>
          </View>

          <View style={styles.headerStat}>
            <Text style={[styles.headerStatValue, { color: '#F59E0B' }]}>
              {mediumCount}
            </Text>

            <Text style={styles.headerStatLabel}>
              متوسط
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
            تعذر تحميل التنبيهات
          </Text>

          <Text style={styles.emptyText}>
            {errorMessage}
          </Text>
        </View>
      ) : alerts.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>✓</Text>

          <Text style={styles.emptyTitle}>
            لا توجد تنبيهات حالياً
          </Text>

          <Text style={styles.emptyText}>
            جميع المؤشرات التشغيلية ضمن النطاق الطبيعي.
          </Text>
        </View>
      ) : (
        alerts.map((alert, index) => {
          const level = getAlertLevel(alert)
          const color = getLevelColor(level)

          return (
            <View
              key={alert.id || index}
              style={[
                styles.alertCard,
                {
                  borderColor: `${color}33`,
                },
              ]}
            >
              <View style={styles.alertTopRow}>
                <View
                  style={[
                    styles.levelBadge,
                    {
                      backgroundColor: `${color}18`,
                      borderColor: `${color}44`,
                    },
                  ]}
                >
                  <Text style={[styles.levelIcon, { color }]}>
                    {getLevelIcon(level)}
                  </Text>

                  <Text style={[styles.levelText, { color }]}>
                    {level}
                  </Text>
                </View>

                <Text style={styles.alertTime}>
                  {alert.time || formatTime(alert.created_at)}
                </Text>
              </View>

              <Text style={styles.regionText}>
                {getRegionName(alert)}
              </Text>

              <Text style={styles.alertTitle}>
                {getAlertTitle(alert)}
              </Text>

              <Text style={styles.alertDescription}>
                {alert.message || alert.description || 'لا توجد تفاصيل للتنبيه'}
              </Text>

              <View style={styles.alertFooter}>
                <View
                  style={[
                    styles.alertLine,
                    {
                      backgroundColor: color,
                    },
                  ]}
                />

                <Text style={styles.footerText}>
                  آخر تحديث: الآن
                </Text>
              </View>
            </View>
          )
        })
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

  redGlow: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: 'rgba(239,68,68,0.10)',
    top: -80,
    right: -70,
  },

  headerCard: {
    backgroundColor: 'rgba(20,11,18,0.94)',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.18)',
    marginBottom: 18,
  },

  badge: {
    color: '#EF4444',
    fontSize: 10,
    letterSpacing: 4,
    marginBottom: 12,
    textAlign: 'right',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 36,
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

  alertCard: {
    backgroundColor: 'rgba(15,23,42,0.90)',
    borderRadius: 28,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
  },

  alertTopRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  levelBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },

  levelIcon: {
    fontSize: 13,
    fontWeight: '900',
  },

  levelText: {
    fontSize: 12,
    fontWeight: '900',
  },

  alertTime: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '700',
  },

  regionText: {
    color: '#22D3EE',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'right',
    marginBottom: 8,
  },

  alertTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'right',
  },

  alertDescription: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 25,
    marginTop: 12,
    textAlign: 'right',
  },

  alertFooter: {
    marginTop: 18,
  },

  alertLine: {
    height: 5,
    borderRadius: 999,
    width: '100%',
  },

  footerText: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 8,
    textAlign: 'right',
  },
})