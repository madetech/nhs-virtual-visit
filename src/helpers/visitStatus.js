// Defined the set of statuses that a visit can have (status column in scheduled_calls_table)

const SCHEDULED = "scheduled"; // Default - initial state
const ARCHIVED = "archived"; // The visit's parent ward has been archived
const CANCELLED = "cancelled"; // The visit has been explicitly cancelled
const COMPLETE = "complete"; // The visit has occurred

module.exports = {
  SCHEDULED,
  ARCHIVED,
  CANCELLED,
  COMPLETE,
};
