export const dec2bin = (dec: number, length = 8) => {
  const result = (dec >>> 0).toString(2).split("");
  while (result.length < length) {
    result.unshift("0");
  }
  return result;
};
