export const hasOnboarded = (): boolean =>
  localStorage.getItem("muse-onboard") === "true";
export const setOnboarded = (o?: boolean) =>
  localStorage.setItem("muse-onboard", o === false ? "" : "true");
