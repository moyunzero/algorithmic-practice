/*
 * @lc app=leetcode.cn id=206 lang=javascript
 *
 * [206] 反转链表
 * 给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
    if(!head || !head.next) return head;
    let temp = null, pre = null, cur = head;
    while(cur) {
        temp = cur.next;
        cur.next = pre;
        pre = cur;
        cur = temp;
    }
    // temp = cur = null;
    return pre;
};
var reverse = function(pre, head) {
    if(!head) return pre;
    const temp = head.next;
    head.next = pre;
    pre = head
    return reverse(pre, temp);
}

var reverseList = function(head) {
    return reverse(null, head);
};

// 递归2
var reverse = function(head) {
    if(!head || !head.next) return head;
    // 从后往前翻
    const pre = reverse(head.next);
    head.next = pre.next;
    pre.next = head;
    return head;
}

var reverseList = function(head) {
    let cur = head;
    while(cur && cur.next) {
        cur = cur.next;
    }
    reverse(head);
    return cur;
};
// @lc code=end

console.log(reverseList([1,2,3,4,5])) // [5,4,3,2,1]
console.log(reverseList([1,2])) // [2,1]
console.log([]) // []