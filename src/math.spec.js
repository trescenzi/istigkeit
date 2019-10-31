import {hexToColor, colorToHex, calculateTargetColor, calculateForegroundColor, calculateAlpha} from './math';
describe('color math', () => {
  describe('hex conversions', () => {
    it('can convert 3 letter hexs to colors', () => {
      expect(hexToColor('#000')).toEqual({
        red: 0,
        green: 0,
        blue: 0,
        alpha: 1,
      });
      expect(hexToColor('#123')).toEqual({
        red: 17,
        green: 34,
        blue: 51,
        alpha: 1,
      });
      expect(hexToColor('#acf')).toEqual({
        red: 170,
        green: 204,
        blue: 255,
        alpha: 1,
      });
    });
    it('can convert 6 letter hexes to colors', () => {
      expect(hexToColor('#000000')).toEqual({
        red: 0,
        green: 0,
        blue: 0,
        alpha: 1,
      });
      expect(hexToColor('#123456')).toEqual({
        red: 18,
        green: 52,
        blue: 86,
        alpha: 1,
      });
      expect(hexToColor('#12ff56')).toEqual({
        red: 18,
        green: 255,
        blue: 86,
        alpha: 1,
      });
    });
    it('can handle alpha values', () => {
      expect(hexToColor('#FF000000')).toEqual({
        red: 0,
        green: 0,
        blue: 0,
        alpha: 1,
      });
      expect(hexToColor('#00000000')).toEqual({
        red: 0,
        green: 0,
        blue: 0,
        alpha: 0,
      });
      expect(hexToColor('#99000000')).toEqual({
        red: 0,
        green: 0,
        blue: 0,
        alpha: .6,
      });
    });
    describe('error handling', () => {
      it('handles no input', () => {
        expect(hexToColor()).toEqual({});
      });
      it('handles empty strings', () => {
        expect(hexToColor('')).toEqual({});
      });
      it('handles #less hexes', () => {
        expect(hexToColor('fff')).toEqual({});
        expect(hexToColor('ffffff')).toEqual({});
      });
      it('handles bad hexes', () => {
        expect(hexToColor('#f')).toEqual({});
        expect(hexToColor('#ff')).toEqual({});
        expect(hexToColor('#ffff')).toEqual({});
        expect(hexToColor('#fffff')).toEqual({});
        expect(hexToColor('#fffffff')).toEqual({});
      });
    });
  });
  describe('reverse conversions', () => {
    it('can convert color objects to hex', () => {
      let hex = '#000';
      expect(colorToHex(hexToColor(hex))).toEqual(hex);
      hex = '#fbfcfa';
      expect(colorToHex(hexToColor(hex))).toEqual(hex);
      hex = '#09ffffff';
      expect(colorToHex(hexToColor(hex))).toEqual(hex);
      hex = '#aaffffff';
      expect(colorToHex(hexToColor(hex))).toEqual(hex);
    });
  });
  describe('calculations', () => {
    describe('turning an opacity into a color', () => {
      it('can convert a 50% grey from black on white to a solid color', () => {
        const whiteBackground = hexToColor('#fff');
        const blackForeground = hexToColor('#000');
        const opacity = 0.5;
        expect(
          calculateTargetColor(blackForeground, whiteBackground, opacity)
        ).toEqual(
          hexToColor('#808080')
        );
      });
      it('can convert a 32% blue from blue on red to a solid color', () => {
        const whiteBackground = hexToColor('#f00');
        const blackForeground = hexToColor('#00f');
        const opacity = 0.32;
        expect(
          calculateTargetColor(blackForeground, whiteBackground, opacity)
        ).toEqual(
          hexToColor('#ad0052')
        );
      });
    });
    describe('turning a color into a color + opacity', () => {
      it('can convert a grey into 50% white on black', () => {
        const whiteBackground = hexToColor('#000');
        const greyColor = hexToColor('#808080');
        const opacity = 0.5;
        expect(
          calculateForegroundColor(whiteBackground, opacity, greyColor)
        ).toEqual(
          {
            red: 255,
            blue: 255,
            green: 255,
            alpha: 0.5,
          }
        );
      });
    });
    describe('getting the alpha required', () => {
      it('can calculate that 50% is the opacity for a grey thats black on white', () => {
        const whiteBackground = hexToColor('#fff');
        const blackForeground = hexToColor('#000');
        const greyColor = hexToColor('#808080');
        expect(
          calculateAlpha(blackForeground, whiteBackground, greyColor)
        ).toBeCloseTo(0.5);
      });
    });
  });
});
