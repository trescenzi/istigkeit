<script>
import {
  stringToColor,
  calculateForegroundColor,
  calculateTargetColor,
  calculateAlpha,
  colorToHex,
  colorToRgb,
  isColor,
} from './math';
let foreground = {
  red: 0,
  green: 0,
  blue: 0,
  alpha: 1,
};
let background = {
  red: 255,
  green: 255,
  blue: 255,
  alpha: 1,
};
let opacity = .5;
let target = calculateTargetColor(foreground, background, opacity);

$: console.log(foreground, background, target, opacity);
function updateForeground({target: {value}}) {
  foreground = stringToColor(value);
  console.log('CALCULATING foregroung', opacity, foreground, background)
  target =  calculateTargetColor(foreground, background, opacity);
}
function updateBackground({target: {value}}) {
  background = stringToColor(value);
  foreground = calculateForegroundColor(background, opacity, target);
  target =  calculateTargetColor(foreground, background, opacity);
}
function updateOpacity({target: {value}}) {
  opacity = parseFloat(value);
  foreground = calculateForegroundColor(background, opacity, target);
  target =  calculateTargetColor(foreground, background, opacity);
}
function updateTarget({target: {value}}) {
  target = stringToColor(value);
  opacity = calculateAlpha(foreground, background, target);
  foreground = calculateForegroundColor(background, opacity, target);
}
</script>

<label>
  Color
  <input
    on:change={updateForeground}
    value={colorToHex(foreground)}
  />
</label>
<label>
  Background
  <input
    on:change={updateBackground}
    value={colorToHex(background)}
  />
</label>
<label>
  Opacity
  <input
    on:change={updateOpacity}
    value={opacity}
  />
</label>
<label>
  Color Without Opacity
  <input 
    on:change={updateTarget}
    value={colorToHex(target)}
  />
</label>
<div 
  class="background"
  style={`background-color: ${colorToRgb(background)}`}
>
  <div
    class="swatch"
    style={`background-color: ${colorToRgb(foreground)}; opacity: ${opacity}`}
  >
  </div>
  <div
    class="swatch"
    style={`background-color: ${colorToRgb(target)}`}
  >
  </div>
</div>
<div
  class="swatch"
  style={`background-color: ${colorToRgb(foreground)};`}
>
</div>

<style>
.swatch {
  height: 50px;
  width: 50px;
}
.background {
  width: 100px;
  height: 100px;
  border: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
