// Defined the set of statuses that a visit can have (status column in scheduled_calls_table)

export const SCHEDULED = "scheduled"; // Default - initial state
export const ARCHIVED = "archived"; // The visit's parent ward has been archived
export const CANCELLED = "cancelled"; // The visit has been explicitly cancelled
export const ADMIN = "complete"; // The visit has occurred
