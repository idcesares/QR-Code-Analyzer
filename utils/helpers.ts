
export const isUrl = (text: string): boolean => {
  try {
    new URL(text);
    return true;
  } catch (_) {
    return false;
  }
};
