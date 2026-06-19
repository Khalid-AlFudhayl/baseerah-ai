import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

const WEB_DASHBOARD_URL = 'https://baseerah-ai-ten.vercel.app'

export default function SettingsScreen() {
  const openWebDashboard = async () => {
    try {
      await Linking.openURL(WEB_DASHBOARD_URL)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.glowCircle} />
      <View style={styles.glowCircleTwo} />

      <View style={styles.headerCard}>
        <Text style={styles.badge}>
          BASEERAH SETTINGS
        </Text>

        <Text style={styles.title}>
          الإعدادات
        </Text>

        <Text style={styles.subtitle}>
          معلومات عامة عن تطبيق بصيرة وطريقة استخدام لوحة الويب لإدارة النظام.
        </Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.iconBox}>
            <Text style={styles.iconText}>↻</Text>
          </View>

          <View style={styles.headerTextWrapper}>
            <Text style={styles.cardTitle}>
              تحديث الصفحات
            </Text>

            <Text style={styles.cardDescription}>
              يمكن تحديث صفحات التطبيق بالسحب للأسفل عند الحاجة.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.iconBox}>
            <Text style={styles.iconText}>👁</Text>
          </View>

          <View style={styles.headerTextWrapper}>
            <Text style={styles.cardTitle}>
              دور تطبيق الجوال
            </Text>

            <Text style={styles.cardDescription}>
              تطبيق الجوال مخصص للمتابعة والعرض السريع للمؤشرات، التنبيهات، التحليلات، وتوصيات الذكاء الاصطناعي.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.warningCard}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.warningIconBox}>
            <Text style={styles.warningIconText}>!</Text>
          </View>

          <View style={styles.headerTextWrapper}>
            <Text style={styles.warningTitle}>
              إدارة البيانات
            </Text>

            <Text style={styles.cardDescription}>
              إضافة المناطق وتعديلها وحذفها تتم من لوحة الويب فقط حسب صلاحيات المستخدم.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.warningCard}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.warningIconBox}>
            <Text style={styles.warningIconText}>A</Text>
          </View>

          <View style={styles.headerTextWrapper}>
            <Text style={styles.warningTitle}>
              إدارة المستخدمين
            </Text>

            <Text style={styles.cardDescription}>
              قائمة المستخدمين والصلاحيات متاحة من لوحة الويب لحساب المدير Admin فقط.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.webCard}>
        <Text style={styles.webTitle}>
          لوحة الويب
        </Text>

        <Text style={styles.webDescription}>
          للانتقال إلى لوحة التحكم الكاملة وإدارة النظام، اضغط الزر التالي.
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.webButton,
            pressed && styles.webButtonPressed,
          ]}
          onPress={openWebDashboard}
        >
          <Text style={styles.webButtonText}>
            فتح لوحة الويب
          </Text>
        </Pressable>

        <Text style={styles.webUrl}>
          {WEB_DASHBOARD_URL}
        </Text>
      </View>

      <View style={styles.systemCard}>
        <Text style={styles.sectionTitle}>
          معلومات النظام
        </Text>

        <InfoRow label="اسم المشروع" value="Baseerah AI" />
        <InfoRow label="المدينة الأساسية" value="Abha" />
        <InfoRow label="نوع التطبيق" value="Smart City Monitoring" />
        <InfoRow label="المطور" value="Khalid AlFudhayl" />
        <InfoRow label="حالة الربط" value="Render + Neon + Vercel" />
      </View>
    </ScrollView>
  )
}

function InfoRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoValue}>
        {value}
      </Text>

      <Text style={styles.infoLabel}>
        {label}
      </Text>
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
    backgroundColor: 'rgba(74,222,128,0.05)',
    top: 420,
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
    fontSize: 34,
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

  infoCard: {
    backgroundColor: 'rgba(15,23,42,0.88)',
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.12)',
    marginBottom: 14,
  },

  warningCard: {
    backgroundColor: 'rgba(24,18,8,0.88)',
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(251,146,60,0.18)',
    marginBottom: 14,
  },

  cardHeaderRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 14,
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: 'rgba(34,211,238,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconText: {
    color: '#22D3EE',
    fontSize: 22,
    fontWeight: '900',
  },

  warningIconBox: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: 'rgba(251,146,60,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(251,146,60,0.24)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  warningIconText: {
    color: '#FB923C',
    fontSize: 20,
    fontWeight: '900',
  },

  headerTextWrapper: {
    flex: 1,
  },

  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'right',
  },

  warningTitle: {
    color: '#FB923C',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'right',
  },

  cardDescription: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 24,
    marginTop: 8,
    textAlign: 'right',
  },

  webCard: {
    backgroundColor: 'rgba(7,17,31,0.94)',
    borderRadius: 30,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.20)',
    marginTop: 4,
    marginBottom: 18,
  },

  webTitle: {
    color: '#22D3EE',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'right',
  },

  webDescription: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 24,
    marginTop: 10,
    textAlign: 'right',
  },

  webButton: {
    backgroundColor: '#22D3EE',
    borderRadius: 20,
    paddingVertical: 15,
    marginTop: 18,
    alignItems: 'center',
  },

  webButtonPressed: {
    opacity: 0.75,
  },

  webButtonText: {
    color: '#03111F',
    fontSize: 15,
    fontWeight: '900',
  },

  webUrl: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 12,
    textAlign: 'center',
  },

  systemCard: {
    backgroundColor: 'rgba(15,23,42,0.88)',
    borderRadius: 30,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 16,
    textAlign: 'right',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 13,
    gap: 12,
  },

  infoLabel: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'right',
  },

  infoValue: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'left',
    flex: 1,
  },
})