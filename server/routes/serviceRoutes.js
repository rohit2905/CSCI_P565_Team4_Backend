const express = require('express');
const router = express.Router();
const Service = require('../models/services');

// GET all services
router.get('/getallservices', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET service by CarrierName
// router.get('/:arrierName', async (req, res) => {
//   try {
//     const { carrierName } = req.params;
//     const service = await Service.findOne({ CarrierName });
//     if (!service) {
//       return res.status(404).json({ message: 'CarrierName not found' });
//     }
//     res.json(service);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

module.exports = router;
