const Jimp = require('jimp');
const bluebird = require('bluebird');

const FileHandler = require('./../handlers/file.handler');
const ValidationHandler = require('./../handlers/validation.handler');

class ShrinkController {
    static shrinkImage(image, width, height, quality) {
        return new Promise((resolve, reject) => {
            Jimp.read(image.data, function (err, imageJimp) {
                if (err) {
                    reject(err);
                } else {
                    imageJimp.resize(width, height)
                        .quality(quality)
                        .getBuffer(image.mimetype, (err, imageBuffer) => {
                            resolve(imageBuffer);
                        });
                }
            });
        });
    }

    static shrinkAllImages(shrink) {
        return new Promise((resolve, reject) => {
            bluebird.map(shrink.images, function (image) {
                return ShrinkController.shrinkImage(image, shrink.width, shrink.height, shrink.quality);
            })
            .then((newImagesBuffers) => {
                let newData = [];
                for (let i = 0; i < shrink.images.length; i++) {
                    newData.push({
                        name: shrink.images[i].name,
                        data: newImagesBuffers[i]
                    });
                }
                resolve(newData);
            });
        });
    }

    static validateShrink(shrink, files) {
        return new Promise((resolve, reject) => {
            let errors = [];

            if (files && files.images) {
                if (files.images.constructor === Array) {
                    shrink.images = files.images;
                } else {
                    shrink.images = [files.images];
                }
            } else if (!postId) {
                errors.push('You need to provide images');
            }
    
            if (ValidationHandler.regex(shrink.width, /^[0-9]*$/)) {
                shrink.width = +shrink.width;
            } else {
                errors.push('Width is invalid');
            }

            if (ValidationHandler.regex(shrink.height, /^[0-9]*$/)) {
                shrink.height = +shrink.height;
            } else {
                errors.push('Height is invalid');
            }

            if (ValidationHandler.regex(shrink.quality, /^[0-9]*$/)) {
                shrink.quality = +shrink.quality;
            } else {
                errors.push('Quality is invalid');
            }

            if (errors.length) {
                reject(errors);
            } else {
                FileHandler.checkFilesErrors(shrink.images, 'image', 20)
                    .then(() => resolve(shrink))
                    .catch((err) => reject(err));
            }
        });
    }
}

module.exports = ShrinkController;
