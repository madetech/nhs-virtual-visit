import validateVisit from "./validateVisit";
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
        contactName: "Meow Meowington",
        contactEmail: "meow@example.com",
        contactNumber: "07123456789",
        callTime: new Date("2020-06-01 13:00"),
      };

      const { validVisit, errors } = validateVisit(visit);

      expect(validVisit).toBeTruthy();
      expect(errors).toBeNull;
    });

    it("returns true for validVisit if contact number is not provided but contact email is", () => {
      const visit = {
        patientName: "Woof Woofington",
        contactName: "Meow Meowington",
        contactEmail: "meow@example.com",
        callTime: new Date("2020-06-01 13:00"),
      };

      const { validVisit, errors } = validateVisit(visit);

      expect(validVisit).toBeTruthy();
      expect(errors).toBeNull;
    });

    it("returns true for validVisit if contact email is not provided but contact number is", () => {
      const visit = {
        patientName: "Woof Woofington",
        contactName: "Meow Meowington",
        contactNumber: "07123456789",
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
        contactName: "Meow Meowington",
        contactEmail: "meow@example.com",
        contactNumber: "07123456789",
        callTime: new Date("2020-06-01 13:00"),
      };

      const { validVisit, errors } = validateVisit(visit);

      expect(validVisit).toBeFalsy();
      expect(errors).toEqual({ patientName: "patientName must be present" });
    });

    it("returns an error for contactName if contact name is not provided", () => {
      const visit = {
        patientName: "Woof Woofington",
        contactEmail: "meow@example.com",
        contactNumber: "07123456789",
        callTime: new Date("2020-06-01 13:00"),
      };

      const { validVisit, errors } = validateVisit(visit);

      expect(validVisit).toBeFalsy();
      expect(errors).toEqual({ contactName: "contactName must be present" });
    });

    it("returns an error for callTime if call time is not provided", () => {
      const visit = {
        patientName: "Woof Woofington",
        contactName: "Meow Meowington",
        contactEmail: "meow@example.com",
        contactNumber: "07123456789",
      };

      const { validVisit, errors } = validateVisit(visit);

      expect(validVisit).toBeFalsy();
      expect(errors).toEqual({ callTime: "callTime must be present" });
    });

    it("returns an error for callTime if invalid call date", () => {
      const visit = {
        patientName: "Woof Woofington",
        contactName: "Meow Meowington",
        contactEmail: "meow@example.com",
        contactNumber: "07123456789",
        callTime: new Date("2020-06-01 09:00"),
      };

      const { validVisit, errors } = validateVisit(visit);

      expect(validVisit).toBeFalsy();
      expect(errors.callTime).not.toBeUndefined();
    });

    it("returns an error for contactEmail and contactNumber if both are not provided", () => {
      const visit = {
        patientName: "Woof Woofington",
        contactName: "Meow Meowington",
        callTime: new Date("2020-06-01 13:00"),
      };

      const { validVisit, errors } = validateVisit(visit);

      expect(validVisit).toBeFalsy();
      expect(errors).toEqual({
        contactEmail: "contactNumber or contactEmail must be present",
        contactNumber: "contactNumber or contactEmail must be present",
      });
    });

    it("returns an error for contactEmail if invalid email address", () => {
      const visit = {
        patientName: "Woof Woofington",
        contactName: "Meow Meowington",
        contactEmail: "invalidEmailAddress",
        contactNumber: "07123456789",
        callTime: new Date("2020-06-01 13:00"),
      };

      const { validVisit, errors } = validateVisit(visit);

      expect(validVisit).toBeFalsy();
      expect(errors).toEqual({
        contactEmail: "contactEmail must be a valid email address",
      });
    });

    it("returns an error for contactNumber if invalid mobile number", () => {
      const visit = {
        patientName: "Woof Woofington",
        contactName: "Meow Meowington",
        contactEmail: "meow@example.com",
        contactNumber: "invalidMobileNumber",
        callTime: new Date("2020-06-01 13:00"),
      };

      const { validVisit, errors } = validateVisit(visit);

      expect(validVisit).toBeFalsy();
      expect(errors).toEqual({
        contactNumber: "contactNumber must be a valid mobile number",
      });
    });

    it("returns errors for contactEmail and contactNumber if both invalid", () => {
      const visit = {
        patientName: "Woof Woofington",
        contactName: "Meow Meowington",
        contactEmail: "invalidEmailAddress",
        contactNumber: "invalidMobileNumber",
        callTime: new Date("2020-06-01 13:00"),
      };

      const { validVisit, errors } = validateVisit(visit);

      expect(validVisit).toBeFalsy();
      expect(errors).toEqual({
        contactEmail: "contactEmail must be a valid email address",
        contactNumber: "contactNumber must be a valid mobile number",
      });
    });

    it("returns multiple errors at once", () => {
      const visit = {};

      const { validVisit, errors } = validateVisit(visit);

      expect(validVisit).toBeFalsy();
      expect(errors).toEqual({
        patientName: "patientName must be present",
        contactName: "contactName must be present",
        callTime: "callTime must be present",
        contactEmail: "contactNumber or contactEmail must be present",
        contactNumber: "contactNumber or contactEmail must be present",
      });
    });
  });
});
