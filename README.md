# NHS Virtual Visitation

This application allows for patients in hospital to be able to contact loved ones and or key contacts via a video chat outside of hospital.

Both staging and production environments are hosted on [Heroku](https://www.heroku.com), the database being used is [postgres](https://www.postgresql.org) which is also hosted on Heroku.

For the SMS messaging we have used [GovNotify](https://www.notifications.service.gov.uk/accounts) to handle this. We use two SMS templates within GovNotify, one for the initial text message to tell the key contact that a patient wants to have a virtual visitation, and a secondary text message with the link to the virtual visitation.

For the video chat capabilities we use [Jitsi Meet](https://github.com/jitsi/jitsi-meet/blob/master/doc/README.md) which allows for us to have a Secure, Simple and Scalable Video Conferences we embedded in this web application.

##Env Variables
In order to run this app locally you will need to add these variables to your `.env` file.

- `ALLOWED_CODES=`
- `API_KEY=`
- `DATABASE_URL=`
- `JWT_SIGNING_KEY=`
- `ORIGIN=`
- `SMS_INITIAL_TEMPLATE_ID =`
- `SMS_JOIN_TEMPLATE_ID=`
- `URI=`

## Running the app locally

You can run a local copy of the app by running
`npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Running tests

You can run tests by running
`npm test`

## Building a production version

`npm run build`

This will produce output that you can use to host a production copy of the app.

## Contacts

- **Luke Morton** Director at [Made Tech](https://www.madetech.com) (luke@madetech.com)
- **Jessica Nichols** Delivery Manager at [Made Tech](https://www.madetech.com) (jessica.nichols@madetech.com)
- **Antony O'Neill** Senior Engineer at [Made Tech](https://www.madetech.com) (antony.oneill@madetech.com)
- **Tom Davies** Senior Engineer at [Made Tech](https://www.madetech.com) (tom.davies@madetech.com)
- **George Schena** Engineer at [Made Tech](https://www.madetech.com) (george@madetech.com)
- **Wen Ting Wang** Engineer at [Made Tech](https://www.madetech.com) (wenting@madetech.com)
