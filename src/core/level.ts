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

    const polys = [generatePolygons(this.#svg, this.#maxHeight)[0]];
    this.#parts = this.#fillPlatforms(polys);
    const star = Vertices.fromPath(
      '50 0 63 38 100 38 69 59 82 100 50 75 18 100 31 59 0 38 37 38'
    );
    const decomp = Common.getDecomp()
    console.log(
      'l',
      polys,
      this.#maxHeight,
      this.#parts,
      Common.getDecomp(),
      Vertices.isConvex(star)
    );
    var concave = star.map(function(vertex) {
      return [vertex.x, vertex.y];
  });

  // vertices are concave and simple, we can decompose into parts
  decomp.makeCCW(concave);
  //debugger
  const b = Bodies.fromVertices(280, 200, [star], {}, true)
  const b2 = Bodies.fromVertices(280, 100, [star], {}, true)

    this.#parts.push(b,b2);
    var decomposed = decomp.quickDecomp(concave);
    console.log('concave',concave,b,decomposed)

  }
  #fillPlatforms(polys: { x: number; y: number }[][]) {
    return polys.map((points) => {
      const vert = Vertices.create(points, undefined);
      return Bodies.fromVertices(
        points[0].x + 600,
        points[0].y,
        [points],
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
