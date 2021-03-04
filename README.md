# NHS Virtual Visit

This service allows ward staff to schedule a visit for a patient. Allowing face to face visits for visitors who are unable to visit in person.

It includes an Administration panel which provides self-service functionality for adding new Trusts, Hospitals, and Wards.

## Development

Please read our separate [Development Guide](./docs/development/README.md).

## User flows

### Scheduling a visit

1. Ward staff makes contact with a visitor of a patient
1. A date and time is agreed and the ward staff schedules the visit
1. The visitor is sent a text message and/or email notification confirming the date and time of the visit

### Starting a visit

1. Ward staff can see a list of visits booked for patients on their ward
1. At the time of a visit, the ward staff will see a reminder of the visit details
1. The ward staff prepares the patient to start the visit
1. A text message and/or email notification with a unique link is sent to the visitor to join the visit
1. The ward staff waits for the visitor to join, and checks some basic details before handing over to the patient

### Joining a visit

1. The visitor will receive a text message and/or email with a unique link
1. Following the link will prompt the visitor to enter their name
1. The visitor confirms the information of the patient with the ward staff
1. The visitor can now communicate face to face through the service with the patient

## Previews

<!-- To update the screenshots, please see the overview slide deck https://docs.google.com/presentation/d/1KaHYSZzcdFJ1oOCZdiPfZCXv9uAEOeE8EvkIjD-mId8/edit -->

| ![Trust Manager can sign up for an account to manage a trust](docs/images/TrustManager_01_SelfSignUp.png) | ![Trust Manager can add new hospitals and wards](docs/images/TrustManager_02_AddNew.png)                         |
| ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| ![Trust Admin can edit and delete hospitals and wards](docs/images/TrustManager_03_ManageExisting.png)    | ![Ward Staff can book a virtual visit via email and/or text message](docs/images/WardStaff_01_BookVisit.png)            | 
| ![Ward Staff can start a virtual visit](docs/images/WardStaff_02_StartVisit.png)                          | ![Key Contact can join a virtual visit](docs/images/KeyContact_01_JoinVisit.png)                        |
| ![Ward Staff can reschedule a virtual visit](docs/images/WardStaff_03_RebookVisit.png)                    |

## Technology

The web application is built using [Next.js](https://nextjs.org/) with
[Microsoft SQL Server](https://www.microsoft.com/sql-server) and hosted on
[Azure](https://azure.microsoft.com/).

To notify visitors via text message and/or email, it uses [GOV.UK
Notify](https://www.notifications.service.gov.uk) which is used widely by
central government, local authorities and the NHS.

To enable video call capabilities, a video provider is used. The following
providers are currently supported:

- [Whereby](https://whereby.com/information/product-api/)

For error monitoring and logging, [DataDog](https://www.datadoghq.com/) and [Sentry](https://sentry.io) is used.

## Contributing

Please take a look at our separate [Contributing Guide](./CONTRIBUTING.md).

## More documentation

- [Runbook](docs/runbook/README.md) - documentation for setting up the service and other tasks.
- [Glossary](docs/GLOSSARY.md) - types of users, vocabulary used in copy and descriptions of the intent for each page.

## Contributors

- **Luke Morton** - CTO at [Made Tech](https://www.madetech.com) (luke@madetech.com)
- **Jessica Nichols** - Delivery Manager at [Made Tech](https://www.madetech.com) (jessica.nichols@madetech.com)
- **Antony O'Neill** - Lead Software Engineer at [Made Tech](https://www.madetech.com) (antony.oneill@madetech.com)
- **Tom Davies** - Senior Software Engineer at [Made Tech](https://www.madetech.com) (tom.davies@madetech.com)
- **Jiv Dhaliwal** - Senior Software Engineer at [Made Tech](https://www.madetech.com) (jiv.dhaliwal@madetech.com)
- **Daniel Burnley** - Senior Software Engineer at [Made Tech](https://www.madetech.com) (dan@madetech.com)
- **Steve Knight** - Senior Software Engineer at [Made Tech](https://www.madetech.com) (steve.knight@madetech.com)
- **George Schena** - Software Engineer at [Made Tech](https://www.madetech.com) (george@madetech.com)
- **Wen Ting Wang** - Software Engineer at [Made Tech](https://www.madetech.com) (wenting@madetech.com)
- **Joshua-Luke Bevan** - Software Engineer at [Made Tech](https://www.madetech.com) (joshua.bevan@madetech.com)
- **Stephen Thomson** - Senior Software Engineer at [Made Tech](https://www.madetech.com) (stephen.thomson@madetech.com)
- **Neil Kidd** - Lead Software Engineer at [Made Tech](https://www.madetech.com) (neil.kidd@madetech.com)
- **Stu Mackellar** - Lead Software Engineer at [Made Tech](https://www.madetech.com) (stu.mackellar@madetech.com)
- **Robert Marshall** - Senior Software Engineer at [Made Tech](https://www.madetech.com) (robert.marshall@madetech.com)
- **Shaun Wild** - Software Engineer at [Made Tech](https://www.madetech.com) (shaun.wild@madetech.com)
- **Pete Craven** - Lead Software Engineer at [Made Tech](https://www.madetech.com) (pete.craven@madetech.com)
- **John Nicholas** - Senior Software Engineer at [Made Tech](https://www.madetech.com) (john.nicholas@madetech.com)
- **Azlina Yeo** -Academy Engineer at [Made Tech](https://www.madetech.com) (azlina.yeo@madetech.com)
- **Richard Pentecost** - Academy Engineer at [Made Tech](https://www.madetech.com) (richard.pentecost@madetech.com)
- **Faissal Bensefia** - Full Stack Engineer at [Made Tech](https://www.madetech.com) (faissal@madetech.com)
- **Miranda Hawkes** - Senior Engineer at [Made Tech](https://www.madetech.com) (miranda.hawkes@madetech.com)
- **Joe Roberts** - Software Engineer at [Made Tech](https://www.madetech.com) (joe.roberts@madetech.com)
- **Paulo Lanção** - Lead Engineer at [Made Tech](https://www.madetech.com) (paulo.lancao@madetech.com)
- **James McDowall** - Delivery Manager at [Made Tech](https://www.madetech.com) (james.mcdowall@madetech.com)
- **Derek Aning** - Junior Delivery Manager at [Made Tech](https://www.madetech.com) (derek.aning@madetech.com)
- **David Watkin** - Lead Software Engineer at [Made Tech](https://www.madetech.com) (david.watkin@madetech.com)

## License

[MIT](LICENSE)
