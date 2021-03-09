import AppContainer from "../containers/AppContainer";
import attachLogger from "./attachLogger";

export default (callback) => (context) => {
  context.container = context.container || AppContainer.getInstance();
  attachLogger(context.req, context.res, context);
  return callback(context);
};
