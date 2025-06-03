/*
 * @lc app=leetcode.cn id=977 lang=javascript
 *
 * [977] 有序数组的平方
 * 给你一个按 非递减顺序 排序的整数数组 nums，返回 每个数字的平方 组成的新数组，要求也按 非递减顺序 排序。
    * 示例1:
        * 输入：nums = [-4,-1,0,3,10]
        * 输出：[0,1,9,16,100]
        * 解释：平方后，数组变为 [16,1,0,9,100]
        * 排序后，数组变为 [0,1,9,16,100]
    * 示例2:    
        * 输入：nums = [-7,-3,2,3,11]
        * 输出：[4,9,9,49,121]
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortedSquares = function(nums) {
    const n = nums.length;
    const result = new Array(n);
    let left = 0;
    let right = n - 1;
    let pos = n - 1;
    
    while (left <= right) {
        const leftSquare = nums[left] * nums[left];
        const rightSquare = nums[right] * nums[right];
        
        if (leftSquare > rightSquare) {
            result[pos] = leftSquare;
            left++;
        } else {
            result[pos] = rightSquare;
            right--;
        }
        pos--;
    }
    
    return result;
};


console.log(sortedSquares([-4,-1,0,3,10]))
console.log(sortedSquares([-7,-3,2,3,11]))
// @lc code=end



