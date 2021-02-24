export const ACTIVE = "active";
export const DISABLED = "disabled";

export const statusToId = (status) =>
  ({
    [ACTIVE]: 1,
    [DISABLED]: 0,
  }[status]);

export const idToStatus = (id) =>
  ({
    1: ACTIVE,
    0: DISABLED,
  }[id]);
