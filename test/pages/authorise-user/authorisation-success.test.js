import { getServerSideProps } from "../../../pages/authorise-user/authorisation-success";

describe("/authorise-user/authorisation-success", () => {
  describe("getServerSideProps", () => {
    it("returns email as props", async () => {
      const { props } = await getServerSideProps({
        query: { email: "test@email.com" },
      });

      expect(props.email).toEqual("test@email.com");
    });
  });
});
