// ✅
/*
 * @lc app=leetcode.cn id=283 lang=javascript
 *
 * [283] 移动零
    * 给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
    * 请注意 ，必须在不复制数组的情况下原地对数组进行操作。
        * 输入: nums = [0,1,0,3,12]
          输出: [1,3,12,0,0]
        * 输入: nums = [0]
          输出: [0]
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function(nums) {
    console.log(nums)
    let slow = 0;
    for(let fast = 0 ;fast<nums.length;fast++){
        if(nums[fast]!== 0 ){
            nums[slow] = nums[fast];
            slow ++
        }
    }
    // 补零阶段
    for(let i = slow; i < nums.length; i++) {
        nums[i] = 0;
    }
    return nums
};
// @lc code=end

console.log(moveZeroes([0,1,0,3,12]))
console.log(moveZeroes([0]))