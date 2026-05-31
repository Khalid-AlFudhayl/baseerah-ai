require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
const http = require('http')
const { Server } = require('socket.io')
const OpenAI = require('openai')

const {
  addPushToken,
  sendPushNotification,
} = require('./pushNotifications')

const app = express()
const server = http.createServer(app)

const PORT = process.env.PORT || 5000

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
})

app.use(cors())
app.use(express.json())

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'baseerah_ai',
  password: process.env.DB_PASSWORD || '123456',
  port: Number(process.env.DB_PORT) || 5432,
})

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

const getNumber = (value) => {
  return Number(String(value || '0').replace('%', '')) || 0
}

const ensureSchema = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS cities (
      id SERIAL PRIMARY KEY,
      city VARCHAR(100) NOT NULL,
      traffic VARCHAR(20),
      air VARCHAR(20),
      energy VARCHAR(20),
      water VARCHAR(20),
      security VARCHAR(20),
      status VARCHAR(50)
    );
  `)

  await pool.query(`
    ALTER TABLE cities
    ADD COLUMN IF NOT EXISTS energy VARCHAR(20),
    ADD COLUMN IF NOT EXISTS water VARCHAR(20),
    ADD COLUMN IF NOT EXISTS security VARCHAR(20);
  `)

  const result = await pool.query('SELECT COUNT(*) FROM cities')

  if (Number(result.rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO cities
      (city, traffic, air, energy, water, security, status)
      VALUES
      ('وسط أبها', '65%', '45', '72%', '68%', '88%', 'مستقر'),
      ('جامعة الملك خالد', '56%', '63', '79%', '74%', '91%', 'مستقر'),
      ('طريق الملك فهد', '89%', '43', '81%', '70%', '84%', 'مزدحم'),
      ('مطار أبها', '62%', '52', '69%', '63%', '86%', 'مستقر'),
      ('حي الموظفين', '48%', '46', '73%', '66%', '90%', 'مستقر');
    `)
  }

  await pool.query(`
    UPDATE cities
    SET
      energy = COALESCE(energy, '75%'),
      water = COALESCE(water, '70%'),
      security = COALESCE(security, '92%'),
      status = COALESCE(status, 'مستقر')
  `)
}

const getCities = async () => {
  const result = await pool.query(`
    SELECT *
    FROM cities
    ORDER BY id ASC
  `)

  return result.rows
}

const emitLiveData = async () => {
  try {
    const cities = await getCities()
    io.emit('cities:update', cities)
  } catch (error) {
    console.log('Emit live data error:', error.message)
  }
}

const sendCriticalAlerts = async (cities) => {
  for (const city of cities) {
    const traffic = getNumber(city.traffic)
    const energy = getNumber(city.energy)
    const security = getNumber(city.security)

    if (traffic >= 90) {
      await sendPushNotification({
        title: 'تنبيه مروري مرتفع',
        body: `${city.city} تسجل ازدحامًا مرتفعًا بنسبة ${city.traffic}`,
      })
    }

    if (energy >= 90) {
      await sendPushNotification({
        title: 'تنبيه استهلاك الطاقة',
        body: `${city.city} تسجل استهلاك طاقة مرتفع بنسبة ${city.energy}`,
      })
    }

    if (security < 83) {
      await sendPushNotification({
        title: 'تنبيه السلامة العامة',
        body: `${city.city} تسجل مؤشر أمان منخفض بنسبة ${city.security}`,
      })
    }
  }
}

const updateRandomCityData = async () => {
  try {
    const cities = await getCities()

    for (const city of cities) {
      const traffic = Math.floor(Math.random() * 51) + 45
      const air = Math.floor(Math.random() * 41) + 25
      const energy = Math.floor(Math.random() * 31) + 65
      const water = Math.floor(Math.random() * 31) + 60
      const security = Math.floor(Math.random() * 21) + 80

      let status = 'مستقر'

      if (traffic >= 80) {
        status = 'مزدحم'
      } else if (traffic >= 65) {
        status = 'نشط'
      }

      await pool.query(
        `
        UPDATE cities
        SET
          traffic = $1,
          air = $2,
          energy = $3,
          water = $4,
          security = $5,
          status = $6
        WHERE id = $7
        `,
        [
          `${traffic}%`,
          String(air),
          `${energy}%`,
          `${water}%`,
          `${security}%`,
          status,
          city.id,
        ]
      )
    }

    const updatedCities = await getCities()

    await sendCriticalAlerts(updatedCities)
    await emitLiveData()
  } catch (error) {
    console.log('Live update error:', error.message)
  }
}

