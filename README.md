# NHS Virtual Visit

This application allows for patients in hospitals to be able to contact loved ones and or key contacts via a virtual visit outside of hospital.

Both staging and production environments are hosted on [Heroku](https://www.heroku.com), the database being used is [postgres](https://www.postgresql.org) which is also hosted on Heroku.

For the SMS messaging we have used [GovNotify](https://www.notifications.service.gov.uk/accounts) to handle this. We use two SMS templates within GovNotify, one for the initial text message to tell the key contact that a patient wants to have a virtual visit, and a secondary text message with the link to the virtual visit room.

For the video chat capabilities we use [Jitsi Meet](https://github.com/jitsi/jitsi-meet/blob/master/doc/README.md) which allows for us to have a secure, simple and scalable video Conferences which we embedded within this web application.

## Environment variables

In order to run this app locally you will need to add these variables to your `.env` file.

- A list of allowed ward codes to allow users to login `ALLOWED_CODES=`
- The API key to allow access to GovNotify `API_KEY=`
- The URL for the Heroku database instance `DATABASE_URL=`
- Used to sign the JWT `JWT_SIGNING_KEY=`
- Defines the base URL `ORIGIN=`
- The GovNotify template ID for the first text message `SMS_INITIAL_TEMPLATE_ID =`
- The GovNotify template ID for the second text message `SMS_JOIN_TEMPLATE_ID=`

## Running the app locally

Requires PostgreSQL 12

### Enable SSL in Postgres

Check your postgres installation to see if SSL is already enabled.

Within the data folder of your PostgreSQL installation (e.g. `~/Library/Application Support/Postgres/var-12`), generate an self-signed certificate (details here https://www.postgresql.org/docs/12/ssl-tcp.html#SSL-CERTIFICATE-CREATION).

After generating the certificate, edit the postgresql.conf file in the data folder to enable ssl (`ssl = on`).

Restart your PostgreSQL server and SSL will connections will be enabled

### Setup the database

Create the database

```
createdb nhs-virtual-visit-dev
```

Load the current schema into the database

```
cat db/schema.sql | psql nhs-virtual-visit-dev
```

Add the database URI as an environment variable in `.env`. On Linux you may need to provide a username and password.

```
URI=postgresql://localhost/nhs-virtual-visit-dev
```

You can run a local copy of the app by running

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Running tests

You can run tests by running

```
npm test
```

## Building a production version

```
npm run build
```

This will produce output that you can use to host a production copy of the app.

## More documentation

- [Glossary](docs/GLOSSARY.md) - types of users, vocabulary used in copy and descriptions of the intent for each page.

## Contacts

- **Luke Morton** - CTO at [Made Tech](https://www.madetech.com) (luke@madetech.com)
- **Jessica Nichols** - Delivery Manager at [Made Tech](https://www.madetech.com) (jessica.nichols@madetech.com)
- **Antony O'Neill** - Senior Software Engineer at [Made Tech](https://www.madetech.com) (antony.oneill@madetech.com)
- **Tom Davies** - Senior Software Engineer at [Made Tech](https://www.madetech.com) (tom.davies@madetech.com)
- **George Schena** - Software Engineer at [Made Tech](https://www.madetech.com) (george@madetech.com)
- **Wen Ting Wang** - Software Engineer at [Made Tech](https://www.madetech.com) (wenting@madetech.com)

## License

MIT
