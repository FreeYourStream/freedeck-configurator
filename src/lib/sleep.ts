export const sleep = async (ms: number) => {
  return new Promise((res, rej) => {
    setTimeout(() => res(ms), ms);
  });
};
