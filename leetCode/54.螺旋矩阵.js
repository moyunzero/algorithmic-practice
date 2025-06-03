/*
 * @lc app=leetcode.cn id=54 lang=javascript
 *
 * [54] 螺旋矩阵
 * 给你一个 m 行 n 列的矩阵 matrix ，请按照 顺时针螺旋顺序 ，返回矩阵中的所有元素。
 */

// @lc code=start
/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var spiralOrder = function(matrix) {
    let res = [];
    let m = matrix.length;
    let n = matrix[0].length;
    let top = 0, bottom = m - 1, left = 0, right = n - 1;
    while(top<=bottom && left <=right){
        for(let i = left;i <= right;i++){
            res.push(matrix[top][i])
        }
        top++;
        for(let i =top;i<=bottom;i++){
            res.push(matrix[i][right])
        }
        right--;
        for(let i=right;i>=left;i--){
            res.push(matrix[bottom][i])
        }
        bottom--;
        for(let i=bottom;i>=top;i--){
            res.push(matrix[i][left])
        }
        left++;
    }
    return res;
};
// @lc code=end
console.log(spiralOrder([[1,2,3],[4,5,6],[7,8,9]])) // [1,2,3,6,9,8,7,4,5]
console.log(spiralOrder([[1,2,3,4],[5,6,7,8],[9,10,11,12]])) // [1,2,3,4,8,12,11,10,9,5,6,7] // [1,2,3,4,8,12,11,10,9,5,6,7]
