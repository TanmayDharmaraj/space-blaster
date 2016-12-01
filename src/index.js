import Rx from 'rxjs/Rx';
import library from './lib/objects'

const canvas = document.getElementById('stage');
canvas.width = window.innerWidth / 3;
canvas.height = window.innerHeight;

const context = canvas.getContext('2d');
context.fillStyle = 'black';

const background = new Image();
background.src = "http://i.imgur.com/yf6d9SX.jpg";

var drawHelper = new library(canvas)
drawHelper.drawTitle();
drawHelper.drawControls();
drawHelper.drawAuthor();


//TODO: setTimeout :P
setTimeout(function() {
    drawHelper.drawSpaceship();
}, 1000);

const TICKER_INTERVAL = 24;
const ASTEROID_INTERVAL = 500;
const CONTROLS = {
    left: 37,
    right: 39,
    spacebar: 32
};
const SPACESHIP_SPEED = 240;
const SPACESHIP_WIDTH = 91;
const SPACESHIP_HEIGHT = 117;

const ASTEROID_SPEED = 240;
const ASTEROID_WIDTH = 128;
const ASTEROID_HEIGHT = 128;
const INITIAL_OBJECTS = {
    spaceshipx: (canvas.width / 2) - (SPACESHIP_WIDTH / 2),
    spaceshipy: canvas.height - SPACESHIP_HEIGHT,
    asteroids: [],
    bullets: [],
    explosions: []
}


const input$ = Rx.Observable.merge(Rx.Observable.fromEvent(document, 'keydown', event => {
    switch (event.keyCode) {
        case CONTROLS.left:
            return -1;
        case CONTROLS.right:
            return 1;
        default:
            return 0;
    }
}), Rx.Observable.fromEvent(document, 'keyup', event => 0)).distinctUntilChanged();

const input_shoot$ = Rx.Observable.merge(Rx.Observable.fromEvent(document, 'keydown', event => {
    switch (event.keyCode) {
        case CONTROLS.spacebar:
            return 1;
        default:
            return 0;
    }
}), Rx.Observable.fromEvent(document, 'keyup', event => 0)).distinctUntilChanged()

const ticker$ = Rx.Observable
    .interval(TICKER_INTERVAL, Rx.Scheduler.requestAnimationFrame)
    .map(() => ({
        time: Date.now(),
        deltaTime: null
    }))
    .scan(
        (previous, current) => ({
            time: current.time,
            deltaTime: (current.time - previous.time) / 1000
        })
    );

const spaceship$ = ticker$
    .withLatestFrom(input$)
    .scan((position, [ticker, direction]) => {
        let next = position + direction * ticker.deltaTime * SPACESHIP_SPEED;
        return Math.max(Math.min(next, canvas.width - SPACESHIP_WIDTH / 2), SPACESHIP_WIDTH / 2);
    }, canvas.width / 2)
    .distinctUntilChanged();


const asteroid$ = Rx.Observable.interval(ASTEROID_INTERVAL)
    .scan((object, prev) => {
        let newRandomAsteroidPosition = drawHelper.randomNumber(ASTEROID_WIDTH / 2, canvas.width - ASTEROID_WIDTH);
        object.asteroids.push({
            xposition: newRandomAsteroidPosition,
            yposition: -1 - ASTEROID_HEIGHT
        })

        let newAsteroids = object.asteroids
            .filter((data) => (data.yposition < canvas.height))
            .map((data) => {
                data.yposition = data.yposition + 50;
                return data
            });

        object.asteroids = newAsteroids;
        return object
    }, INITIAL_OBJECTS)

const object$ = ticker$
    .withLatestFrom(spaceship$, asteroid$, input_shoot$)
    .scan((object, [ticker, spaceship, asteroid_object, shoot]) => {

        //calculate spaceship position
        object.spaceshipx = spaceship - (SPACESHIP_WIDTH / 2);
        object.spaceshipy = canvas.height - SPACESHIP_HEIGHT;

        //add a bullet to the bullet array if we have shot.
        if (shoot == 1) {
            object.bullets.push({
                xposition: spaceship - ((SPACESHIP_WIDTH / 2) - 35),
                yposition: canvas.height - (SPACESHIP_HEIGHT + 50)
            })
        }

        let newBullets = object.bullets
            .filter((data) => (data.yposition > 0))
            .map((data) => {
                data.yposition = data.yposition - 50
                return data;
            });

        return {
            spaceshipx: object.spaceshipx,
            spaceshipy: object.spaceshipy,
            asteroids: asteroid_object.asteroids,
            bullets: newBullets,
            explosions: object.explosions
        };
    }, INITIAL_OBJECTS)

var update = function([ticker, object]) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawHelper.drawBackground();
    drawHelper.drawSpaceship(object.spaceshipx, object.spaceshipy);

    //checking bullet and asteroid collisions
    object.bullets.forEach((bullet, bullet_index) => {
        object.asteroids.forEach((asteroid, asteroid_index) => {
            if (bullet.xposition > asteroid.xposition - ASTEROID_WIDTH / 2 &&
                bullet.xposition < asteroid.xposition + ASTEROID_WIDTH / 2 &&
                bullet.yposition > asteroid.yposition - ASTEROID_HEIGHT / 2 &&
                bullet.yposition < asteroid.yposition + ASTEROID_HEIGHT / 2) {
                object.asteroids.splice(asteroid_index, 1);
                object.bullets.splice(bullet_index, 1);
                object.explosions.push({currentFrame : 1, object: drawHelper.drawExplosion(asteroid.xposition, asteroid.yposition)})
            }
        })
    });

    var newExplosions = object.explosions
    .filter((explosion) => explosion.currentFrame <= 16)
    .forEach((explosion) => {
      explosion.currentFrame++;
      explosion.object.update();
      explosion.object.render();
    });
    object.explosion = newExplosions;

    object.asteroids.forEach((asteroid) => drawHelper.drawAsteroid(asteroid.xposition, asteroid.yposition))
    object.bullets.forEach((bullet) => drawHelper.drawBullet(bullet.xposition, bullet.yposition));
}

var game = Rx.Observable.combineLatest(ticker$, object$)
    .sample(Rx.Observable.interval(TICKER_INTERVAL))
    .subscribe(update);
