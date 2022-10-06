/**
 * helper function to detect when text needs to be synced based on arbitrary values
 *
 * @param text
 * @param property
 * @param val
 */
export const syncOnChange = (text: any, property: string, val: any) => {
  if (text._needsSync) return;
  if (!text.userData) text.userData = {};
  if (text.userData[property] !== val) {
    text.userData[property] = val;
    text._needsSync = true;
  }
};
