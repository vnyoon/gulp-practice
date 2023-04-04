const { src, dest } = require('gulp');

const copy = () => {
  return src('src/*').pipe(dest('dist/'))
};

exports.default = copy;