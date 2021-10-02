export const SVG_MIME_TYPE = 'image/svg+xml';

export const loadImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });

export const svgTextToDom = (svgText: string) =>
  new window.DOMParser().parseFromString(svgText, SVG_MIME_TYPE)
    .documentElement as Element as SVGSVGElement;
