export const rotate = (matrix: any[][]) => {
  return matrix[0].map((val, index) =>
    matrix.map((row) => row[index]).reverse()
  );
};

export const rotateCCW = (matrix: any[][]) => {
  return matrix[0].map((val, index) =>
    matrix.map((row) => row[row.length - 1 - index])
  );
};

export const flipMatrix = (matrix: any[][]) =>
  matrix[0].map((column, index) => matrix.map((row) => row[index]));
