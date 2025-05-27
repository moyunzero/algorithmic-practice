/*
 * @lc app=leetcode.cn id=58 lang=javascript
 *
 * [58] 最后一个单词的长度
 * 给你一个字符串 s，由若干单词组成，单词前后用一些空格字符隔开。返回字符串中 最后一个 单词的长度。

单词 是指仅由字母组成、不包含任何空格字符的最大子字符串。
 */

// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLastWord = function(s) {
    let sNums = s.trim().split(' ');
    return sNums[sNums.length - 1].length;
};
// @lc code=end

console.log(lengthOfLastWord("Hello World"))    // 5
console.log(lengthOfLastWord("   fly me   to   the moon  "))    // 4
console.log(lengthOfLastWord("luffy is still joyboy"))    // 6