const itemsByName = require("./itemsByName.json");

export const getImgSrc = (prettyName) => {
  const item = itemsByName[prettyName];

  return item ? `data:image/png;base64,${item.icon}` : "";
};
