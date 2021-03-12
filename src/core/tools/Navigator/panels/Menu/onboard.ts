export const hasOnboarded = (): boolean =>
  localStorage.getItem("muse-onboard") === "true";
export const setOnboarded = () => localStorage.setItem("muse-onboard", "true");
