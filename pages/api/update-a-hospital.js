import withContainer from "../../src/middleware/withContainer";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    if (method !== "PATCH") {
      res.status(405);
      res.end();
      return;
    }

    const trustAdminIsAuthenticated = container.getTrustAdminIsAuthenticated();

    const trustAdminToken = trustAdminIsAuthenticated(headers.cookie);

    if (!trustAdminToken) {
      res.status(401);
      res.end();
      return;
    }

    if (!body || !body.id || !body.name) {
      res.status(400);
      res.end(JSON.stringify({ err: "hospital id and name must be present" }));
      return;
    }

    const retrieveHospitalById = container.getRetrieveHospitalById();

    const existingHospital = retrieveHospitalById(
      body.Id,
      trustAdminToken.trustId
    );

    if (existingHospital.error) {
      res.status(404);
      res.end(
        JSON.stringify({ err: "hospital does not exist in current trust" })
      );
      return;
    }

    const updateHospital = container.getUpdateHospital();

    const { id, error } = await updateHospital(body);

    if (error) {
      res.status(500);
      res.end(JSON.stringify({ error: "failed to update hospital" }));
    } else {
      res.status(200);
      res.end(JSON.stringify({ hospitalId: id }));
    }
  }
);
