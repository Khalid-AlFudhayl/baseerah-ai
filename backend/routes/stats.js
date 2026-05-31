const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {

  res.json([
    {
      title: 'جودة الهواء',
      value: '38',
      color: 'text-cyan-400'
    },
    {
      title: 'حركة المرور',
      value: '61%',
      color: 'text-yellow-400'
    },
    {
      title: 'استهلاك الطاقة',
      value: '57%',
      color: 'text-orange-400'
    },
    {
      title: 'السلامة العامة',
      value: '88%',
      color: 'text-green-400'
    }
  ])

})

module.exports = router