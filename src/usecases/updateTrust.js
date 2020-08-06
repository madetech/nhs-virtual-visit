import { VIDEO_PROVIDERS } from "../providers/CallIdProvider";

const updateTrust = ({ getDb }) => async ({ id, videoProvider }) => {
  if (!id) {
    return { id: null, error: "An id must be provided." };
  }
  if (!VIDEO_PROVIDERS.includes(videoProvider)) {
    return {
      id: null,
      error: `${videoProvider} is not a supported video provider.`,
    };
  }

  const db = await getDb();

  try {
    const updatedTrust = await db.oneOrNone(
      `UPDATE trusts
      SET video_provider = $1
      WHERE
        id = $2
      RETURNING id
      `,
      [videoProvider, id]
    );

    if (updatedTrust) {
      return {
        id: updatedTrust.id,
        error: null,
      };
    } else {
      return {
        id: null,
        error: null,
      };
    }
  } catch (error) {
    console.error(error);

    return {
      id: null,
      error: error.toString(),
    };
  }
};

export default updateTrust;
