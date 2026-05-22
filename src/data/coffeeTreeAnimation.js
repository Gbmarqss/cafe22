const DURATION = 365;

const colors = {
  soil: "#4a3525",
  soilSoft: "#7b6658",
  seed: "#8b5a2b",
  sprout: "#7a9d54",
  leaf: "#557c3e",
  leafDark: "#3a5a24",
  trunk: "#5a3827",
  flower: "#fff8ec",
  honey: "#d89b35",
  cherry: "#9f2f2f",
};

function hexToLottieColor(hex) {
  const value = hex.replace("#", "");
  return [
    parseInt(value.slice(0, 2), 16) / 255,
    parseInt(value.slice(2, 4), 16) / 255,
    parseInt(value.slice(4, 6), 16) / 255,
    1,
  ];
}

function staticProp(value) {
  return { a: 0, k: value };
}

function easedKeyframes(rawStops) {
  return {
    a: 1,
    k: rawStops.map((stop, index) => {
      const current = Array.isArray(stop.v) ? stop.v : [stop.v];

      if (index === rawStops.length - 1) {
        return { t: stop.t, s: current };
      }

      const next = Array.isArray(rawStops[index + 1].v) ? rawStops[index + 1].v : [rawStops[index + 1].v];
      const dimensions = current.length;

      return {
        t: stop.t,
        s: current,
        e: next,
        i: { x: Array(dimensions).fill(0.65), y: Array(dimensions).fill(1) },
        o: { x: Array(dimensions).fill(0.35), y: Array(dimensions).fill(0) },
      };
    }),
  };
}

function growScale(start, end, finalScale = [100, 100, 100], initialScale = [0, 0, 100]) {
  const stops = [{ t: 0, v: initialScale }];

  if (start > 0) {
    stops.push({ t: start, v: initialScale });
  }

  stops.push({ t: end, v: finalScale });
  return easedKeyframes(stops);
}

function growYScale(start, end, finalScale = [100, 100, 100]) {
  return growScale(start, end, finalScale, [100, 0, 100]);
}

function fade(inStart, inEnd, outStart, outEnd, maxOpacity = 100) {
  const stops = [{ t: 0, v: 0 }];

  if (inStart > 0) {
    stops.push({ t: inStart, v: 0 });
  }

  stops.push({ t: inEnd, v: maxOpacity });

  if (outStart !== undefined && outEnd !== undefined) {
    stops.push({ t: outStart, v: maxOpacity }, { t: outEnd, v: 0 });
  }

  return easedKeyframes(stops);
}

function prop(value) {
  return value?.a === 0 || value?.a === 1 ? value : staticProp(value);
}

function layer({ name, index, shapes, position = [0, 0], anchor = [0, 0], scale = [100, 100, 100], opacity = 100, rotation = 0 }) {
  return {
    ddd: 0,
    ind: index,
    ty: 4,
    nm: name,
    sr: 1,
    ks: {
      o: prop(opacity),
      r: prop(rotation),
      p: staticProp([position[0], position[1], 0]),
      a: staticProp([anchor[0], anchor[1], 0]),
      s: prop(scale),
    },
    ao: 0,
    shapes,
    ip: 0,
    op: DURATION + 1,
    st: 0,
    bm: 0,
  };
}

function fill(hex, opacity = 100) {
  return { ty: "fl", c: staticProp(hexToLottieColor(hex)), o: staticProp(opacity), r: 1, bm: 0, nm: "Fill" };
}

function stroke(hex, width, opacity = 100) {
  return {
    ty: "st",
    c: staticProp(hexToLottieColor(hex)),
    o: staticProp(opacity),
    w: staticProp(width),
    lc: 2,
    lj: 2,
    ml: 4,
    bm: 0,
    nm: "Stroke",
  };
}

function ellipse(size) {
  return { ty: "el", p: staticProp([0, 0]), s: staticProp(size), d: 1, nm: "Ellipse" };
}

