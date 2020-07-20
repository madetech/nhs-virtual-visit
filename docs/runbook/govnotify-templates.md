# Gov.uk Notify Templates

https://www.notifications.service.gov.uk/using-notify/get-started

The app uses 6 different notification templates (3 SMS and 3 Email). You can find suggested copy for each notification below, listed by the environment variable we use in the app.

We suggest creating separate templates for staging and production so that you can test template changes without affecting the live app.

## Templates

### SMS_INITIAL_TEMPLATE_ID

> Hello,
>
> Following your phone call with ((hospital_name)) ((ward_name)), staff have arranged a virtual visit with a patient on ((visit_date)) at ((visit_time))
>
> Another text message will be sent to you when the patient and clinician are ready, which may not be exactly at ((visit_time))
>
> Please ensure you join the virtual visit knowing the patient name and date of birth to confirm identity.

---

### SMS_UPDATED_VISIT_TEMPLATE_ID

> Hello,
>
> Staff at ((ward_name)) in ((hospital_name)) have changed your virtual visit with a patient to ((visit_date)) at ((visit_time))
>
> Another text message will be sent to you when the patient and clinician are ready, which may not be exactly at ((visit_time))
>
> Please ensure you join the virtual visit knowing the patient name and date of birth to confirm identity.

---

### SMS_JOIN_TEMPLATE_ID

> Hello,
>
> ((ward_name)) at ((hospital_name)) is trying to contact you to have a virtual visit with a patient. Please click the link below to start the virtual visit
> ((call_url))

---

### EMAIL_INITIAL_TEMPLATE_ID

#### Subject

Your NHS virtual visit booking confirmation

#### Body

> Hello,
>
> Following your phone call with ((hospital_name)) ((ward_name)), staff have arranged a virtual visit with a patient on ((visit_date)) at ((visit_time))
>
> Another email will be sent to you when the patient and clinician are ready, which may not be exactly at ((visit_time))
>
> Please ensure you join the virtual visit knowing the patient name and date of birth to confirm identity.

---

### EMAIL_UPDATED_VISIT_TEMPLATE_ID

#### Subject

Your NHS virtual visit has changed

#### Body

> Hello,
>
> Staff at ((ward_name)) in ((hospital_name)) have changed your virtual visit with a patient to ((visit_date)) at ((visit_time))
>
> Another email will be sent to you when the patient and clinician are ready, which may not be exactly at ((visit_time))
>
> Please ensure you join the virtual visit knowing the patient name and date of birth to confirm identity.

---

### EMAIL_JOIN_TEMPLATE_ID

#### Subject

Your NHS virtual visit is ready

#### Body

> Hello,
>
> ((ward_name)) at ((hospital_name)) is trying to contact you to have a virtual visit with a patient. Please click the link to start the virtual visit:
>
> ((call_url))
