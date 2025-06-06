// ✅
/*
 * @lc app=leetcode.cn id=704 lang=javascript
 *
 * [704] 二分查找
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
    let left = 0;
    let right = nums.length - 1;
    while(left <=right){
        let mid = Math.floor((left+right)/2);
        if(nums[mid] === target){
            return mid
        }else if (nums[mid]<target){
            left = mid + 1;
        }else{
            right = mid -1;
        }
    }
    return -1
};

console.log(search([-1,0,3,5,9,12],9))
console.log(search([-1,0,3,5,9,12],2))
// @lc code=end

