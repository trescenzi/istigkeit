const HexGroup = "[0-9A-Fa-f]";
const HexPattern = new RegExp(
  `#(${HexGroup}{1,2})(${HexGroup}{1,2})(${HexGroup}{1,2})(${HexGroup}{0,2})$`
);
export const isHex = string => string.match(HexPattern);
export const isRGB = string => string.match(RgbPattern);
const hexToDec = (hexStr = "") =>
  hexStr.length === 1
    ? parseInt(`${hexStr}${hexStr}`, 16)
    : parseInt(hexStr, 16);
const decToHex = (decNum = "") => decNum.toString(16);
export const isColor = x =>
  (typeof x === "object") &
  x.hasOwnProperty("red") &
  x.hasOwnProperty("green") &
  x.hasOwnProperty("blue") &
  x.hasOwnProperty("alpha");

export function hexToColor(string) {
  try {
    let [_, red, green, blue, extra] = string.match(HexPattern);
    let alpha = 1;

    if (
      !(red.length === green.length && green.length === blue.length) ||
      extra.length === 1
    ) {
      return {};
    }
    if (extra) {
      alpha = hexToDec(red) / 255;
      red = extra;
    }

    return {
      red: hexToDec(red),
      green: hexToDec(green),
      blue: hexToDec(blue),
      alpha: alpha
    };
  } catch (e) {
    console.warn("Cannot parse string as hex", string);
    return {};
  }
}
export function rgbToColor(string) {
  try {
    let [red = "", green = "", blue = "", alpha = "1"] = string
      .substring(string.indexOf("(") + 1, string.length - 1)
      .split(",");
    if (red.includes("%")) {
      red = (parseInt(red.slice(0, -1)) * 255) / 100;
    }
    if (green.includes("%")) {
      green = (parseInt(green.slice(0, -1)) * 255) / 100;
    }
    if (blue.includes("%")) {
      blue = (parseInt(blue.slice(0, -1)) * 255) / 100;
    }

    red = parseFloat(red, 10);
    blue = parseFloat(blue, 10);
    green = parseFloat(green, 10);
    alpha = parseFloat(alpha, 10);

    if (
      Number.isNaN(red) ||
      Number.isNaN(blue) ||
      Number.isNaN(green) ||
      Number.isNaN(alpha) ||
      red > 255 ||
      blue > 255 ||
      green > 255 ||
      red < 0 ||
      blue < 0 ||
      green < 0 ||
      alpha > 1 ||
      alpha < 0
    ) {
      console.warn("RGB string provided with invalid values", string);
      return {};
    }

    return {
      red: red,
      green: green,
      blue: blue,
      alpha: alpha
    };
  } catch (e) {
    console.error(e);
    console.warn("Cannot parse string as RGB", string);
    return {};
  }
}

export const colorToHex = ({ red, green, blue, alpha = 1 }) => {
  const redHex = decToHex(red);
  const greenHex = decToHex(green);
  const blueHex = decToHex(blue);
  const alphaHex = alpha < 1 ? decToHex(alpha * 255) : "";
  return `#${
    alphaHex.length === 1 ? "0" + alphaHex : alphaHex
  }${redHex}${greenHex}${blueHex}`;
};
export const colorToRgb = ({ red, green, blue, alpha = 1 }) =>
  `rgb${alpha < 1 ? "a" : ""}(${red}, ${green}, ${blue} ${
    alpha < 1 ? `, ${alpha}` : ""
  })`;
export const stringToColor = string => {
  if (isHex(string)) {
    return hexToColor(string);
  }
  if (isRGB(string)) {
    return rgbToColor(string);
  }

  return string;
};

// calculations
const calculateTargetChannel = (foreground, background, opacity) =>
  background + (foreground - background) * opacity;
export const calculateTargetColor = (foreground, background, opacity) => {
  return {
    red: Math.round(
      calculateTargetChannel(foreground.red, background.red, opacity)
    ),
    green: Math.round(
      calculateTargetChannel(foreground.green, background.green, opacity)
    ),
    blue: Math.round(
      calculateTargetChannel(foreground.blue, background.blue, opacity)
    ),
    alpha: 1
  };
};

const calculateForegroundChannel = (background, opacity, target) =>
  Math.min((target - background + background * opacity) / opacity, 255);
export const calculateForegroundColor = (background, opacity, target) => ({
  red: calculateForegroundChannel(background.red, opacity, target.red),
  green: calculateForegroundChannel(background.green, opacity, target.green),
  blue: calculateForegroundChannel(background.blue, opacity, target.blue),
  alpha: opacity
});

const calculateAlphaChannel = (foreground, background, target) => {
  return (target - background) / (foreground - background) || 0;
};
export const calculateAlpha = (foreground, background, target) =>
  (calculateAlphaChannel(foreground.red, background.red, target.red) +
    calculateAlphaChannel(foreground.green, background.green, target.green) +
    calculateAlphaChannel(foreground.blue, background.blue, target.blue)) /
  3;
