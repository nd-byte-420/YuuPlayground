export const jsonUtils = {
  isStringJson,
}


function isStringJson(str: string): boolean {
  try {
    JSON.parse(str);

    return true;
  }
  catch {
    return false;
  }
}