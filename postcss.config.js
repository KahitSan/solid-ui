import postcssImport from 'postcss-import';
import postcssCustomProperties from 'postcss-custom-properties';
import postcssCalc from 'postcss-calc';

export default {
  plugins: [
    postcssImport({
      path: ['src/styles', 'src'],
      skipDuplicates: true
    }),
    postcssCustomProperties({ preserve: false }),
    postcssCalc()
  ]
};