function roundedRect(size, radius) {
  return { ty: "rc", d: 1, s: staticProp(size), p: staticProp([0, 0]), r: staticProp(radius), nm: "Rounded rectangle" };
}

function path(points, closed = false) {
  return {
    ty: "sh",
    ks: {
      a: 0,
      k: {
        i: points.map(() => [0, 0]),
        o: points.map(() => [0, 0]),
        v: points,
        c: closed,
      },
    },
    nm: "Path",
  };
}

function ellipseLayer({ name, index, position, size, color, start, end, rotation = 0, opacity = 100, outStart, outEnd }) {
  return layer({
    name,
    index,
    position,
    rotation,
    scale: growScale(start, end),
    opacity: fade(start, Math.min(end, start + 18), outStart, outEnd, opacity),
    shapes: [ellipse(size), fill(color)],
  });
}

function stemLayer({ name, index, position, points, color, width, start, end, opacity = 100 }) {
  return layer({
    name,
    index,
    position,
    scale: growYScale(start, end),
    opacity: fade(start, Math.min(end, start + 24), undefined, undefined, opacity),
    shapes: [path(points), stroke(color, width, opacity)],
  });
}

function branchLayer({ name, index, position, points, color, width, start, end }) {
  return layer({
    name,
    index,
    position,
    scale: growScale(start, end),
    opacity: fade(start, Math.min(end, start + 24)),
    shapes: [path(points), stroke(color, width)],
  });
}

