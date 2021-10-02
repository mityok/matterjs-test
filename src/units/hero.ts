import { Bodies, Body } from 'matter-js';
import { loadImage } from '../utils/general';

export default class Hero {
  #princessImage: HTMLImageElement;
  #hero: Body;
  #ctx: CanvasRenderingContext2D;
  #isTouching = { left: false, right: false, ground: false };
  #isHit = false;
  #counter = 0;
  #bottom: Body;

  constructor(ctx: CanvasRenderingContext2D) {
    this.#ctx = ctx;
    this.#bottom = Bodies.rectangle(0, 27.5, 30, 5, {
      isSensor: true,
    });
    var partA = Bodies.rectangle(0, 0, 30, 50, {
      chamfer: { radius: 5 },
    });
    this.#hero = Body.create({
      parts: [partA, this.#bottom],
      frictionStatic: 0,
      frictionAir: 0.02,
      friction: 0.1,
      inertia: Infinity,
    });
    Body.translate(this.#hero, { x: 20, y: 20 });
  }
  init = async () => {
    this.#princessImage = await loadImage(
      'https://raw.githubusercontent.com/mityok/matterjs-test/master/assets/princess.png'
    );
  };
  draw() {
    this.#ctx.drawImage(
      this.#princessImage,
      this.#hero.position.x - 16,
      this.#hero.position.y - 34,
      this.#princessImage.width * 2,
      this.#princessImage.height * 2
    );
  }
  get x() {
    return this.#hero.position.x;
  }
  get y() {
    return this.#hero.position.y;
  }
  get body() {
    return this.#hero;
  }
  set isHit(value: boolean) {
    this.#isHit = value;
  }
  beforeUpdate() {
    this.#resetTouching();
  }
  #resetTouching() {
    this.#isTouching.left = false;
    this.#isTouching.right = false;
    this.#isTouching.ground = false;
  }
  checkCollision(body: Body) {
    if (body === this.#bottom) {
      this.#isTouching.ground = true;
    }
  }
  jump(pointerDown: boolean) {
    if (pointerDown && this.#isTouching.ground) {
      Body.setVelocity(this.#hero, { x: 0, y: -10 });
    }
  }
  move() {
    if (this.#isHit) {
      Body.setVelocity(this.#hero, { x: -12, y: -5 });

      this.#isHit = false;
      return;
    }
    this.#counter++;
    if (this.#counter >= 3) {
      const isOnGround = this.#isTouching.ground;
      const moveForce = isOnGround ? 0.02 : 0.005;
      // prevent high speed on down slopes
      if (this.#hero.velocity.x < 3) {
        Body.applyForce(
          this.#hero,
          { x: this.x, y: this.y },
          { x: moveForce, y: 0 }
        );
      }
      this.#counter = 0;
    }
  }
}
