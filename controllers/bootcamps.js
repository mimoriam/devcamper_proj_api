const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asynchandler');
const geocoder = require('../utils/geocoder');

// @desc    GET all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public

// Filtering via: localhost:5000/api/v1/bootcamps?housing=true&location.state=MA
// Selecting via: localhost:5000/api/v1/bootcamps?select=name,description,housing&housing=true
// Sorting via: localhost:5000/api/v1/bootcamps?select=name,description,housing&sort=-name
// Pagination via: localhost:5000/api/v1/bootcamps?page=2&limit=10
exports.getBootcamps = asyncHandler(async (req, res, next) => {

    let query;
    // console.log(query);

    // For select sorting:
    const reqQuery = { ...req.query };

    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    // console.log(queryStr);

    // Redundant for Prisma/Sequelize (Create mongoose operators for $gt/$gte etc. )
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = Bootcamp.find(JSON.parse(queryStr));

    // Selecting specific fields to show:
    if (req.query.select) {
        const fields = req.query.split(',').join(' ');
        query = query.select(fields);
    }

    // Sorting:
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination:
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25; //! Change limit here if not specified in query params
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // const bootcamp = await Bootcamp.find();
    const bootcamp = await query;

    // Pagination result:
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.status(200).json({
        success: true,
        count: bootcamp.length,
        pagination,
        data: bootcamp,
    });
});

// @desc    GET single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: bootcamp,
    });

});

// @desc    POST new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.create(req.body); // req.body has all the JSON we pass it from the POST request

    res.status(201).json({
        success: true,
        data: bootcamp,
    });

});

// @desc    PUT single bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: bootcamp,
    });
});

// @desc    DEL single bootcamp
// @route   DEL /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: {},
    });

});

// @desc    GET bootcamps within radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get longitude/latitude from geocoder:
    const loc = await geocoder.geocode(zipcode);
    const long = loc[0].longitude;
    const lat = loc[0].latitude;

    // Calculate radius using radians
    // Earth radius = 3,963 mi / 6,378
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[long, lat], radius] } }
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps,
    });

});