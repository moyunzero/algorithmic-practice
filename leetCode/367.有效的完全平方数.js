// ✅
/*
 * @lc app=leetcode.cn id=367 lang=javascript
 *
 * [367] 有效的完全平方数
 * 给你一个正整数 num 。如果 num 是一个完全平方数，则返回 true ，否则返回 false 。
 * 完全平方数 是一个可以写成某个整数的平方的整数。换句话说，它可以写成某个整数和自身的乘积。
 * 不能使用任何内置的库函数，如  sqrt 。
 */

// @lc code=start
/**
 * @param {number} num
 * @return {boolean}
 */
var isPerfectSquare = function(num) {
    let left = 1;
    let right = num;
    while(left<=right){
        let mid = Math.floor((left+right)/2);
        if(mid*mid === num){
            return true
        }else if(mid * mid > num){
            right = mid - 1;
        }else{
            left = mid + 1
        }
    }
    return false
};

console.log(isPerfectSquare(16))
console.log(isPerfectSquare(3))
console.log(isPerfectSquare(2))
// @lc code=end

