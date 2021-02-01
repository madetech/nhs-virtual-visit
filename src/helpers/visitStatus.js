/*-----------------------------------------------------------------------------------------------+
| This file uses an older method of exporting to maintain compatibility with the cleandb script  |
+-----------------------------------------------------------------------------------------------*/

// Defined the set of statuses that a visit can have (status column in scheduled_calls_table)

const SCHEDULED = "scheduled"; // Default - initial state
const ARCHIVED = "archived"; // The visit's parent ward has been archived
const CANCELLED = "cancelled"; // The visit has been explicitly cancelled
const COMPLETE = "complete"; // The visit has occurred

const statusToId = (status) =>
  ({
    [SCHEDULED]: 0,
    [ARCHIVED]: 1,
    [CANCELLED]: 2,
    [COMPLETE]: 3,
  }[status]);

const idToStatus = (status) =>
  ({
    0: SCHEDULED,
    1: ARCHIVED,
    2: CANCELLED,
    3: COMPLETE,
  }[status]);

module.exports = {
  statusToId,
  idToStatus,
  SCHEDULED,
  ARCHIVED,
  CANCELLED,
  COMPLETE,
};
