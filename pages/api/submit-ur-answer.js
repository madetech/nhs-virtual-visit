import withContainer from "../../src/middleware/withContainer";

export default withContainer(async (req, res, { container }) => {
  /*const logEvent =*/ container.getLogEventGateway();
});
