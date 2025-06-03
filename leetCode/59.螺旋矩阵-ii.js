/*
 * @lc app=leetcode.cn id=59 lang=javascript
 *
 * [59] 螺旋矩阵 II
 * 给你一个正整数 n ，生成一个包含 1 到 n2 所有元素，且元素按顺时针顺序螺旋排列的 n x n 正方形矩阵 matrix 。
 */

// @lc code=start
/**
 * @param {number} n
 * @return {number[][]}
 */
var generateMatrix = function(n) {
  let left = 0, right = n - 1, top = 0, bottom = n - 1;
  let num = 1;
  let matrix = new Array(n).fill(0).map(() => new Array(n).fill(0));
  while (left <= right && top <= bottom) {
    for (let i = left; i <= right; i++) {
      matrix[top][i] = num++;
    }
    top++;
    for (let i = top; i <= bottom; i++) {
      matrix[i][right] = num++;
    }
    right--;
    for (let i = right; i >= left; i--) {
      matrix[bottom][i] = num++;
    }
    bottom--;
    for (let i = bottom; i >= top; i--) {
      matrix[i][left] = num++;
    }
    left++;
  }
  return matrix;
};
// @lc code=end
console.log(generateMatrix(3)) // [[1,2,3],[8,9,4],[7,6,5]]
console.log(generateMatrix(1)) // [[1]]
