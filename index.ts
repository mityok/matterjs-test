// Import stylesheets
import './style.css';
import { Engine, World, Bodies, Events, Body, Composite } from 'matter-js';
import NoSleep from 'nosleep.js';
import Hero from './src/units/hero';
import Level from './src/core/level';

var noSleep = new NoSleep();

var engine = Engine.create();

const canvas = document.createElement('canvas');
document.body.append(canvas);
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * devicePixelRatio;
canvas.height = window.innerHeight * devicePixelRatio;

const hero = new Hero(ctx);
const level = new Level();

let pointerDown = false;

var ground = Bodies.rectangle(4000, 380, 8000, 10, { isStatic: true });
var ground1 = Bodies.rectangle(4000, 5, 8000, 10, { isStatic: true });
var ground2 = Bodies.rectangle(8005, 200, 10, 400, { isStatic: true });
var ground3 = Bodies.rectangle(5, 200, 10, 400, { isStatic: true });
var slope = Bodies.rectangle(200, 150, 400, 20, { isStatic: true });

var slope1 = Bodies.rectangle(600, 150, 400, 20, {
  isStatic: true,
  angle: Math.PI * 0.06,
});
var slope2 = Bodies.rectangle(1000, 250, 400, 20, { isStatic: true });
var slope3 = Bodies.rectangle(1400, 150, 400, 20, {
  isStatic: true,
  angle: -Math.PI * 0.06,
});

var star = Bodies.circle(300, 50, 10, {
  isSensor: true,
  isStatic: true,
});
var spike = Bodies.rectangle(1150, 220, 20, 20, {
  isSensor: true,
  isStatic: true,
});

World.add(engine.world, [
  hero.body,
  ...level.parts,
  ground,
  ground1,
  ground2,
  ground3,
  slope,
  slope1,
  slope2,
  slope3,
  star,
  spike,
]);
Events.on(engine, 'beforeUpdate', (event) => {
  hero.beforeUpdate();
});

function tick() {
  Engine.update(engine, 16);
  //
  ctx.imageSmoothingEnabled = false;
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#ff0';
  ctx.fillStyle = '#c00';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '22px Arial';
  ctx.fillText('hello', 20, 30);
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.save();
  const scale = 1.5;
  ctx.setTransform(
    scale,
    0,
    0,
    scale,
    scale * (-hero.x + 50),
    scale * (-hero.y + 80)
  );
  var bodies = Composite.allBodies(engine.world);
  ctx.beginPath();
  for (var i = 0; i < bodies.length; i += 1) {
    if (bodies[i] === hero.body) {
      continue;
    }
    var vertices = bodies[i].vertices;
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (var j = 1; j < vertices.length; j += 1) {
      ctx.lineTo(vertices[j].x, vertices[j].y);
    }
    ctx.lineTo(vertices[0].x, vertices[0].y);
  }
  ctx.fill();
  ctx.stroke();
  hero.draw();
  ctx.restore();
  requestAnimationFrame(tick);
}

canvas.addEventListener('pointerup', () => {
  pointerDown = false;
});
canvas.addEventListener('pointerdown', () => {
  pointerDown = true;
});

Events.on(engine, 'afterUpdate', () => {
  hero.jump(pointerDown);
  hero.move();
});

const collisionCheck = (event) => {
  var pairs = event.pairs;
  for (var i = 0, j = pairs.length; i != j; ++i) {
    var pair = pairs[i];
    hero.checkCollision(pair.bodyA);

    if (pair.bodyB === star) {
      World.remove(engine.world, star);
    }
    if (pair.bodyB === spike) {
      hero.isHit = true;
    }
  }
};
Events.on(engine, 'collisionActive', collisionCheck);
Events.on(engine, 'collisionStart', collisionCheck);

Events.on(engine, 'collisionEnd', function (event) {
  var pairs = event.pairs;
});
document.addEventListener(
  'click',
  function enableNoSleep() {
    document.removeEventListener('click', enableNoSleep, false);
    noSleep.enable();
  },
  false
);

let princess = null;
console.log(hero);
const init = async () => {
  try {
    await hero.init();
  } catch (e) {
    console.log(e);
  }
  tick();
};

init();
