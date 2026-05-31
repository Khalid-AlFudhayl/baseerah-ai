import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

const API_URL = 'http://192.168.8.219:5000'

export default function SettingsScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.glowBlue} />
      <View style={styles.glowGreen} />

      <View style={styles.heroCard}>
        <Text style={styles.badge}>SYSTEM CONTROL</Text>

        <Text style={styles.title}>مركز التحكم</Text>

        <Text style={styles.subtitle}>
          إدارة منصة بصيرة ومراقبة حالة الأنظمة والخدمات الذكية.
        </Text>
      </View>

      <View style={styles.statusGrid}>
        <ControlCard title="النظام" value="متصل" color="#4ADE80" />
        <ControlCard title="الذكاء" value="نشط" color="#FACC15" />
        <ControlCard title="الويب" value="متصل" color="#22D3EE" />
        <ControlCard title="الجوال" value="جاهز" color="#60A5FA" />
      </View>

      <View style={styles.projectCard}>
        <Text style={styles.projectBadge}>BASEERAH AI</Text>

        <Text style={styles.projectTitle}>
          Smart City Digital Twin
        </Text>

        <Text style={styles.projectText}>
          Abha Smart City Platform
        </Text>

        <View style={styles.projectMeta}>
          <Text style={styles.metaText}>King Khalid University</Text>
          <Text style={styles.metaText}>Version 1.0</Text>
        </View>
      </View>

      <View style={styles.developerCard}>
        <Text style={styles.sectionLabel}>المطور</Text>

        <Text style={styles.developerName}>
          Khalid AlFudhayl
        </Text>

        <Text style={styles.developerRole}>
          System Administrator
        </Text>

        <Text style={styles.developerInfo}>
          Computer Science · King Khalid University
        </Text>
      </View>

      <View style={styles.techCard}>
        <Text style={styles.sectionLabel}>التقنيات</Text>

        <View style={styles.chips}>
          <Chip label="Backend API" />
          <Chip label="PostgreSQL" />
          <Chip label="Socket.IO" />
          <Chip label="Expo" />
          <Chip label="React Native" />
          <Chip label="EAS Build" />
          <Chip label="Baseerah Copilot" />
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>تكامل المنصة</Text>

        <Text style={styles.infoText}>
          منصة بصيرة تجمع بين لوحة التحكم وتطبيق الجوال ومحرك الذكاء الاصطناعي
          ضمن بيئة تشغيل موحدة لمراقبة المدن الذكية وتحليل المؤشرات التشغيلية
          بشكل لحظي.
        </Text>

        <Text style={styles.apiText}>
          {API_URL}
        </Text>
      </View>
    </ScrollView>
  )
}

function ControlCard({
  title,
  value,
  color,
}: {
  title: string
  value: string
  color: string
}) {
  return (
    <View style={styles.controlCard}>
      <View style={[styles.statusDot, { backgroundColor: color }]} />

      <Text style={[styles.controlValue, { color }]}>
        {value}
      </Text>

      <Text style={styles.controlTitle}>
        {title}
      </Text>
    </View>
  )
}

function Chip({ label }: { label: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#020617',
  },

  content: {
    padding: 18,
    paddingTop: 58,
    paddingBottom: 115,
  },

  glowBlue: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 999,
    backgroundColor: 'rgba(34,211,238,0.10)',
    top: -90,
    right: -90,
  },

  glowGreen: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: 'rgba(74,222,128,0.06)',
    top: 330,
    left: -80,
  },

  heroCard: {
    backgroundColor: 'rgba(8,15,30,0.95)',
    borderRadius: 30,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.20)',
    marginBottom: 18,
  },

  badge: {
    color: '#22D3EE',
    fontSize: 10,
    letterSpacing: 4,
    marginBottom: 14,
    textAlign: 'right',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '900',
    textAlign: 'right',
  },

  subtitle: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 25,
    marginTop: 10,
    textAlign: 'right',
  },

  statusGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },

  controlCard: {
    width: '47%',
    minHeight: 125,
    backgroundColor: 'rgba(15,23,42,0.90)',
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'space-between',
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    alignSelf: 'flex-end',
  },

  controlValue: {
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'right',
  },

  controlTitle: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
  },

  projectCard: {
    backgroundColor: 'rgba(7,17,31,0.95)',
    borderRadius: 30,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.14)',
    marginBottom: 20,
  },

  projectBadge: {
    color: '#60A5FA',
    fontSize: 11,
    letterSpacing: 4,
    fontWeight: '900',
    textAlign: 'right',
  },

  projectTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 16,
    textAlign: 'right',
  },

  projectText: {
    color: '#CBD5E1',
    fontSize: 15,
    marginTop: 10,
    textAlign: 'right',
  },

  projectMeta: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginTop: 22,
    gap: 12,
  },

  metaText: {
    flex: 1,
    color: '#94A3B8',
    backgroundColor: 'rgba(15,23,42,0.85)',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },

  developerCard: {
    backgroundColor: 'rgba(15,23,42,0.92)',
    borderRadius: 30,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.12)',
    marginBottom: 20,
  },

  sectionLabel: {
    color: '#22D3EE',
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'right',
    marginBottom: 14,
  },

  developerName: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'right',
  },

  developerRole: {
    color: '#4ADE80',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 10,
    textAlign: 'right',
  },

  developerInfo: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 10,
    textAlign: 'right',
  },

  techCard: {
    backgroundColor: 'rgba(15,23,42,0.92)',
    borderRadius: 30,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.10)',
    marginBottom: 20,
  },

  chips: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 10,
  },

  chip: {
    backgroundColor: 'rgba(34,211,238,0.08)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.12)',
  },

  chipText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '800',
  },

  infoBox: {
    backgroundColor: 'rgba(3,7,18,0.92)',
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 40,
  },

  infoTitle: {
    color: '#22D3EE',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'right',
  },

  infoText: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 26,
    marginTop: 12,
    textAlign: 'right',
  },

  apiText: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 18,
    textAlign: 'left',
  },
})