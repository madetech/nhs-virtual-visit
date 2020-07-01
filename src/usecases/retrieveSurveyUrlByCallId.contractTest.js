import AppContainer from "../containers/AppContainer";
import {
  setupVisit,
  setupWardWithinHospitalAndTrust,
} from "../testUtils/factories";

describe("retrieveSurveyUrlByCallId contract tests", () => {
  const container = AppContainer.getInstance();

  it("returns survey URL for a hospital of a visit", async () => {
    const callId = "callId1";

    const { wardId } = await setupWardWithinHospitalAndTrust({
      hospitalArgs: { surveyUrl: "https://www.survey.example.com" },
    });

    await setupVisit({ wardId, callId });

    const { surveyUrl, error } = await container.getRetrieveSurveyUrlByCallId()(
      callId
    );

    expect(surveyUrl).toEqual("https://www.survey.example.com");
    expect(error).toBeNull();
  });

  it("returns null if hospital doesn't have a survey link", async () => {
    const callId = "callId1";

    const { wardId } = await setupWardWithinHospitalAndTrust({
      hospitalArgs: { surveyUrl: null },
    });

    await setupVisit({ wardId, callId });

    const { surveyUrl, error } = await container.getRetrieveSurveyUrlByCallId()(
      callId
    );

    expect(surveyUrl).toBeNull();
    expect(error).toBeNull();
  });

  it("returns an error if no callId is provided", async () => {
    const { error } = await container.getRetrieveSurveyUrlByCallId()();

    expect(error).not.toBeNull();
  });
});
