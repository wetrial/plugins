const { strictEslint } = require('@wetrial/fabric');

module.exports = {
  ...strictEslint,
  globals: {
    page: true,
  },
};
