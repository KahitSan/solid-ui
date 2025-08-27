import postcssImport from 'postcss-import';
import postcssCustomProperties from 'postcss-custom-properties';
import postcssCalc from 'postcss-calc';

export default {
  plugins: [
    postcssImport(),
    postcssCustomProperties({ preserve: false }),
    postcssCalc()
  ]
};