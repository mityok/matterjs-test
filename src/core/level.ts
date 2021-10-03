import { Bodies, Body, Common, Vertices } from 'matter-js';
import { LEVEL } from '../../assets/constants';
import { svgTextToDom } from '../utils/general';

export default class Level {
  #svg: SVGSVGElement;
  #parts: Body[];
  #maxHeight: number;
  constructor() {
    const svg = '';
    this.#svg = svgTextToDom(LEVEL);
    document.body.append(this.#svg);
    this.#maxHeight = parseFloat(this.#svg.getAttribute('height'));

    const polys = generatePolygons(this.#svg, this.#maxHeight);
    this.#parts = this.#fillPlatforms(polys);
    var ground = Bodies.rectangle(4000, 380, 8000, 10, { isStatic: true });
    var ground1 = Bodies.rectangle(4000, 5, 8000, 10, { isStatic: true });
    var ground2 = Bodies.rectangle(8005, 200, 10, 400, { isStatic: true });
    var ground3 = Bodies.rectangle(5, 200, 10, 400, { isStatic: true });
    this.#parts = [...this.#parts, ground, ground1, ground2, ground3];
  }
  #fillPlatforms(polys: { x: number; y: number }[]) {
    const vertices = Vertices.create(polys, undefined);

    const b = Bodies.fromVertices(
      1000,
      300,
      [vertices],
      { isStatic: true },
      false
    );
    return [b];
  }
  init() {}

  draw() {}

  get parts() {
    return this.#parts;
  }
}

const generatePolygons = (svg: SVGSVGElement, maxHeight: number) => {
  const polys = [...svg.querySelectorAll('polyline')];
  let polygons: { x: number; y: number }[] = [];
  for (let i = 0; i < polys.length; i++) {
    const poly = polys[i];
    const points = poly
      .getAttribute('points')
      .split(' ')
      .map((pair) => {
        const arr = pair.split(',').map(parseFloat);
        return { x: arr[0], y: arr[1] };
      });

    const sx = points[0].x;
    const ex = points[points.length - 1].x;
    if (i) {
      const sameXpos = points[0].x === polygons[polygons.length - 1].x;
      if (!sameXpos) {
        points.unshift({ x: sx, y: maxHeight - 5 });
        points.unshift({
          x: polygons[polygons.length - 1].x,
          y: maxHeight - 5,
        });
      }
    }
    if (i === polys.length - 1) {
      points.push({ x: ex, y: maxHeight });
      points.push({ x: polygons[0].x, y: maxHeight });
    }
    polygons = [...polygons, ...points];
  }
  return polygons;
};
