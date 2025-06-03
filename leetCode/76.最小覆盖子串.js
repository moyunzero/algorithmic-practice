/*
 * @lc app=leetcode.cn id=76 lang=javascript
 *
 * [76] 最小覆盖子串
 * 给你一个字符串 s 、一个字符串 t 。返回 s 中涵盖 t 所有字符的最小子串。如果 s 中不存在涵盖 t 所有字符的子串，则返回空字符串 "" 。

 注意：
 对于 t 中重复字符，我们寻找的子字符串中该字符数量必须不少于 t 中该字符数量。
 如果 s 中存在这样的子串，我们保证它是唯一的答案。
 */

// @lc code=start
/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
var minWindow = function(s, t) {
    // 若 s 的长度小于 t 的长度，直接返回空字符串
    if (s.length < t.length) return "";

    // 统计 t 中每个字符的出现频率
    const target = new Map();
    for (let char of t) {
        target.set(char, (target.get(char) || 0) + 1);
    }
    // t 中不同字符的种类数
    const required = target.size;

    // 初始化左右指针
    let left = 0, right = 0;
    // 当前窗口中每个字符的出现频率
    const window = new Map();
    // 当前窗口中已经满足条件的字符种类数
    let formed = 0;
    // 最小子串的长度和起始位置
    let minLen = Infinity, start = 0;

    while (right < s.length) {
        // 获取当前右指针指向的字符
        let char = s[right];
        // 只处理 t 中存在的字符
        if (target.has(char)) {
            window.set(char, (window.get(char) || 0) + 1);
            // 检查该字符的频率是否达到了 t 中该字符的频率
            if (window.get(char) === target.get(char)) {
                formed++;
            }
        }

        // 当窗口满足条件时，尝试移动左指针缩小窗口
        while (left <= right && formed === required) {
            char = s[left];

            // 更新最小子串的长度和起始位置
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                start = left;
            }

            // 只处理 t 中存在的字符
            if (target.has(char)) {
                window.set(char, window.get(char) - 1);
                if (window.get(char) < target.get(char)) {
                    formed--;
                }
            }
            left++;
        }

        // 移动右指针，扩大窗口
        right++;
    }

    return minLen === Infinity ? "" : s.substring(start, start + minLen);
};
// @lc code=end

console.log(minWindow("ADOBECODEBANC", "ABC")) // "BANC"
console.log(minWindow("a", "a"))    // "a"
console.log(minWindow("a", "aa"))   // ""
