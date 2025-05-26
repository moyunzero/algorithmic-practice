/*
 * @lc app=leetcode.cn id=904 lang=javascript
 *
 * [904] 水果成篮
 * 你正在探访一家农场，农场从左到右种植了一排果树。这些树用一个整数数组 fruits 表示，其中 fruits[i] 是第 i 棵树上的水果 种类 。
 * 你想要尽可能多地收集水果。然而，农场的主人设定了一些严格的规矩，你必须按照要求采摘水果：
    *  你只有 两个 篮子，并且每个篮子只能装 单一类型 的水果。每个篮子能够装的水果总量没有限制。
    * 你可以选择任意一棵树开始采摘，你必须从 每棵 树（包括开始采摘的树）上 恰好摘一个水果 。采摘的水果应当符合篮子中的水果类型。每采摘一次，你将会向右移动到下一棵树，并继续采摘。
    * 一旦你走到某棵树前，但水果不符合篮子的水果类型，那么就必须停止采摘。
 * 给你一个整数数组 fruits ，返回你可以收集的水果的 最大 数目。
 */

// @lc code=start
/**
 * @param {number[]} fruits
 * @return {number}
 */
var totalFruit = function(fruits) {
    // 处理边界情况，数组长度小于等于 2 时直接返回数组长度
    if (fruits.length <= 2) return fruits.length;
    
    let left = 0;
    let maxCount = 0;
    // 使用 Map 来记录每种水果的数量
    const fruitMap = new Map();

    for (let right = 0; right < fruits.length; right++) {
        const fruit = fruits[right];
        // 如果 Map 中不存在该水果，初始化为 0
        fruitMap.set(fruit, (fruitMap.get(fruit) || 0) + 1);

        // 当窗口内水果种类超过 2 种时，移动左边界缩小窗口
        while (fruitMap.size > 2) {
            const leftFruit = fruits[left];
            // 左边界对应的水果数量减 1
            fruitMap.set(leftFruit, fruitMap.get(leftFruit) - 1);
            // 如果数量减到 0，从 Map 中删除该水果
            if (fruitMap.get(leftFruit) === 0) {
                fruitMap.delete(leftFruit);
            }
            // 左边界右移
            left++;
        }

        // 更新最大数量
        maxCount = Math.max(maxCount, right - left + 1);
    }

    return maxCount;
};
// @lc code=end

console.log(totalFruit([1,2,1])); // 3
console.log(totalFruit([0,1,2,2])); // 3
console.log(totalFruit([1,2,3,2,2])); // 4
console.log(totalFruit([3,3,3,1,2,1,1,2,3,3,4])); // 5



//滑动窗口问题概述
//滑动窗口是一种在数组或字符串上高效处理连续子数组或子串问题的算法技巧。它通过维护一个可以动态调整左右边界的窗口，在遍历过程中不断更新窗口内的信息，从而在不重复计算的情况下解决问题，能将时间复杂度从暴力解法的 $O(n^2)$ 或 $O(n^3)$ 降低到 $O(n)$。

//适用场景
//以下几种情况通常适合使用滑动窗口算法：

//连续子数组/子串问题：当问题要求在数组或字符串中找到满足特定条件的连续子数组或子串时，滑动窗口是一个不错的选择。例如在「水果成篮」问题中，需要找到包含最多两种不同元素的最长连续子数组。
//固定长度或可变长度窗口：问题既可以是求固定长度的子数组/子串的相关信息，也可以是求满足条件的可变长度子数组/子串的最大或最小长度等。像求数组中长度为 k 的子数组的最大和，这是固定长度窗口问题；而求字符串中无重复字符的最长子串，则是可变长度窗口问题。
//优化暴力解法：如果问题的暴力解法需要嵌套循环来枚举所有可能的子数组或子串，且存在大量重复计算，那么可以考虑使用滑动窗口算法进行优化