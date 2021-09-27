// Import stylesheets
import './style.css';
import { Engine, Render, World, Bodies, Events, Runner, Body } from 'matter-js';
import NoSleep from 'nosleep.js';

var noSleep = new NoSleep();

var engine = Engine.create();

var render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: true,
    background: 'rgb(255,0,0)',
  },
});

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
var slope3 = Bodies.rectangle(1200, 150, 400, 20, {
  isStatic: true,
  angle: -Math.PI * 0.06,
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
]);

Runner.run(engine);
Render.run(render);
Events.on(engine, 'beforeUpdate', function (event) {
  resetTouching();
});
const resetTouching = () => {
  isTouching.left = false;
  isTouching.right = false;
  isTouching.ground = false;
};
Events.on(render, 'beforeRender', () => {
  Render.lookAt(
    render,
    hero,
    {
      x: 180,
      y: 190,
    },
    true
  );
});
render.canvas.addEventListener('pointerup', () => {
  pointerDown = false;
});
render.canvas.addEventListener('pointerdown', () => {
  pointerDown = true;
});
let counter = 0;
Events.on(engine, 'beforeUpdate', () => {});
Events.on(engine, 'afterUpdate', () => {
  if (pointerDown && isTouching.ground) {
    Body.setVelocity(hero, { x: 0, y: -10 });
  }
  counter++;
  if (counter >= 3) {
    const isOnGround = isTouching.ground;
    const moveForce = isOnGround ? 0.01 : 0.005;
    // prevent high speed on down slopes
    console.log(hero.velocity.x);
    if (hero.velocity.x < 1) {
      Body.applyForce(
        hero,
        { x: hero.position.x, y: hero.position.y },
        { x: moveForce, y: 0 }
      );
    }
    counter = 0;
  }
  /*
  Body.applyForce(
    hero,
    { x: hero.position.x, y: hero.position.y },
    { x: moveForce, y: 0 }
  );
  */
});

const ev = (event) => {
  var pairs = event.pairs;

  for (var i = 0, j = pairs.length; i != j; ++i) {
    var pair = pairs[i];
    if (pair.bodyA === bottom) {
      isTouching.ground = true;
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
