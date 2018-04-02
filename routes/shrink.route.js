const express = require('express');
const router = express.Router();

const ShrinkController = require('./../controllers/shrink.controller');
const FileHandler = require('./../handlers/file.handler');
const RouteHandler = require('./../handlers/route.handler');

router.post('/', (req, res) => {
    ShrinkController.validateShrink(req.body, req.files)
        .then(ShrinkController.shrinkAllImages)
        .then(FileHandler.zipBuffers)
        .then((data) => RouteHandler.success(res, 'Your images shrinked successfully', data))
        .catch((err) => RouteHandler.error(res, 409, '', err));
});

router.get('/download/:zip', (req, res) => {
    const file = 'public/zip/' + req.params.zip;
    res.download(file);
});

module.exports = router;
