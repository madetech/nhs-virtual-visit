import retreiveVisits from "../../../src/usecases/retreiveVisits";
import pgp from "pg-promise";
import verifyToken from "../../../src/usecases/verifyToken";
import TokenProvider from "../../../src/providers/TokenProvider";

export default function WardVisits({ scheduledCalls, error }) {
  if (error) {
    return (
      <section>
        <h1>An error occurred.</h1>
        <p>{error}</p>
      </section>
    );
  }
  return (
    <ul>
      {scheduledCalls.map((scheduledCall) => (
        <li key={scheduledCall.id}>{JSON.stringify(scheduledCall)}</li>
      ))}
    </ul>
  );
}

export const getServerSideProps = verifyToken(
  async () => {
    const container = {
      getDb() {
        return pgp()({
          connectionString: process.env.URI,
          ssl: {
            rejectUnauthorized: false,
          },
        });
      },
    };

    const { scheduledCalls, error } = await retreiveVisits(container);

    return { props: { scheduledCalls, error } };
  },
  {
    tokens: new TokenProvider(process.env.JWT_SIGNING_KEY),
  }
);
