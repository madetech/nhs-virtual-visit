import { getServerSideProps } from "../../../pages/sign-up";

describe("/sign-up", () => {
  describe("getServerSideProps", () => {
    it("returns all organisations as props", async () => {
      const organisationArr = [
        { id: 1, name: "organisation1" },
        { id: 2, name: "organisation2" },
      ];
      const retrieveOrganisationsSpy = jest.fn(async () => {
        return {
          organisations: organisationArr,
          error: null,
        };
      });

      const container = {
        getRetrieveOrganisations: () => retrieveOrganisationsSpy,
      };

      const { props } = await getServerSideProps({
        container,
      });

      const expectedOrganisations = [
        { id: 1, name: "organisation1" },
        { id: 2, name: "organisation2" },
      ];
      expect(props.organisations).toHaveLength(2);
      expect(props.organisations).toEqual(expectedOrganisations);
      expect(props.error).toBeNull();
      expect(retrieveOrganisationsSpy).toHaveBeenCalledTimes(1);
    });
  });

  it("returns empty organisations array and an error as props if there is an error with database call", async () => {
    const retrieveOrganisations = jest.fn(async () => {
      return {
        organisations: null,
        error: "There is a problem with the database",
      };
    });

    const container = {
      getRetrieveOrganisations: () => retrieveOrganisations,
    };

    const { props } = await getServerSideProps({
      container,
    });

    expect(props.organisations).toBeNull();
    expect(props.error).toEqual("There is a problem with the database");
  });
});
