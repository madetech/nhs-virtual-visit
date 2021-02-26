import validateVisit from "../../src/helpers/validateVisit";
import MockDate from "mockdate";

describe("validateVisit", () => {
  beforeAll(() => {
    MockDate.set(new Date("2020-06-01 13:00"));
  });

  afterAll(() => {
    MockDate.reset();
  });

  describe("when a valid visit is provided", () => {
    it("returns true for validVisit", () => {
      const visit = {
        patientName: "Woof Woofington",
        recipientName: "Meow Meowington",
        recipientEmail: "meow@example.com",
        recipientNumber: "07123456789",
        callTime: new Date("2020-06-01 13:00"),
      };

      const { validVisit, errors } = validateVisit(visit);

      expect(validVisit).toBeTruthy();
      expect(errors).toBeNull;
    });

    it("returns true for validVisit if recipient number is not provided but recipient email is", () => {
      const visit = {
        patientName: "Woof Woofington",
        recipientName: "Meow Meowington",
        recipientEmail: "meow@example.com",
        callTime: new Date("2020-06-01 13:00"),
      };

      const { validVisit, errors } = validateVisit(visit);

      expect(validVisit).toBeTruthy();
      expect(errors).toBeNull;
    });

    it("returns true for validVisit if recipient email is not provided but recipient number is", () => {
      const visit = {
        patientName: "Woof Woofington",
        recipientName: "Meow Meowington",
        recipientNumber: "07123456789",
        callTime: new Date("2020-06-01 13:00"),
      };

      const { validVisit, errors } = validateVisit(visit);

      expect(validVisit).toBeTruthy();
      expect(errors).toBeNull;
    });
  });

  describe("when an invalid visit is provided", () => {
    it("returns an error for patientName if patient name is not provided", () => {
      const visit = {
        recipientName: "Meow Meowington",
        recipientEmail: "meow@example.com",
        recipientNumber: "07123456789",
        callTime: new Date("2020-06-01 13:00"),
      };

      const { validVisit, errors } = validateVisit(visit);

      expect(validVisit).toBeFalsy();
      expect(errors).toEqual({ patientName: "patientName must be present" });
    });

    it("returns an error for recipientName if recipient name is not provided", () => {
      const visit = {
        patientName: "Woof Woofington",
        recipientEmail: "meow@example.com",
        recipientNumber: "07123456789",
        callTime: new Date("2020-06-01 13:00"),
      };

      const { validVisit, errors } = validateVisit(visit);

      expect(validVisit).toBeFalsy();
      expect(errors).toEqual({ recipientName: "recipientName must be present" });
    });

    it("returns an error for callTime if call time is not provided", () => {
      const visit = {
        patientName: "Woof Woofington",
        recipientName: "Meow Meowington",
        recipientEmail: "meow@example.com",
        recipientNumber: "07123456789",
      };

      const { validVisit, errors } = validateVisit(visit);

      expect(validVisit).toBeFalsy();
      expect(errors).toEqual({ callTime: "callTime must be present" });
    });

    it("returns an error for callTime if invalid call date", () => {
      const visit = {
        patientName: "Woof Woofington",
        recipientName: "Meow Meowington",
        recipientEmail: "meow@example.com",
        recipientNumber: "07123456789",
        callTime: new Date("2020-06-01 09:00"),
      };

      const { validVisit, errors } = validateVisit(visit);

      expect(validVisit).toBeFalsy();
      expect(errors.callTime).not.toBeUndefined();
    });

    it("returns an error for recipientEmail and recipientNumber if both are not provided", () => {
      const visit = {
        patientName: "Woof Woofington",
        recipientName: "Meow Meowington",
        callTime: new Date("2020-06-01 13:00"),
      };

      const { validVisit, errors } = validateVisit(visit);

      expect(validVisit).toBeFalsy();
      expect(errors).toEqual({
        recipientEmail: "recipientNumber or recipientEmail must be present",
        recipientNumber: "recipientNumber or recipientEmail must be present",
      });
    });

    it("returns an error for recipientEmail if invalid email address", () => {
      const visit = {
        patientName: "Woof Woofington",
        recipientName: "Meow Meowington",
        recipientEmail: "invalidEmailAddress",
        recipientNumber: "07123456789",
        callTime: new Date("2020-06-01 13:00"),
      };

      const { validVisit, errors } = validateVisit(visit);

      expect(validVisit).toBeFalsy();
      expect(errors).toEqual({
        recipientEmail: "recipientEmail must be a valid email address",
      });
    });

    it("returns an error for recipientNumber if invalid mobile number", () => {
      const visit = {
        patientName: "Woof Woofington",
        recipientName: "Meow Meowington",
        recipientEmail: "meow@example.com",
        recipientNumber: "invalidMobileNumber",
        callTime: new Date("2020-06-01 13:00"),
      };

      const { validVisit, errors } = validateVisit(visit);

      expect(validVisit).toBeFalsy();
      expect(errors).toEqual({
        recipientNumber: "recipientNumber must be a valid mobile number",
      });
    });

    it("returns errors for recipientEmail and recipientNumber if both invalid", () => {
      const visit = {
        patientName: "Woof Woofington",
        recipientName: "Meow Meowington",
        recipientEmail: "invalidEmailAddress",
        recipientNumber: "invalidMobileNumber",
        callTime: new Date("2020-06-01 13:00"),
      };

      const { validVisit, errors } = validateVisit(visit);

      expect(validVisit).toBeFalsy();
      expect(errors).toEqual({
        recipientEmail: "recipientEmail must be a valid email address",
        recipientNumber: "recipientNumber must be a valid mobile number",
      });
    });

    it("returns multiple errors at once", () => {
      const visit = {};

      const { validVisit, errors } = validateVisit(visit);

      expect(validVisit).toBeFalsy();
      expect(errors).toEqual({
        patientName: "patientName must be present",
        recipientName: "recipientName must be present",
        callTime: "callTime must be present",
        recipientEmail: "recipientNumber or recipientEmail must be present",
        recipientNumber: "recipientNumber or recipientEmail must be present",
      });
    });
  });
});
