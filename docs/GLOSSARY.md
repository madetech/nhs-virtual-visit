# Glossary

## Vocabulary

### Ward Staff (noun)

Users who are caring for **Patients** and helping **Visitors** connect with Patients.

### Visitors (noun)

Users who are joining virtual **Visits** to see and hear from **Patients**.

### Visit (noun)

**Visitors** and **Patients** attend virtual visits by video call arranged and facilitated by **Ward Staff**. **Visits** have a scheduled time when they will occur.

### Wards (noun)

Where care is delivered by **Ward Staff**.

### Patients (noun)

Users being cared for in Wards by **Ward Staff**.

### Schedule (verb)

Used when scheduling **Visits** for a particular time.

### Ward code (noun)

An alphanumeric string used by **Ward Staff** to securely access the app.

## Pages

### `/wards/login`

**Ward Staff** enter their **Ward Code**, after which they're able to view scheduled **Visit** and schedule new ones.

### `/wards/{wardId}/visitations`

**Ward Staff** view and join upcoming **Visit** for their **Ward**.

**Visits** are shown for 30 minutes after their scheduled start time - after 30 minutes has elapsed they are hidden from this page.

### `/wards/{wardId}/schedule-visitation`

**Ward Staff** schedule new **Visits**.

### `/visitations/{visitationId}`

**Patients** and **Visitors** unite and can see and hear one another in their **Visit**.

### `/visitors/waiting-room/{visitationId}`

**Visitors** have their expectations set for what is about to happen and enter their names, for confirmation by the **Ward Staff** before they hand over the device to the **Patient**.
