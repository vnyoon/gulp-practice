// exports.default = (cb) => {
//   console.log(cb);
//   console.log('my gulp task');
  
//   cb();
// };

// 另一种写法
exports.default = () => {
  console.log('my gulp task');

  return Promise.resolve();
};