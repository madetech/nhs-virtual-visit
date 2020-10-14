import createVisit from "./createVisit";

describe("createVisit", () => {
  let randomIdProviderStub = jest.fn();
  let callIdProviderStub = jest.fn();
  let retrieveTrustByIdStub = jest.fn();
  let retrieveWardByIdStub = jest.fn();
  let createVisitUnitOfWorkSpy = jest.fn();

  let date = new Date();
  date.setDate(date.getDate() + 1);

  const setupTestDoubles = (
    callPassword,
    callId,
    trust,
    ward,
    bookingNotificationSuccess,
    bookingNotificationErrors
  ) => {
    randomIdProviderStub.mockReturnValue({ generate: () => callPassword });
    callIdProviderStub.mockReturnValue(callId);
    retrieveTrustByIdStub.mockReturnValue({ trust: trust, error: "" });
    retrieveWardByIdStub.mockReturnValue({ ward });
    createVisitUnitOfWorkSpy.mockReturnValue({
      bookingNotificationSuccess,
      bookingNotificationErrors,
    });
  };

  it("calls createVisitUnitOfWork with the visit and ward", async () => {
    const wardId = "wardId";
    const trustId = "trustId";
    const trust = { id: trustId, videoProvider: "testVideoProvider" };
    const ward = { id: wardId, name: "wardName", hospitalName: "hospitalName" };

    setupTestDoubles("123abc", "456cde", trust, ward, true, "");

    const visit = {
      patientName: "Patient Name",
      contactEmail: "contact@example.com",
      contactName: "Contact Name",
      callTime: date,
    };

    const response = await createVisit(
      randomIdProviderStub,
      callIdProviderStub,
      retrieveTrustByIdStub,
      retrieveWardByIdStub,
      createVisitUnitOfWorkSpy
    )(visit, wardId, trustId);

    const expectedVisit = {
      patientName: "Patient Name",
      contactEmail: "contact@example.com",
      contactName: "Contact Name",
      callTime: date,
      callId: "456cde",
      callPassword: "123abc",
      provider: trust.videoProvider,
    };

    expect(createVisitUnitOfWorkSpy).toHaveBeenCalledWith(expectedVisit, ward);
    expect(callIdProviderStub).toHaveBeenCalledWith(trust, visit.callTime);
    expect(retrieveTrustByIdStub).toHaveBeenCalledWith(trustId);
    expect(retrieveWardByIdStub).toHaveBeenCalledWith(wardId, trustId);
    expect(response).toEqual({ success: true, err: undefined });
  });

  it("throws error if booking notification error", async () => {
    const wardId = "wardId2";
    const trustId = "trustId2";
    const trust = { videoProvider: "testVideoProvider" };
    const ward = {
      id: wardId,
      name: "wardName2",
      hospitalName: "hospitalName2",
    };

    setupTestDoubles("12ab", "45cd", trust, ward, false, "emailError");

    const visit = {
      patientName: "Another Patient Name",
      contactEmail: "anothercontact@example.com",
      contactName: "Another Contact Name",
      callTime: date,
    };

    const response = await createVisit(
      randomIdProviderStub,
      callIdProviderStub,
      retrieveTrustByIdStub,
      retrieveWardByIdStub,
      createVisitUnitOfWorkSpy
    )(visit, wardId, trustId);

    const expectedVisit = {
      patientName: "Another Patient Name",
      contactEmail: "anothercontact@example.com",
      contactName: "Another Contact Name",
      callTime: date,
      callId: "45cd",
      callPassword: "12ab",
      provider: trust.videoProvider,
    };

    expect(createVisitUnitOfWorkSpy).toHaveBeenCalledWith(expectedVisit, ward);
    expect(response).toEqual({
      success: false,
      err: "Failed to send notification",
    });
  });

  it("throws error if invalid visit", async () => {
    const wardId = "wardId3";
    const trustId = "trustId3";
    const trust = { videoProvider: "testVideoProvider" };
    const ward = {
      id: wardId,
      name: "wardName3",
      hospitalName: "hospitalName3",
    };

    setupTestDoubles("12ab", "45cd", trust, ward, true, "");

    const visit = {
      patientName: "",
      contactEmail: "contact@example.com",
      contactName: "Contact Name",
      callTime: date,
    };

    const response = await createVisit(
      randomIdProviderStub,
      callIdProviderStub,
      retrieveTrustByIdStub,
      retrieveWardByIdStub,
      createVisitUnitOfWorkSpy
    )(visit, wardId, trustId);

    expect(response).toEqual({
      success: false,
      err: { patientName: "patientName must be present" },
    });
    expect(createVisitUnitOfWorkSpy).toHaveBeenCalledTimes(0);
  });
});
