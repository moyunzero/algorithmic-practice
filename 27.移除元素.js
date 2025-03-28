// ✅
/*
 * @lc app=leetcode.cn id=27 lang=javascript
 *
 * [27] 移除元素
 * 给你一个数组 nums 和一个值 val，你需要 原地 移除所有数值等于 val 的元素。元素的顺序可能发生改变。然后返回 nums 中与 val 不同的元素的数量。
 * 假设 nums 中不等于 val 的元素数量为 k，要通过此题，您需要执行以下操作：
    * 更改 nums 数组，使 nums 的前 k 个元素包含不等于 val 的元素。nums 的其余元素和 nums 的大小并不重要。
    * 返回 k。
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function(nums, val) {

    // console.log(nums,val)
    let slow = 0;
    for(let fast = 0;fast<nums.length;fast++){
        if(nums[fast]!==val){
            nums[slow]=nums[fast]
            slow++
        }
    }
    return slow
};

console.log(removeElement([3,2,2,3],3)) // 2, nums = [2,2,_,_]
console.log(removeElement([0,1,2,2,3,0,4,2],2)) // 5, nums = [0,1,4,0,3,_,_,_]
// @lc code=end

