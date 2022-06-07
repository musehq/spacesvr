// check whether the user is currently typing
export const isTyping = (): boolean =>
  document?.activeElement?.tagName === "INPUT";
