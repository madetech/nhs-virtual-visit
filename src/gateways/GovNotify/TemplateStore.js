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
  updatedVisitText: {
    templateId: process.env.SMS_UPDATED_VISIT_TEMPLATE_ID,
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
  firstEmail: {
    templateId: process.env.EMAIL_INITIAL_TEMPLATE_ID,
    personalisationKeys: [
      "hospital_name",
      "ward_name",
      "visit_date",
      "visit_time",
    ],
  },
  updatedVisitEmail: {
    templateId: process.env.EMAIL_UPDATED_VISIT_TEMPLATE_ID,
    personalisationKeys: [
      "hospital_name",
      "ward_name",
      "visit_date",
      "visit_time",
    ],
  },
  secondEmail: {
    templateId: process.env.EMAIL_JOIN_TEMPLATE_ID,
    personalisationKeys: ["call_url", "ward_name", "hospital_name"],
  },
};
