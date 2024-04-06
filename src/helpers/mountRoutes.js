import fs from "fs";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mountRoutes = (app) => {
  const routesPath = resolve(join(__dirname, "../routes"));

  let routes = fs.readdirSync(routesPath);

  routes.forEach((path) => {
    import(`../routes/${path}`).then((module) => {
      app.use(`/api/${path.replace(".js", "")}`, module.default);
    });
  });
};

export default mountRoutes;
