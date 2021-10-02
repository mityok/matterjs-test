import { Body } from 'matter-js';
import { LEVEL } from '../../assets/constants';
import { svgTextToDom } from '../utils/general';

export default class Level {
  #svg: SVGSVGElement;
  #parts: Body[] = [];
  constructor() {
    const svg = '';
    this.#svg = svgTextToDom(LEVEL);
    console.log('l', LEVEL, this.#svg);
    document.body.append(this.#svg);
  }

  init() {}

  draw() {}

  get parts() {
    return this.#parts;
  }
}
