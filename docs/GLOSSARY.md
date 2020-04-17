# Glossary

## Vocabulary

### Ward Nurses (noun)

Users who are caring for **Patients** and helping **Visitors** connect with Patients.

### Visitors (noun)

Users who are joining virtual **visitations** to see and hear from **Patients**.

### Visitations (noun)

**Visitors** and **Ward Nurses** attend virtual visitations by video call. **Visitations** have a scheduled time when they will occur.

### Wards (noun)

Where care is delivered by **Ward Nurses**.

### Patients (noun)

Users being cared for in Wards by **Ward Nurses**.

### Schedule (verb)

Used when scheduling **visitations** for a particular time.

### Ward code (noun)

An alphanumeric string used by **Ward Nurses** to securely access the app.

## Pages

### `/wards/login`

**Ward Nurses** enter their **ward's** **ward code**, after which they're able to view scheduled **visitations** and schedule new ones.

### `/wards/{wardId}/visitations`

**Ward Nurses** view and join upcoming **visitations** for their **ward**.

Visitations are shown for 30 minutes after their scheduled start time - after 30 minutes has elapsed they are hidden from this page.

### `/wards/{wardId}/schedule-visitation`

**Ward Nurses** schedule new **visitations**.

### `/visitations/{visitationId}`

**Patients** and **Visitors** unite and can see and hear one another in their **visitation**.

### `/visitors/waiting-room/{visitationId}`

**Visitors** have their expectations set for what is about to happen and enter their names, for confirmation by the **Ward Nurse** before they hand over the device to the **Patient**.
