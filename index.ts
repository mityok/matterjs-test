// Import stylesheets
import './style.css';
import { Engine, World, Bodies, Events, Body, Composite } from 'matter-js';
import NoSleep from 'nosleep.js';

var noSleep = new NoSleep();

var engine = Engine.create();

const canvas = document.createElement('canvas');
document.body.append(canvas);
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * devicePixelRatio;
canvas.height = window.innerHeight * devicePixelRatio;

var bottom = Bodies.rectangle(0, 27.5, 30, 5, {
  isSensor: true,
});
var partA = Bodies.rectangle(0, 0, 30, 50, {
  chamfer: { radius: 5 },
});
var hero = Body.create({
  parts: [partA, bottom],
  frictionStatic: 0,
  frictionAir: 0.02,
  friction: 0.1,
  inertia: Infinity,
});
let pointerDown = false;
var isTouching = { left: false, right: false, ground: false };
Body.translate(hero, { x: 80, y: 20 });

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
  hero,
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
Events.on(engine, 'beforeUpdate', function (event) {
  resetTouching();
});
const resetTouching = () => {
  isTouching.left = false;
  isTouching.right = false;
  isTouching.ground = false;
};

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
    scale * (-hero.position.x + 50),
    scale * (-hero.position.y + 80)
  );
  var bodies = Composite.allBodies(engine.world);
  ctx.beginPath();
  for (var i = 0; i < bodies.length; i += 1) {

    var vertices = bodies[i].vertices;
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (var j = 1; j < vertices.length; j += 1) {
      ctx.lineTo(vertices[j].x, vertices[j].y);
    }
    ctx.lineTo(vertices[0].x, vertices[0].y);
  }
  ctx.fill();
  ctx.stroke();
  ctx.drawImage(princess,hero.position.x -16,hero.position.y-30,princess.width*2,princess.height*2)

  ctx.restore();
  requestAnimationFrame(tick);
}

canvas.addEventListener('pointerup', () => {
  pointerDown = false;
});
canvas.addEventListener('pointerdown', () => {
  pointerDown = true;
});
let counter = 0;
let isHit = false;

Events.on(engine, 'beforeUpdate', () => {});

Events.on(engine, 'afterUpdate', () => {
  if (pointerDown && isTouching.ground) {
    Body.setVelocity(hero, { x: 0, y: -10 });
  }
  if (isHit) {
    Body.setVelocity(hero, { x: -12, y: -5 });

    isHit = false;
    return;
  }
  counter++;
  if (counter >= 3) {
    const isOnGround = isTouching.ground;
    const moveForce = isOnGround ? 0.02 : 0.005;
    // prevent high speed on down slopes
    if (hero.velocity.x < 3) {
      Body.applyForce(
        hero,
        { x: hero.position.x, y: hero.position.y },
        { x: moveForce, y: 0 }
      );
    }
    counter = 0;
  }
});

const ev = (event) => {
  var pairs = event.pairs;

  for (var i = 0, j = pairs.length; i != j; ++i) {
    var pair = pairs[i];
    if (pair.bodyA === bottom) {
      isTouching.ground = true;
    }
    if (pair.bodyB === star) {
      World.remove(engine.world, star);
    }
    if (pair.bodyB === spike) {
      isHit = true;
    }
  }
};
Events.on(engine, 'collisionActive', ev);
Events.on(engine, 'collisionStart', ev);

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
const loadImage = (url: string) =>
  new Promise((resolve,reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.onerror=reject
    img.src = url;
  });
  let princess = null
console.log(hero);
const init = async () => {
  try{
   princess = await loadImage('https://raw.githubusercontent.com/mityok/matterjs-test/master/assets/princess.png');
  }catch(e){
console.log(e)
  }
  tick();
};


init();
