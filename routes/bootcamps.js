const express = require('express');
const router = express.Router();

// GET:
router.get('/', (req, res, next) => {
    res.status(200).json({ success: true, msg: "Show all bootcamps" })
});

// GET one:
router.get('/:id', (req, res, next) => {
    res.status(200).json({ success: true, msg: req.params.id })
});

// POST one:
router.post('/', (req, res, next) => {
    res.status(200).json({ success: true, msg: "Create new bootcamp" })
});

// Update one:
router.put('/:id', (req, res, next) => {
    res.status(200).json({ success: true, msg: req.params.id })
});

router.delete('/:id', (req, res, next) => {
    res.status(200).json({ success: true, msg: req.params.id })
});

module.exports = router;