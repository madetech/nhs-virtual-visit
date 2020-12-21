import createVisit from "../../src/usecases/createVisit";

describe("createVisit", () => {
  let createVisitUnitOfWorkSpy = jest.fn();

  let date = new Date();
  date.setDate(date.getDate() + 1);

  const setupTestDoubles = (success, error) => {
    createVisitUnitOfWorkSpy.mockReturnValue({
      success,
      error,
    });
  };

  it("calls createVisitUnitOfWork with the visit and ward", async () => {
    const wardId = "wardId";
    const ward = { id: wardId, name: "wardName", hospitalName: "hospitalName" };
    const callId = "12ab34cd";
    const callPassword = "testpassword";
    const videoProvider = "testProvider";

    setupTestDoubles(true, "");

    const visit = {
      patientName: "Patient Name",
      contactEmail: "contact@example.com",
      contactName: "Contact Name",
      callTime: date,
    };

    const response = await createVisit(createVisitUnitOfWorkSpy)(
      visit,
      ward,
      callId,
      callPassword,
      videoProvider
    );

    const expectedVisit = {
      patientName: "Patient Name",
      contactEmail: "contact@example.com",
      contactName: "Contact Name",
      callTime: date,
      callId: callId,
      callPassword: callPassword,
      provider: videoProvider,
    };

    expect(createVisitUnitOfWorkSpy).toHaveBeenCalledWith(expectedVisit, ward);
    expect(response).toEqual({ success: true, err: undefined });
  });

  it("throws error if booking notification error", async () => {
    const wardId = "wardId2";
    const ward = {
      id: wardId,
      name: "wardName2",
      hospitalName: "hospitalName2",
    };
    const callId = "789xyz";
    const callPassword = "anothertestpassword";
    const videoProvider = "anotherTestProvider";

    setupTestDoubles(false, "emailError");

    const visit = {
      patientName: "Another Patient Name",
      contactEmail: "anothercontact@example.com",
      contactName: "Another Contact Name",
      callTime: date,
    };

    const response = await createVisit(createVisitUnitOfWorkSpy)(
      visit,
      ward,
      callId,
      callPassword,
      videoProvider
    );

    const expectedVisit = {
      patientName: "Another Patient Name",
      contactEmail: "anothercontact@example.com",
      contactName: "Another Contact Name",
      callTime: date,
      callId: callId,
      callPassword: callPassword,
      provider: videoProvider,
    };

    expect(createVisitUnitOfWorkSpy).toHaveBeenCalledWith(expectedVisit, ward);
    expect(response).toEqual({
      success: false,
      err: "emailError",
    });
  });

  it("returns error if invalid visit", async () => {
    const wardId = "wardId3";
    const ward = {
      id: wardId,
      name: "wardName3",
      hospitalName: "hospitalName3",
    };
    const callId = "789xyz";
    const callPassword = "anothertestpassword";
    const videoProvider = "anotherTestProvider";

    setupTestDoubles(true, "");

    const visit = {
      patientName: "",
      contactEmail: "contact@example.com",
      contactName: "Contact Name",
      callTime: date,
    };

    const response = await createVisit(createVisitUnitOfWorkSpy)(
      visit,
      ward,
      callId,
      callPassword,
      videoProvider
    );

    expect(response).toEqual({
      success: false,
      err: { patientName: "patientName must be present" },
    });
    expect(createVisitUnitOfWorkSpy).toHaveBeenCalledTimes(0);
  });
});