const layers = [
  layer({
    name: "golden anniversary ring",
    index: 1,
    position: [180, 116],
    scale: growScale(330, 365, [118, 118, 100], [72, 72, 100]),
    opacity: fade(322, 365),
    shapes: [ellipse([184, 184]), stroke(colors.honey, 4, 78)],
  }),
  ellipseLayer({ name: "late cherry 5", index: 2, position: [226, 98], size: [13, 13], color: colors.cherry, start: 326, end: 350 }),
  ellipseLayer({ name: "late cherry 4", index: 3, position: [132, 108], size: [13, 13], color: colors.cherry, start: 310, end: 342 }),
  ellipseLayer({ name: "coffee cherry 3", index: 4, position: [245, 139], size: [12, 12], color: colors.cherry, start: 278, end: 322 }),
  ellipseLayer({ name: "coffee cherry 2", index: 5, position: [159, 142], size: [12, 12], color: colors.cherry, start: 248, end: 295 }),
  ellipseLayer({ name: "coffee cherry 1", index: 6, position: [204, 122], size: [12, 12], color: colors.cherry, start: 224, end: 270 }),
  ellipseLayer({ name: "coffee flower 3", index: 7, position: [211, 104], size: [15, 15], color: colors.flower, start: 184, end: 215, outStart: 285, outEnd: 330 }),
  ellipseLayer({ name: "coffee flower 2", index: 8, position: [145, 125], size: [14, 14], color: colors.flower, start: 172, end: 205, outStart: 270, outEnd: 320 }),
  ellipseLayer({ name: "coffee flower 1", index: 9, position: [230, 150], size: [14, 14], color: colors.flower, start: 162, end: 195, outStart: 260, outEnd: 310 }),
  ellipseLayer({ name: "canopy dark right", index: 10, position: [237, 112], size: [74, 44], color: colors.leafDark, start: 275, end: 350, rotation: 24, opacity: 94 }),
  ellipseLayer({ name: "canopy dark left", index: 11, position: [122, 118], size: [74, 44], color: colors.leafDark, start: 260, end: 340, rotation: -24, opacity: 94 }),
  ellipseLayer({ name: "canopy top", index: 12, position: [180, 74], size: [82, 48], color: colors.leafDark, start: 232, end: 325, rotation: 0, opacity: 94 }),
  ellipseLayer({ name: "canopy right", index: 13, position: [226, 118], size: [72, 42], color: colors.leaf, start: 190, end: 282, rotation: 22 }),
  ellipseLayer({ name: "canopy left", index: 14, position: [134, 119], size: [72, 42], color: colors.leaf, start: 178, end: 272, rotation: -22 }),
  ellipseLayer({ name: "young leaf right high", index: 15, position: [207, 113], size: [48, 26], color: colors.leaf, start: 122, end: 178, rotation: 30 }),
  ellipseLayer({ name: "young leaf left high", index: 16, position: [151, 117], size: [48, 26], color: colors.leaf, start: 112, end: 168, rotation: -30 }),
  ellipseLayer({ name: "young leaf right", index: 17, position: [224, 148], size: [44, 24], color: colors.sprout, start: 88, end: 138, rotation: 28 }),
  ellipseLayer({ name: "young leaf left", index: 18, position: [137, 150], size: [44, 24], color: colors.sprout, start: 78, end: 128, rotation: -28 }),
  ellipseLayer({ name: "sprout leaf right", index: 19, position: [196, 174], size: [34, 18], color: colors.sprout, start: 42, end: 82, rotation: 28 }),
  ellipseLayer({ name: "sprout leaf left", index: 20, position: [165, 176], size: [34, 18], color: colors.sprout, start: 34, end: 74, rotation: -28 }),
  branchLayer({ name: "right top branch", index: 21, position: [180, 128], points: [[0, 0], [42, -34], [62, -46]], color: colors.trunk, width: 5, start: 180, end: 260 }),
  branchLayer({ name: "left top branch", index: 22, position: [180, 130], points: [[0, 0], [-42, -32], [-65, -44]], color: colors.trunk, width: 5, start: 168, end: 248 }),
  branchLayer({ name: "right low branch", index: 23, position: [180, 154], points: [[0, 0], [36, -18], [54, -22]], color: colors.trunk, width: 4, start: 118, end: 190 }),
  branchLayer({ name: "left low branch", index: 24, position: [180, 157], points: [[0, 0], [-36, -18], [-54, -24]], color: colors.trunk, width: 4, start: 106, end: 180 }),
  stemLayer({ name: "coffee trunk", index: 25, position: [180, 216], points: [[0, 0], [-5, -50], [4, -100], [0, -154]], color: colors.trunk, width: 11, start: 84, end: 255 }),
  stemLayer({ name: "first green stem", index: 26, position: [180, 216], points: [[0, 0], [-4, -34], [3, -72], [0, -112]], color: colors.sprout, width: 6, start: 18, end: 126, opacity: 88 }),
  ellipseLayer({ name: "coffee seed", index: 27, position: [180, 210], size: [24, 16], color: colors.seed, start: 0, end: 18, rotation: -10, outStart: 70, outEnd: 118 }),
  layer({
    name: "soil highlight",
    index: 28,
    position: [180, 219],
    opacity: 55,
    shapes: [roundedRect([242, 18], 10), fill(colors.soilSoft, 55)],
  }),
  layer({
    name: "soil base",
    index: 29,
    position: [180, 230],
    shapes: [roundedRect([282, 34], 16), fill(colors.soil)],
  }),
];

const coffeeTreeAnimation = {
  v: "5.7.4",
  fr: 60,
  ip: 0,
  op: DURATION + 1,
  w: 360,
  h: 260,
  nm: "Coffee Tree Growth",
  ddd: 0,
  assets: [],
  layers,
  markers: [
    { tm: 0, cm: "Seed", dr: 30 },
    { tm: 30, cm: "Sprout", dr: 60 },
    { tm: 90, cm: "Young plant", dr: 92 },
    { tm: 182, cm: "Flowering", dr: 88 },
    { tm: 270, cm: "Ripening", dr: 95 },
    { tm: 365, cm: "Complete tree", dr: 1 },
  ],
};

export default coffeeTreeAnimation;
