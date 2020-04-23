import AppContainer from "../containers/AppContainer";

export default (callback) => (context) => {
  context.container = context.container || new AppContainer();
  callback(context);
};
