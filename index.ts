// Import stylesheets
import './style.css';
import { Engine, Render, World, Bodies, Events, Runner, Body } from 'matter-js';

var engine = Engine.create();

var render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: true,
  },
});

var colorA = '#f55a3c',
  colorB = '#f5d259';
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
Body.translate(hero, { x: 280, y: 20 });
var boxA = Bodies.rectangle(400, 200, 80, 80);
var ballA = Bodies.circle(380, 100, 40);
var ballB = Bodies.circle(460, 10, 40);
var ground = Bodies.rectangle(400, 380, 800, 10, { isStatic: true });
var ground1 = Bodies.rectangle(400, 5, 800, 10, { isStatic: true });
var ground2 = Bodies.rectangle(605, 200, 10, 400, { isStatic: true });
var ground3 = Bodies.rectangle(5, 200, 10, 400, { isStatic: true });
World.add(engine.world, [
  hero,
  boxA,
  ballA,
  ballB,
  ground,
  ground1,
  ground2,
  ground3,
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
render.canvas.addEventListener('mouseup', () => {
  pointerDown = false;
});
render.canvas.addEventListener('mousedown', () => {
  pointerDown = true;
  /*
  console.log('jump');
  if (isTouching.ground) {
    Body.setVelocity(hero, { x: 0, y: -10 });
  }
  */
});
Events.on(engine, 'afterUpdate', () => {
  console.log('j', pointerDown, isTouching.ground);
  if (pointerDown && isTouching.ground) {
    Body.setVelocity(hero, { x: 0, y: -10 });
  }
});
Events.on(engine, 'collisionStart', function (event) {
  var pairs = event.pairs;

  for (var i = 0, j = pairs.length; i != j; ++i) {
    var pair = pairs[i];
    if (pair.bodyA === bottom) {
      isTouching.ground = true;
    }
    /*
      if (pair.bodyA === collider) {
          pair.bodyB.render.strokeStyle = colorA;
      } else if (pair.bodyB === collider) {
          pair.bodyA.render.strokeStyle = colorA;
      }
      */
  }
});

Events.on(engine, 'collisionEnd', function (event) {
  var pairs = event.pairs;
});
