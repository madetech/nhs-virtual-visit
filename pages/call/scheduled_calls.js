import retreiveScheduledCalls from "../../src/usecases/retreiveScheduledCalls";
import pgp from "pg-promise";

export default function ScheduledCalls({ scheduledCalls, error }) {
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

export const getServerSideProps = async () => {
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

  const { scheduledCalls, error } = await retreiveScheduledCalls(container);

  return { props: { scheduledCalls, error } };
};
