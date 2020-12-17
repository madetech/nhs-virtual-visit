import insertVisit from "./insertVisit";
import { SCHEDULED } from "../helpers/visitStatus";

describe("insertVisit tests", () => {
  it("creates a visit in the db when valid", async () => {
    const oneSpy = jest.fn();
    oneSpy.mockResolvedValueOnce({ id: 10 });
    oneSpy.mockResolvedValueOnce({ id: 8 });
    oneSpy.mockResolvedValue({ id: 6, call_id: "12345" });
    const db = {
      one: oneSpy,
    };

    const request = {
      patientName: "Bob Smith",
      contactEmail: "bob.smith@madetech.com",
      contactName: "John Smith",
      contactNumber: "07123456789",
      callTime: new Date(),
      callId: "12345",
      provider: "whereby",
      wardId: 1,
      callPassword: "securePassword",
    };
    const wardId = "wardId";
    const { id } = await insertVisit(db, request, wardId);

    expect(id).toEqual(6);
    expect(oneSpy).toHaveBeenCalledWith(expect.anything(), [
      request.patientName,
      wardId,
    ]);

    expect(oneSpy).toHaveBeenCalledWith(expect.anything(), [
      request.contactName,
      request.contactEmail,
      request.contactNumber,
      wardId,
    ]);

    expect(oneSpy).toHaveBeenCalledWith(expect.anything(), [
      request.callTime,
      request.callId,
      request.provider,
      wardId,
      request.callPassword,
      SCHEDULED,
      10,
      8,
    ]);
  });
});
