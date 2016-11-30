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

    var drawSpaceship = function(position) {
        if (position) {
            context.drawImage(Images["spaceship"], position - Images["spaceship"].width / 2, CANVAS_HEIGHT - Images["spaceship"].height);
        } else {
            context.drawImage(Images["spaceship"], CANVAS_WIDTH / 2 - Images["spaceship"].width / 2, CANVAS_HEIGHT - Images["spaceship"].height);
        }
    }

    var drawBullet = function(xposition, yposition) {
        //TODO: laser beam correction 35 and 55.. Need to correct this.
        // var val = xposition - ((Images["spaceship"].width / 2) - 35);
        // if (yposition == 67) {
        //     console.log("drawing explosion at", val, yposition);
        //     drawExplosion(val, yposition);
        // }
        context.drawImage(Images["bullet"], xposition, yposition)
    }

    var drawExplosion = function(xposition, yposition) {
        for (var i = 0; i < 16; i++) {
            context.drawImage(Images["explosion"], i * 128, 0, 128, 128, xposition, yposition, 128, 128);
        }
    }

    var drawTest = function(x, y) {
        context.drawImage(Images["bullet"], x, y)
    }

    var drawAsteroid = function(xposition, yposition) {
        context.drawImage(Images["asteroid"], xposition, yposition);
    }

    var randomNumber = function(bottom, top) {
        return Math.floor(Math.random() * (1 + top - bottom)) + bottom;
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

    loadImages([{
        name: "spaceship",
        url: "./images/alienblaster.png"
    }, {
        name: "asteroid",
        url: "./images/asteroid.png"
    }, {
        name: "bullet",
        url: "./images/bullet.png"
    }, {
        name: "background",
        url: "./images/background.jpg"
    }, {
        name: "explosion",
        url: "./images/explode.png"
    }]);

    return {
        drawBackground,
        drawTitle,
        drawControls,
        drawAuthor,
        drawScore,
        drawSpaceship,
        drawBullet,
        drawTest,
        drawAsteroid,
        randomNumber
    }
}
module.exports = library;
