/*
 * @lc app=leetcode.cn id=69 lang=javascript
 *
 * [69] x 的平方根 
 * 给你一个非负整数 x ，计算并返回 x 的 算术平方根 。
 * 由于返回类型是整数，结果只保留 整数部分 ，小数部分将被 舍去 。
 * 注意：不允许使用任何内置指数函数和算符，例如 pow(x, 0.5) 或者 x ** 0.5 。
    * 示例 1：
        * 输入：x = 4
        * 输出：2
    * 示例 2：
        * 输入：x = 8
        * 输出：2
        * 解释：8 的算术平方根是 2.82842..., 由于返回类型是整数，小数部分将被舍去。
 */

// @lc code=start
/**
 * @param {number} x
 * @return {number}
 */
var mySqrt = function(x) {
    // console.log(x)
     // 处理 x 为 0 的情况
     if (x === 0) {
        return 0;
    }
    let left = 1;
    let right = x;
    while(left <= right){
        let mid = Math.floor((left+right)/2);
        if(mid * mid === x){
            return mid
        }else if (mid*mid > x){
            right = mid -1;
        }else{
            left = mid +1;
        }
    }
    return right
};

console.log(mySqrt(4))
console.log(mySqrt(8))
// @lc code=end

