// ✅
/*
 * @lc app=leetcode.cn id=1 lang=javascript
 *
 * [1] 两数之和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    let hashMap = new Map();
    for(let i = 0;i< nums.length;i++){
        let complement = target - nums[i];
        if(hashMap.has(complement)){
            return [hashMap.get(complement),i];
        }
        hashMap.set(nums[i],i);
    }
};
console.log(twoSum([2,7,11,15],9))
console.log(twoSum([3,2,4],6))
console.log(twoSum([3,3],6))

// @lc code=end

