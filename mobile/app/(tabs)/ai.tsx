import { useEffect, useRef, useState } from 'react'

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

import { apiPost } from '@/utils/baseerahApi'

type Message = {
  id: number
  role: 'user' | 'assistant'
  text: string
}

const suggestions = [
  'ما حالة المرور الآن؟',
  'ما أعلى منطقة في استهلاك الطاقة؟',
  'حلل جودة الهواء في المناطق',
  'اعرض التنبيهات الحالية',
]

export default function AIScreen() {
  const scrollRef = useRef<ScrollView | null>(null)

  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      text: 'مرحباً، أنا مساعد بصيرة الذكي. أستطيع تحليل بيانات المدن، التنبيهات، المؤشرات التشغيلية، والتوصيات المحفوظة.',
    },
  ])

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }, [messages, loading])

  const askAI = async (customQuestion?: string) => {
    const finalQuestion = customQuestion || question

    if (!finalQuestion.trim() || loading) return

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      text: finalQuestion,
    }

    setMessages((prev) => [...prev, userMessage])
    setQuestion('')

    try {
      setLoading(true)

      const data = await apiPost('/ai', {
        question: finalQuestion,
      })

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        text: data?.reply || 'لم أتمكن من تحليل البيانات حالياً.',
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.log(error)

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: 'assistant',
          text: 'تعذر الاتصال بمحرك بصيرة الذكي حالياً. تأكد من الاتصال بالإنترنت ثم حاول مرة أخرى.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: 'assistant',
        text: 'تم بدء محادثة جديدة. اسألني عن حالة المدينة أو التنبيهات أو التوصيات.',
      },
    ])
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 18 : 0}
    >
      <View style={styles.wrapper}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.glowCircle} />
          <View style={styles.glowCircleTwo} />

          <View style={styles.heroCard}>
            <View style={styles.heroTopRow}>
              <View style={styles.aiIconBox}>
                <Text style={styles.aiIconText}>AI</Text>
              </View>

              <View style={styles.heroTextWrapper}>
                <Text style={styles.badge}>
                  BASEERAH AI COPILOT
                </Text>

                <Text style={styles.title}>
                  مساعد بصيرة
                </Text>
              </View>
            </View>

            <Text style={styles.subtitle}>
              مساعد ذكي يقرأ بيانات المدن والتنبيهات والتوصيات المحفوظة ليقدم إجابات تشغيلية مختصرة.
            </Text>

            <View style={styles.statusRow}>
              <View style={styles.statusBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.statusText}>متصل</Text>
              </View>

              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Render API</Text>
              </View>
            </View>
          </View>

          <View style={styles.contextCard}>
            <Text style={styles.contextTitle}>
              نطاق الإجابة
            </Text>

            <Text style={styles.contextText}>
              يعتمد المساعد على بيانات المدن، التنبيهات الحالية، وآخر توصيات الذكاء الاصطناعي المحفوظة في النظام.
            </Text>
          </View>

          <View style={styles.suggestionsCard}>
            <View style={styles.suggestionsHeader}>
              <Text style={styles.suggestionsTitle}>
                اقتراحات سريعة
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={clearChat}
              >
                <Text style={styles.clearText}>
                  مسح المحادثة
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.suggestionsGrid}>
              {suggestions.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  activeOpacity={0.8}
                  onPress={() => askAI(item)}
                  disabled={loading}
                >
                  <Text style={styles.suggestionText}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.chatContainer}>
            {messages.map((message) => {
              const isUser = message.role === 'user'

              return (
                <View
                  key={message.id}
                  style={[
                    styles.messageRow,
                    isUser ? styles.userRow : styles.assistantRow,
                  ]}
                >
                  <View
                    style={[
                      styles.messageBubble,
                      isUser ? styles.userBubble : styles.assistantBubble,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageLabel,
                        isUser ? styles.userLabel : styles.assistantLabel,
                      ]}
                    >
                      {isUser ? 'أنت' : 'بصيرة'}
                    </Text>

                    <Text style={styles.messageText}>
                      {message.text}
                    </Text>
                  </View>
                </View>
              )
            })}

            {loading && (
              <View style={styles.assistantRow}>
                <View style={styles.typingBubble}>
                  <ActivityIndicator
                    size="small"
                    color="#22D3EE"
                  />

                  <Text style={styles.typingText}>
                    بصيرة تحلل البيانات...
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.inputBar}>
          <TextInput
            value={question}
            onChangeText={setQuestion}
            placeholder="اكتب سؤالك هنا..."
            placeholderTextColor="#64748B"
            multiline
            style={styles.input}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              (!question.trim() || loading) && styles.sendButtonDisabled,
            ]}
            onPress={() => askAI()}
            disabled={!question.trim() || loading}
            activeOpacity={0.8}
          >
            <Text style={styles.sendButtonText}>
              إرسال
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#030712',
  },

  wrapper: {
    flex: 1,
  },

  content: {
    padding: 18,
    paddingTop: 58,
    paddingBottom: 34,
  },

  glowCircle: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: 'rgba(34,211,238,0.08)',
    top: -80,
    right: -70,
  },

  glowCircleTwo: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: 'rgba(168,85,247,0.07)',
    top: 420,
    left: -90,
  },

  heroCard: {
    backgroundColor: 'rgba(11,18,32,0.94)',
    borderRadius: 30,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.18)',
    marginBottom: 14,
  },

  heroTopRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 14,
  },

  aiIconBox: {
    width: 58,
    height: 58,
    borderRadius: 22,
    backgroundColor: 'rgba(34,211,238,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.24)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  aiIconText: {
    color: '#22D3EE',
    fontSize: 20,
    fontWeight: '900',
  },

  heroTextWrapper: {
    flex: 1,
  },

  badge: {
    color: '#22D3EE',
    fontSize: 10,
    letterSpacing: 3,
    marginBottom: 10,
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
    marginTop: 14,
    textAlign: 'right',
  },

  statusRow: {
    flexDirection: 'row-reverse',
    gap: 10,
    marginTop: 18,
  },

  statusBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(15,23,42,0.82)',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#4ADE80',
  },

  statusText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '800',
  },

  contextCard: {
    backgroundColor: 'rgba(7,17,31,0.94)',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.14)',
    marginBottom: 14,
  },

  contextTitle: {
    color: '#4ADE80',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'right',
  },

  contextText: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 24,
    marginTop: 8,
    textAlign: 'right',
  },

  suggestionsCard: {
    backgroundColor: 'rgba(15,23,42,0.88)',
    borderRadius: 26,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 18,
  },

  suggestionsHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
  },

  suggestionsTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'right',
  },

  clearText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '800',
  },

  suggestionsGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },

  suggestionItem: {
    width: '48%',
    backgroundColor: '#111827',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.08)',
  },

  suggestionText: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '700',
  },

  chatContainer: {
    gap: 14,
  },

  messageRow: {
    width: '100%',
  },

  userRow: {
    alignItems: 'flex-end',
  },

  assistantRow: {
    alignItems: 'flex-start',
  },

  messageBubble: {
    maxWidth: '90%',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
  },

  userBubble: {
    backgroundColor: 'rgba(34,211,238,0.16)',
    borderColor: 'rgba(34,211,238,0.24)',
    borderTopRightRadius: 8,
  },

  assistantBubble: {
    backgroundColor: 'rgba(15,23,42,0.92)',
    borderColor: 'rgba(255,255,255,0.06)',
    borderTopLeftRadius: 8,
  },

  messageLabel: {
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 8,
  },

  userLabel: {
    color: '#22D3EE',
    textAlign: 'right',
  },

  assistantLabel: {
    color: '#4ADE80',
    textAlign: 'right',
  },

  messageText: {
    color: '#E2E8F0',
    fontSize: 14,
    lineHeight: 26,
    textAlign: 'right',
  },

  typingBubble: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(15,23,42,0.92)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.10)',
  },

  typingText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
  },

  inputBar: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    gap: 10,
    backgroundColor: 'rgba(7,17,31,0.98)',
    borderTopWidth: 1,
    borderColor: 'rgba(34,211,238,0.14)',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
  },

  input: {
    flex: 1,
    maxHeight: 110,
    minHeight: 46,
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'right',
    textAlignVertical: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(15,23,42,0.90)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.10)',
  },

  sendButton: {
    backgroundColor: '#22D3EE',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },

  sendButtonDisabled: {
    opacity: 0.45,
  },

  sendButtonText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '900',
  },
})