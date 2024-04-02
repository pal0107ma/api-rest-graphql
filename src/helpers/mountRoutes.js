const fs = require("fs");
const path = require("path");

const mountRoutes = (app) => {
  const routesPath = path.resolve(path.join(__dirname, "../routes"));

  let routes = fs.readdirSync(routesPath);

  routes = routes.map((str) => str.replace(".js", ""));

  routes.forEach((path) => {
    const router = require(`../routes/${path}`);

    app.use(`/api/${path}`, router);
  });
};

module.exports = mountRoutes;
