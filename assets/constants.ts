export const LEVEL = `<svg width="3800" height="400" xmlns="http://www.w3.org/2000/svg">
<defs>
  <style>
    polyline {
      fill: none;
      stroke: green;
      stroke-width: 5;
    }

    polygon[data-type="ground"] {
      fill: brown;
    }

  </style>
  <g id="spikes">
    <rect width="40" height="20" fill="blue" fill-opacity="0.1" />
    <polygon points="10,20 5,0 20,20" fill="gray" />
    <polygon points="30,20 35,0 20,20" fill="gray" />
  </g>
  <g id="cloud">
    <rect width="60" height="20" rx="11" fill="white" />
    <ellipse cx="55" cy="5" rx="15" ry="15" fill="white" />
    <ellipse cx="35" cy="0" rx="20" ry="20" fill="white" />
  </g>
  <g id="crown">
    <rect width="20" height="20" fill="blue" fill-opacity="0.1" />
    <polygon points="0,20 0,0 15,20" fill="gold" />
    <polygon points="20,20 20,0 5,20" fill="gold" />
    <polygon points="0,20 10,0 20,20" fill="gold" />
    <ellipse cx="10" cy="10" rx="2" ry="2" fill="blue" />
  </g>
</defs>
<rect width="3800" height="400" fill="#87ceeb" data-type="bg" />
<rect width="5" x="2000" height="400" fill="#f00" data-type="finish" />

<rect width="3800" height="40" x="0" y="360" fill="blue" data-type="water" />
<g data-type="sky">
  <use href="#cloud" x="40" y="130" />
  <use href="#cloud" x="300" y="170" />
  <use href="#cloud" x="550" y="150" />
  <use href="#cloud" x="850" y="190" />
  <use href="#cloud" x="1150" y="120" />
  <use href="#cloud" x="1750" y="190" />
</g>
<polyline points="00,320 240,320 280,300 320,300 360,320 420,320" data-type="platform" />
<polyline points="460,320 580,320" data-type="platform" />
<polyline points="580,300 740,300" data-type="platform" />
<polyline points="740,320 780,320" data-type="platform" />
<use href="#spikes" x="740" y="300" data-type="spike" />
<polyline points="820,320 980,320" data-type="platform" />
<polyline points="980,300 1080,300" data-type="platform" />
<polyline points="1080,280 1180,280" data-type="platform" />
<polyline points="1180,260 1220,260 1300,340" data-type="platform" />

<use href="#crown" x="200" y="280" data-type="crown" />
<use href="#crown" x="500" y="280" data-type="crown" />
<use href="#crown" x="640" y="260" data-type="crown" />
<ellipse cx="1320" cy="360" rx="18" ry="3" fill="#FF0080" data-type="launch" />
<ellipse cx="1560" cy="360" rx="18" ry="3" fill="#8ca765" data-type="pad" />
<ellipse cx="1640" cy="360" rx="18" ry="3" fill="#8ca765" data-type="pad" />
<polyline points="1340,320 1520,320" data-type="platform" />
<polyline points="1700,320 2020,320" data-type="platform" />
</svg>
`;
