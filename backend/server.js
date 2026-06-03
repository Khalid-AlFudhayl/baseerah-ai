require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
const http = require('http')
const { Server } = require('socket.io')
const OpenAI = require('openai')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    })
  : new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'baseerah_ai',
      password: process.env.DB_PASSWORD || '123456',
      port: Number(process.env.DB_PORT) || 5432,
    })

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

const JWT_SECRET =
  process.env.JWT_SECRET || 'baseerah_ai_super_secret_2026'

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      error: 'No token provided',
    })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({
      error: 'Invalid token',
    })
  }
}

const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden: insufficient permissions',
      })
    }

    next()
  }
}

const getUserNameFromRequest = (req) => {
  return req.user?.full_name || 'System User'
}

const addActivityLog = async (userName, action) => {
  try {
    await pool.query(
      `
      INSERT INTO activity_logs
      (user_name, action)
      VALUES ($1, $2)
      `,
      [userName || 'System User', action]
    )
  } catch (error) {
    console.log('Activity log error:', error.message)
  }
}

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

const getDashboardStats = async () => {
  const result = await pool.query(`
    SELECT
      ROUND(AVG(CAST(REPLACE(air, '%', '') AS NUMERIC))) AS air_quality,
      ROUND(AVG(CAST(REPLACE(traffic, '%', '') AS NUMERIC))) AS traffic,
      ROUND(AVG(CAST(REPLACE(energy, '%', '') AS NUMERIC))) AS energy,
      ROUND(AVG(CAST(REPLACE(water, '%', '') AS NUMERIC))) AS water,
      ROUND(AVG(CAST(REPLACE(security, '%', '') AS NUMERIC))) AS security,
      COUNT(*) AS total_cities
    FROM cities
  `)

  return result.rows[0]
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

app.post('/auth/register', async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body

    if (!full_name || !email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await pool.query(
      `
      INSERT INTO users (full_name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, full_name, email, role, created_at
      `,
      [
        full_name,
        email,
        hashedPassword,
        role || 'viewer',
      ]
    )

    await addActivityLog(
      full_name,
      `REGISTER_USER: ${email}`
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.log('POST /auth/register error:', error.message)
    res.status(500).json({
      error: 'Failed to register user',
    })
  }
})

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const result = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email = $1
      `,
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Invalid email or password',
      })
    }

    const user = result.rows[0]

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid email or password',
      })
    }

    const token = jwt.sign(
      {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: '7d',
      }
    )

    await addActivityLog(
      user.full_name,
      'LOGIN'
    )

    res.json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.log('POST /auth/login error:', error.message)
    res.status(500).json({
      error: 'Failed to login',
    })
  }
})

app.get('/auth/me', authMiddleware, async (req, res) => {
  res.json({
    user: req.user,
  })
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

app.get('/dashboard-stats', async (req, res) => {
  try {
    const stats = await getDashboardStats()

    res.json({
      airQuality: String(stats.air_quality || 0),
      traffic: `${stats.traffic || 0}%`,
      energy: `${stats.energy || 0}%`,
      water: `${stats.water || 0}%`,
      security: `${stats.security || 0}%`,
      totalCities: Number(stats.total_cities || 0),
    })
  } catch (error) {
    console.log('GET /dashboard-stats error:', error.message)

    res.status(500).json({
      airQuality: '0',
      traffic: '0%',
      energy: '0%',
      water: '0%',
      security: '0%',
      totalCities: 0,
    })
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

    await addActivityLog(
      'System User',
      'REGISTER_PUSH_TOKEN'
    )

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

app.post(
  '/cities',
  authMiddleware,
  allowRoles('admin', 'manager'),
  async (req, res) => {
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

      await addActivityLog(
        getUserNameFromRequest(req),
        `ADD_CITY: ${city}`
      )

      res.status(201).json(result.rows[0])
    } catch (error) {
      console.log('POST /cities error:', error.message)
      res.status(500).json({ error: 'Failed to add city' })
    }
  }
)

app.put(
  '/cities/:id',
  authMiddleware,
  allowRoles('admin', 'manager'),
  async (req, res) => {
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

      await addActivityLog(
        getUserNameFromRequest(req),
        `UPDATE_CITY: ${city}`
      )

      res.json(result.rows[0])
    } catch (error) {
      console.log('PUT /cities error:', error.message)
      res.status(500).json({ error: 'Failed to update city' })
    }
  }
)

app.delete(
  '/cities/:id',
  authMiddleware,
  allowRoles('admin'),
  async (req, res) => {
    try {
      const { id } = req.params

      await pool.query(
        'DELETE FROM cities WHERE id = $1',
        [id]
      )

      await emitLiveData()

      await addActivityLog(
        getUserNameFromRequest(req),
        `DELETE_CITY_ID: ${id}`
      )

      res.json({ message: 'City deleted successfully' })
    } catch (error) {
      console.log('DELETE /cities error:', error.message)
      res.status(500).json({ error: 'Failed to delete city' })
    }
  }
)

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
      const reply = buildLocalAIReply(message, cities)

      await addActivityLog(
        'System User',
        'AI_REQUEST'
      )

      return res.json({
        reply,
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

    await addActivityLog(
      'System User',
      'AI_REQUEST'
    )

    res.json({ reply })
  } catch (error) {
    console.log('POST /ai error:', error.message)

    try {
      const message =
        req.body.message ||
        req.body.question ||
        ''

      const cities = await getCities()
      const reply = buildLocalAIReply(message, cities)

      await addActivityLog(
        'System User',
        'AI_REQUEST_FALLBACK'
      )

      return res.json({
        reply,
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

app.get('/system-stats', async (req, res) => {
  try {
    const usersResult =
      await pool.query('SELECT COUNT(*) FROM users')

    const citiesResult =
      await pool.query('SELECT COUNT(*) FROM cities')

    const logsResult =
      await pool.query('SELECT COUNT(*) FROM activity_logs')

    const aiResult = await pool.query(`
      SELECT COUNT(*) 
      FROM activity_logs
      WHERE action LIKE 'AI%'
    `)

    const alertsResult = await pool.query(`
      SELECT COUNT(*) AS total
      FROM cities
      WHERE
        CAST(REPLACE(traffic,'%','') AS INTEGER) >= 80
        OR CAST(REPLACE(energy,'%','') AS INTEGER) >= 88
        OR CAST(REPLACE(security,'%','') AS INTEGER) < 85
    `)

    res.json({
      users: Number(usersResult.rows[0].count),
      cities: Number(citiesResult.rows[0].count),
      activityLogs: Number(logsResult.rows[0].count),
      aiRequests: Number(aiResult.rows[0].count),
      alerts: Number(alertsResult.rows[0].total),
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.log('GET /system-stats error:', error.message)

    res.status(500).json({
      users: 0,
      cities: 0,
      activityLogs: 0,
      aiRequests: 0,
      alerts: 0
    })
  }
})

app.get('/activity-logs', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM activity_logs
      ORDER BY id DESC
      LIMIT 100
    `)

    res.json(result.rows)
  } catch (error) {
    console.log(error)

    res.status(500).json([])
  }
})

const startServer = async () => {
  try {
    await ensureSchema()

    server.listen(PORT, () => {
      console.log(`Baseerah AI server running on http://localhost:${PORT}`)
    })

    setInterval(updateRandomCityData, 30000)
  } catch (error) {
    console.error('Server startup error full:', error)
    process.exit(1)
  }
}

startServer()