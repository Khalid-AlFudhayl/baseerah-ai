const express = require('express')
const pool = require('../database/db')

const router = express.Router()

router.get('/', async (req, res) => {

  try {

    const result = await pool.query(
      'SELECT * FROM cities ORDER BY id ASC'
    )

    res.json(result.rows)

  } catch (error) {

    res.status(500).json({
      error: error.message
    })

  }

})

router.post('/', async (req, res) => {

  try {

    const {
      city,
      traffic,
      air,
      status
    } = req.body

    await pool.query(
      `
      INSERT INTO cities
      (city, traffic, air, status)

      VALUES ($1, $2, $3, $4)
      `,
      [city, traffic, air, status]
    )

    res.json({
      success: true
    })

  } catch (error) {

    res.status(500).json({
      error: error.message
    })

  }

})

router.delete('/:id', async (req, res) => {

  try {

    const { id } = req.params

    await pool.query(
      'DELETE FROM cities WHERE id = $1',
      [id]
    )

    res.json({
      success: true
    })

  } catch (error) {

    res.status(500).json({
      error: error.message
    })

  }

})
router.put('/:id', async (req, res) => {

  try {

    const { id } = req.params

    const {
      city,
      traffic,
      air,
      status
    } = req.body

    await pool.query(

      `
      UPDATE cities

      SET
        city = $1,
        traffic = $2,
        air = $3,
        status = $4

      WHERE id = $5
      `,

      [city, traffic, air, status, id]

    )

    res.json({
      success: true
    })

  } catch (error) {

    res.status(500).json({
      error: error.message
    })

  }

})
module.exports = router