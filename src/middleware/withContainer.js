import AppContainer from "../containers/AppContainer";
import attachLogger from "./attachLogger";

export default (handler) => {
  return (req, res, ctx) => {
    ctx = ctx || {};
    ctx.container = ctx.container || AppContainer.getInstance();
    attachLogger(req, res, ctx);
    return handler(req, res, ctx);
  };
};
