const { series, parallel } = require('gulp');

const task1 = () => {
  console.log('task1');

  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, 3000)
  });
};

const task2 = () => {
  console.log('task2');

  return Promise.resolve();
};

// exports.default = series(task1, task2);
exports.default = parallel(task1, task2);