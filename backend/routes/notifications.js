const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {

  res.json([
    {
      id: 1,
      title: 'ارتفاع المرور في وسط المدينة',
      time: 'قبل 5 دقائق'
    },
    {
      id: 2,
      title: 'تحسن جودة الهواء في شمال أبها',
      time: 'قبل 18 دقيقة'
    },
    {
      id: 3,
      title: 'استهلاك مرتفع للطاقة',
      time: 'قبل 30 دقيقة'
    }
  ])

})

module.exports = router