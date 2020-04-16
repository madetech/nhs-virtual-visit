import AppContainer from "../containers/AppContainer";

export default (handler) => {
  return (req, res, ctx) => {
    ctx = ctx || {};
    ctx.container = ctx.container || new AppContainer();
    return handler(req, res, ctx);
  };
};
