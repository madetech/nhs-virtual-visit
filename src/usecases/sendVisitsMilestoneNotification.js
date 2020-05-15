const sendVisitsMilestoneNotification = ({ getSlack }) => async ({
  numberOfVisits,
}) => {
  if (numberOfVisits % 500 === 0) {
    const slack = getSlack();

    const response = await slack.postMessage({
      text: `We've reached a milestone:\n\n:raised_hands: The ${numberOfVisits}th virtual visit has been booked! :raised_hands:`,
      channel: process.env.SLACK_CHANNEL_ID_VISITS_MILESTONE,
    });

    return { milestone: true, error: response.error };
  } else {
    return { milestone: false, error: null };
  }
};

export default sendVisitsMilestoneNotification;
