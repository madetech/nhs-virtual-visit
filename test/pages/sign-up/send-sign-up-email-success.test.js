import { getServerSideProps } from "../../../pages/reset-password/send-email-success";

describe("/sign-up/send-sign-up-email-success", () => {
  describe("getServerSideProps", () => {
    it("returns email as props", async () => {
      const { props } = await getServerSideProps({
        query: { email: "test@email.com" },
      });

      expect(props.email).toEqual("test@email.com");
    });
  });
});
