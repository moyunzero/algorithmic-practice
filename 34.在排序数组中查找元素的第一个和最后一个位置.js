// ✅
/*
 * @lc app=leetcode.cn id=34 lang=javascript
 *
 * [34] 在排序数组中查找元素的第一个和最后一个位置
 * 给你一个按照非递减顺序排列的整数数组 nums，和一个目标值 target。请你 找出给定目标值在数组中的开始位置和结束位置。
*  如果数组中不存在目标值 target，返回 [-1, -1]。
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function(nums, target) {
   // 查找目标值的起始位置
   function findLeft(nums, target) {
       let left = 0;
       let right = nums.length - 1; 
       let result = -1;
       while (left <= right) {
           let mid = Math.floor((left + right) / 2); 
           if (nums[mid] >= target) {
               right = mid - 1; 
               if (nums[mid] === target) {
                   result = mid;
               }
           } else {
               left = mid + 1;
           }
       }
       return result;
   }

   // 查找目标值的结束位置
   function findRight(nums, target) {
       let left = 0;
       let right = nums.length - 1;
       let result = -1;
       while (left <= right) {
           let mid = Math.floor((left + right) / 2);
           if (nums[mid] <= target) {
               left = mid + 1;
               if (nums[mid] === target) {
                   result = mid;
               }
           } else {
               right = mid - 1;
           }
       }
       return result;
   }

   return [findLeft(nums, target), findRight(nums, target)];
};


console.log(searchRange([5,7,7,8,8,10],8)) //[3,4]
console.log(searchRange([5,7,7,8,8,10],6)) // [-1,-1]
console.log(searchRange([],0)) //[-1,-1]
// @lc code=end

