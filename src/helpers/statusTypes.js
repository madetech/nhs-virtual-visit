export const ACTIVE = "active";
export const DISABLED = "disabled";

export const statusToId = (status) =>
  ({
    [ACTIVE]: 1,
    [DISABLED]: 0,
  }[status]);

export const idToStatus = (id) =>
  ({
    0: ACTIVE,
    1: DISABLED,
  }[id]);
