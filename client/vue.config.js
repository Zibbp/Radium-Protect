const path = require("path");
module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: { port: 7091 },
  outputDir: path.resolve(__dirname, "../public"),
};
