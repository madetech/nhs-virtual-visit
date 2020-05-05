export default {
  firstText: {
    templateId: process.env.SMS_INITIAL_TEMPLATE_ID,
    personalisationKeys: [
      "hospital_name",
      "ward_name",
      "visit_date",
      "visit_time",
    ],
  },
  secondText: {
    templateId: process.env.SMS_JOIN_TEMPLATE_ID,
    personalisationKeys: ["call_url", "ward_name", "hospital_name"],
  },
};