const buildCitySummary = (cities) => {
  return cities.map((city) => `
المنطقة: ${city.city}
المرور: ${city.traffic}
جودة الهواء: ${city.air}
الطاقة: ${city.energy}
المياه: ${city.water}
السلامة: ${city.security}
الحالة: ${city.status}
`).join('\n')
}

const buildLocalAIReply = (message, cities) => {
  const userMessage = String(message || '').toLowerCase()

  const avg = (field) => {
    if (!cities.length) return 0

    const total = cities.reduce((sum, city) => {
      return sum + getNumber(city[field])
    }, 0)

    return Math.floor(total / cities.length)
  }

  const highestTraffic = [...cities].sort(
    (a, b) => getNumber(b.traffic) - getNumber(a.traffic)
  )[0]

  const bestAir = [...cities].sort(
    (a, b) => getNumber(a.air) - getNumber(b.air)
  )[0]

  const highestEnergy = [...cities].sort(
    (a, b) => getNumber(b.energy) - getNumber(a.energy)
  )[0]

  const highestWater = [...cities].sort(
    (a, b) => getNumber(b.water) - getNumber(a.water)
  )[0]

  const bestSecurity = [...cities].sort(
    (a, b) => getNumber(b.security) - getNumber(a.security)
  )[0]

  const matchedZone = cities.find((city) => {
    const cityName = String(city.city || '').toLowerCase()
    return cityName && userMessage.includes(cityName)
  })

if (matchedZone) {
  const traffic = getNumber(matchedZone.traffic)

  let statusText = 'المؤشرات الحالية ضمن النطاق الطبيعي ولا توجد تنبيهات حرجة.'

  if (traffic >= 80) {
    statusText = 'يوجد ازدحام مروري مرتفع، ويوصى بمتابعة المنطقة خلال ساعات الذروة.'
  } else if (traffic >= 65) {
    statusText = 'الحركة المرورية نشطة لكنها ما زالت تحت السيطرة.'
  }

  return `
📍 ${matchedZone.city}

الحالة العامة: ${matchedZone.status}

🚗 المرور: ${matchedZone.traffic}
🌬 جودة الهواء: ${matchedZone.air}
⚡ الطاقة: ${matchedZone.energy}
💧 المياه: ${matchedZone.water}
🛡 السلامة: ${matchedZone.security}

التقييم:
${statusText}
`
}

  if (
    userMessage.includes('مرور') ||
    userMessage.includes('زحام') ||
    userMessage.includes('ازدحام') ||
    userMessage.includes('طريق')
  ) {
    return `
بحسب بيانات بصيرة الحالية:

أكثر منطقة تحتاج متابعة مرورية هي ${highestTraffic.city}
بنسبة مرور ${highestTraffic.traffic}.

متوسط الحركة المرورية في جميع المناطق:
${avg('traffic')}%.

التوصية:
يفضل مراقبة المناطق ذات المؤشر الأعلى خلال أوقات الذروة.
`
  }

  if (
    userMessage.includes('هواء') ||
    userMessage.includes('جودة') ||
    userMessage.includes('الهواء')
  ) {
    return `
تحليل جودة الهواء الحالي:

أفضل جودة هواء حاليًا في ${bestAir.city}
بمؤشر ${bestAir.air}.

متوسط جودة الهواء العام:
${avg('air')}.
`
  }

  if (
    userMessage.includes('طاقة') ||
    userMessage.includes('طاقه') ||
    userMessage.includes('كهرب')
  ) {
    return `
تحليل استهلاك الطاقة:

أعلى استهلاك للطاقة حاليًا في ${highestEnergy.city}
بنسبة ${highestEnergy.energy}.

متوسط استهلاك الطاقة:
${avg('energy')}%.

التوصية:
يفضل مراقبة المناطق الأعلى استهلاكًا لتقليل الضغط التشغيلي.
`
  }

  if (
    userMessage.includes('مياه') ||
    userMessage.includes('المياه')
  ) {
    return `
تحليل استهلاك المياه:

أعلى استهلاك للمياه حاليًا في ${highestWater.city}
بنسبة ${highestWater.water}.

متوسط استهلاك المياه:
${avg('water')}%.
`
  }

  if (
    userMessage.includes('امان') ||
    userMessage.includes('أمان') ||
    userMessage.includes('سلامة') ||
    userMessage.includes('السلامة')
  ) {
    return `
تحليل السلامة العامة:

أفضل مؤشر أمان حاليًا في ${bestSecurity.city}
بنسبة ${bestSecurity.security}.

متوسط مستوى الأمان:
${avg('security')}%.
`
  }

  return `
تحليل بصيرة الحالي:

• متوسط المرور: ${avg('traffic')}%
• جودة الهواء: ${avg('air')}
• الطاقة: ${avg('energy')}%
• المياه: ${avg('water')}%
• الأمان: ${avg('security')}%

أكثر المناطق ازدحامًا:
${highestTraffic.city} بنسبة ${highestTraffic.traffic}

أفضل جودة هواء:
${bestAir.city} بمؤشر ${bestAir.air}

أفضل مستوى أمان:
${bestSecurity.city} بنسبة ${bestSecurity.security}

التوصية العامة:
النظام يعمل بشكل مستقر، مع أهمية متابعة المناطق ذات المؤشرات المرتفعة بشكل مستمر.
`
}

