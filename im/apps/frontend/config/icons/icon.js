const fs = require('fs');

const antDesign = require('@iconify-json/ant-design/icons.json');

const toCase = (str) =>
  str
    .toLowerCase()
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

const transform = (data) =>
  Object.keys(data.icons).reduce(
    (prev, icon) => ({ ...prev, [toCase(icon)]: `${data.prefix}:${icon}` }),
    {},
  );

const json = transform(antDesign);
fs.writeFileSync('ant-design.json', JSON.stringify(json, null, 2));
