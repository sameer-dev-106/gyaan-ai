export const getCleanTitle = (title) => {
  return title?.replace(/^"|"$/g, "") || "Untitled";
};

export const getUserInitial = (username) => {
  return username?.charAt(0)?.toUpperCase() || "S";
};

export const autoResize = (el) => {
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 180) + "px";
};
