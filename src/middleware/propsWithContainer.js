import AppContainer from "../containers/AppContainer";

export default (callback) => (context) => {
  context.container = context.container || AppContainer.getInstance();
  return callback(context);
};
