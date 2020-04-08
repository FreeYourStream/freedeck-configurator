export const stringSplice = (val: string, pos: number) => {
  const valArr = val.split("");
  valArr.splice(pos, 0, "|");
  return valArr.join("");
};
