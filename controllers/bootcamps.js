const Bootcamp = require('../models/Bootcamp');

// @desc    GET all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.find();

        res.status(200).json({
            success: true,
            count: bootcamp.length,
            data: bootcamp,
        });
    } catch (err) {
        return res.status(400).json({ success: false });
    }
}

// @desc    GET single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);

        if (!bootcamp) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({
            success: true,
            data: bootcamp,
        });
    } catch (err) {
        return res.status(400).json({ success: false });
    }
}

// @desc    POST new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body); // req.body has all the JSON we pass it from the POST request

        res.status(201).json({
            success: true,
            data: bootcamp,
        });
    } catch (err) {
        return res.status(400).json({ success: false });
    }

}

// @desc    PUT single bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!bootcamp) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({
            success: true,
            data: bootcamp,
        });
    } catch (err) {
        return res.status(400).json({ success: false });
    }
}

// @desc    DEL single bootcamp
// @route   DEL /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

        if (!bootcamp) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (err) {
        return res.status(400).json({ success: false });
    }
}