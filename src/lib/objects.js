var library = function(canvas) {
    const context = canvas.getContext('2d');
    const CANVAS_HEIGHT = canvas.height;
    const CANVAS_WIDTH = canvas.width;
    const Images = {};

    var drawBackground = function() {
        context.drawImage(Images["background"], 0, 0, Images["background"].width, Images["background"].height, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    var drawTitle = function() {
        context.textAlign = 'center';
        context.font = '24px Courier New';
        context.fillText('Space Blaster', canvas.width / 2, canvas.height / 2 - 24);
    }

    var drawControls = function() {
        context.textAlign = 'center';
        context.font = '16px Courier New';
        context.fillText('press [<] and [>] to play', canvas.width / 2, canvas.height / 2);
    }

    var drawAuthor = function() {
        context.textAlign = 'center';
        context.font = '16px Courier New';
        context.fillText('by Tanmay Dharmaraj', canvas.width / 2, canvas.height / 2 + 24);
    }
    var drawScore = function(score) {
        context.textAlign = 'left';
        context.font = '16px Courier New';
        context.fillText(score, BRICK_GAP, 16);
    }

    var drawSpaceship = function(xposition, yposition) {
        context.drawImage(Images["spaceship"], xposition, yposition);
    }

    var drawBullet = function(xposition, yposition) {
        context.drawImage(Images["bullet"], xposition, yposition)
    }

    var drawExplosion = function(xposition, yposition) {
        return sprite({
            context: context,
            width: 2048,
            height: 128,
            image: Images["explosion"],
            numberOfFrames: 16,
            numberOfRows: 1,
            ticksPerFrame: 1,
            x: xposition,
            y: yposition,
            loop: false
        });
    }

    var drawAsteroid = function(xposition, yposition) {
        return sprite({
            context: context,
            width: 1024,
            height: 1024,
            image: Images["asteroid"],
            numberOfFrames: 8,
            numberOfRows: 8,
            ticksPerFrame: 1,
            x: xposition,
            y: yposition,
            loop: true
        });
    }

    var randomNumber = function(bottom, top) {
        return Math.floor(Math.random() * (1 + top - bottom)) + bottom;
    }

    var sprite = function(options) {

        var that = {},
            frameIndex = 0,
            rowIndex = 0,
            tickCount = 0,
            ticksPerFrame = options.ticksPerFrame || 0,
            numberOfFrames = options.numberOfFrames || 1,
            numberOfRows = options.numberOfRows || 1;

        that.context = options.context;
        that.width = options.width;
        that.height = options.height;
        that.image = options.image;
        that.x = options.x;
        that.y = options.y;
        that.loop = options.loop || false;

        that.update = function() {
            tickCount += 1;
            if (tickCount > ticksPerFrame) {
                tickCount = 0;
                if (rowIndex < numberOfRows) {
                    // If the current frame index is in range
                    if (frameIndex < numberOfFrames - 1) {
                        // Go to the next frame
                        frameIndex += 1;
                    } else if (that.loop) {
                        if (rowIndex < numberOfRows - 1) {
                            frameIndex = 0;
                            rowIndex += 1
                        } else {
                            frameIndex = 0;
                            rowIndex = 0
                        }
                    }
                } else {
                    rowIndex = 0;
                }
            }
        };

        that.render = function() {
            var sx = frameIndex * that.width / numberOfFrames;
            var sy = rowIndex * that.height / numberOfRows;
            var sWidth = that.width / numberOfFrames;
            var sHeight = that.height / numberOfRows;
            var dx = that.x;
            var dy = that.y;
            var dWidth = that.width / numberOfFrames;
            var dHeight = that.height / numberOfRows;

            that.context.drawImage(that.image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        };
        return that;
    }

    var loadImages = function(list) {
        var total = 0;
        console.log("Loading Images");
        for (var i = 0; i < list.length; i++) {
            var img = new Image();
            Images[list[i].name] = img;
            img.onload = function() {
                total++;
                if (total == list.length) {
                    console.log(total + " Images Loaded.");
                }
            };
            img.src = list[i].url;
        }
    }

    loadImages([
        {
            name: "spaceship",
            url: "./images/alienblaster.png"
        }, {
            name: "asteroid",
            url: "./images/asteroid2.png"
        }, {
            name: "bullet",
            url: "./images/bullet.png"
        }, {
            name: "background",
            url: "./images/background.jpg"
        }, {
            name: "explosion",
            url: "./images/explode.png"
        }
    ]);

    return {
        drawBackground,
        drawTitle,
        drawControls,
        drawAuthor,
        drawScore,
        drawSpaceship,
        drawBullet,
        drawAsteroid,
        randomNumber,
        sprite,
        drawExplosion
    }
}
module.exports = library;
