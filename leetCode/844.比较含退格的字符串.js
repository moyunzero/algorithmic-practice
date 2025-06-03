// ✅
/*
 * @lc app=leetcode.cn id=844 lang=javascript
 *
 * [844] 比较含退格的字符串
 * 给定 s 和 t 两个字符串，当它们分别被输入到空白的文本编辑器后，如果两者相等，返回 true 。# 代表退格字符。
 * 注意：如果对空文本输入退格字符，文本继续为空。
 * 示例
    * 输入：s = "ab#c", t = "ad#c"
    * 输出：true
    * 解释：s 和 t 都会变成 "ac"。
 * 示例
    * 输入：s = "ab##", t = "c#d#"
    * 输出：true
    * 解释：s 和 t 都会变成 ""。
 * 示例
    * 输入：s = "a#c", t = "b"
    * 输出：false
    * 解释：s 会变成 "c"，但 t 仍然是 "b"。 
 */

// @lc code=start
/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var backspaceCompare = function(s, t) {
    let i = s.length - 1,
    j = t.length - 1,
    skipS = 0,
    skipT = 0;
    // 大循环
    while(i >= 0 || j >= 0){
        // S 循环
        while(i >= 0){
            if(s[i] === '#'){
                skipS++;
                i--;
            }else if(skipS > 0){
                skipS--;
                i--;
            }else break;
        }
        // T 循环
        while(j >= 0){
            if(t[j] === '#'){
                skipT++;
                j--;
            }else if(skipT > 0){
                skipT--;
                j--;
            }else break;
        }
        if(s[i] !== t[j]) return false;
        i--;
        j--;
    }
    return true;
};
// @lc code=end

console.log(backspaceCompare("ab#c", "ad#c"))
console.log(backspaceCompare("ab##", "c#d#"))
console.log(backspaceCompare("a#c", "b"))



