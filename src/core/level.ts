import { Bodies, Body, Common, Vertices } from 'matter-js';
import { LEVEL } from '../../assets/constants';
import { svgTextToDom } from '../utils/general';
import * as decomp from 'poly-decomp';

Common.setDecomp(decomp);

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
    console.log('l', polys, this.#maxHeight, this.#parts);
  }
  #fillPlatforms(polys: { x: number; y: number }[][]) {
    return polys.map((points) => {
      const vert = Vertices.create(points, undefined);
      return Bodies.fromVertices(
        points[0].x + 600,
        points[0].y,
        [vert],
        { isStatic: true },
        true
      );
    });
  }
  init() {}

  draw() {}

  get parts() {
    return this.#parts;
  }
}

const generatePolygons = (svg: SVGSVGElement, maxHeight: number) => {
  const polys = [...svg.querySelectorAll('polyline')];
  const polygons: { x: number; y: number }[][] = [];
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

    points.push({ x: ex, y: maxHeight });
    points.push({ x: sx, y: maxHeight });
    polygons.push(points);
  }
  return polygons;
};