app.get('/', (req, res) => {
  res.send('Baseerah AI Backend is running')
})

app.get('/cities', async (req, res) => {
  try {
    const cities = await getCities()
    res.json(cities)
  } catch (error) {
    console.log('GET /cities error:', error.message)
    res.status(500).json([])
  }
})

app.post('/register-push-token', async (req, res) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({
        error: 'Token is required',
      })
    }

    addPushToken(token)

    res.json({
      success: true,
    })
  } catch (error) {
    console.log('Register push token error:', error.message)

    res.status(500).json({
      success: false,
    })
  }
})

app.post('/cities', async (req, res) => {
  try {
    const {
      city,
      traffic,
      air,
      energy,
      water,
      security,
      status,
    } = req.body

    const result = await pool.query(
      `
      INSERT INTO cities
      (city, traffic, air, energy, water, security, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        city,
        traffic,
        air,
        energy,
        water,
        security,
        status,
      ]
    )

    await emitLiveData()

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.log('POST /cities error:', error.message)
    res.status(500).json({ error: 'Failed to add city' })
  }
})

app.put('/cities/:id', async (req, res) => {
  try {
    const { id } = req.params

    const {
      city,
      traffic,
      air,
      energy,
      water,
      security,
      status,
    } = req.body

    const result = await pool.query(
      `
      UPDATE cities
      SET
        city = $1,
        traffic = $2,
        air = $3,
        energy = $4,
        water = $5,
        security = $6,
        status = $7
      WHERE id = $8
      RETURNING *
      `,
      [
        city,
        traffic,
        air,
        energy,
        water,
        security,
        status,
        id,
      ]
    )

    await emitLiveData()

    res.json(result.rows[0])
  } catch (error) {
    console.log('PUT /cities error:', error.message)
    res.status(500).json({ error: 'Failed to update city' })
  }
})

app.delete('/cities/:id', async (req, res) => {
  try {
    const { id } = req.params

    await pool.query(
      'DELETE FROM cities WHERE id = $1',
      [id]
    )

    await emitLiveData()

    res.json({ message: 'City deleted successfully' })
  } catch (error) {
    console.log('DELETE /cities error:', error.message)
    res.status(500).json({ error: 'Failed to delete city' })
  }
})

app.get('/alerts', async (req, res) => {
  try {
    const cities = await getCities()
    const alerts = []

    cities.forEach((city) => {
      const traffic = getNumber(city.traffic)
      const air = getNumber(city.air)
      const energy = getNumber(city.energy)
      const water = getNumber(city.water)
      const security = getNumber(city.security)

      if (traffic >= 80) {
        alerts.push({
          id: `traffic-${city.id}`,
          title: 'ازدحام مروري مرتفع',
          description: `${city.city} تسجل حركة مرور مرتفعة بنسبة ${city.traffic}`,
          level: 'مرتفع',
          time: 'الآن',
        })
      }

      if (air >= 55) {
        alerts.push({
          id: `air-${city.id}`,
          title: 'تنبيه جودة الهواء',
          description: `${city.city} تسجل مؤشر جودة هواء يحتاج متابعة: ${city.air}`,
          level: 'متوسط',
          time: 'الآن',
        })
      }

      if (energy >= 88) {
        alerts.push({
          id: `energy-${city.id}`,
          title: 'ارتفاع استهلاك الطاقة',
          description: `${city.city} تسجل استهلاك طاقة مرتفع بنسبة ${city.energy}`,
          level: 'متوسط',
          time: 'قبل دقائق',
        })
      }

      if (water >= 85) {
        alerts.push({
          id: `water-${city.id}`,
          title: 'ارتفاع استهلاك المياه',
          description: `${city.city} تسجل استهلاك مياه مرتفع بنسبة ${city.water}`,
          level: 'متوسط',
          time: 'قبل دقائق',
        })
      }

      if (security < 85) {
        alerts.push({
          id: `security-${city.id}`,
          title: 'متابعة السلامة العامة',
          description: `${city.city} تسجل مؤشر أمان أقل من المستوى المطلوب: ${city.security}`,
          level: 'متوسط',
          time: 'الآن',
        })
      }
    })

    res.json(alerts)
  } catch (error) {
    console.log('GET /alerts error:', error.message)
    res.status(500).json([])
  }
})

app.post('/ai', async (req, res) => {
  try {
    const message =
      req.body.message ||
      req.body.question ||
      ''

    const cities = await getCities()

    if (!cities.length) {
      return res.json({
        reply: 'لا توجد بيانات حاليًا داخل النظام.',
      })
    }

    if (!openai) {
      return res.json({
        reply: buildLocalAIReply(message, cities),
      })
    }

    const citySummary = buildCitySummary(cities)

    const completion = await openai.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      input: `
أنت مساعد ذكي داخل منصة "بصيرة" للتوأم الرقمي لمدينة أبها.

أجب بالعربية فقط.
كن مختصرًا وواضحًا.
لا تخترع بيانات.
اعتمد فقط على بيانات المناطق التالية.

بيانات المناطق الحالية:
${citySummary}

سؤال المستخدم:
${message}
      `,
    })

    const reply =
      completion.output_text ||
      buildLocalAIReply(message, cities)

    res.json({ reply })
  } catch (error) {
    console.log('POST /ai error:', error.message)

    try {
      const message =
        req.body.message ||
        req.body.question ||
        ''

      const cities = await getCities()

      return res.json({
        reply: buildLocalAIReply(message, cities),
      })
    } catch {
      return res.status(500).json({
        reply: 'حدث خطأ أثناء تحليل البيانات.',
      })
    }
  }
})

io.on('connection', async (socket) => {
  console.log('Client connected:', socket.id)

  try {
    const cities = await getCities()
    socket.emit('cities:update', cities)
  } catch (error) {
    console.log('Socket connection error:', error.message)
  }

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

const startServer = async () => {
  try {
    await ensureSchema()

    server.listen(PORT, () => {
      console.log(`Baseerah AI server running on http://localhost:${PORT}`)
    })

    setInterval(updateRandomCityData, 30000)
  } catch (error) {
    console.log('Server startup error:', error.message)
    console.log('تأكد من إعدادات PostgreSQL داخل ملف backend/.env')
  }
}

startServer()