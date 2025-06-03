/*
 * @lc app=leetcode.cn id=707 lang=javascript
 *
 * [707] 设计链表
 * 单链表中的节点应该具备两个属性：val 和 next 。val 是当前节点的值，next 是指向下一个节点的指针/引用。

    如果是双向链表，则还需要属性 prev 以指示链表中的上一个节点。假设链表中的所有节点下标从 0 开始。
    实现 MyLinkedList 类：
    - MyLinkedList() 初始化 MyLinkedList 对象。
    - int get(int index) 获取链表中下标为 index 的节点的值。如果下标无效，则返回 -1 。
    - void addAtHead(int val) 将一个值为 val 的节点插入到链表中第一个元素之前。在插入完成后，新节点会成为链表的第一个节点。
    - void addAtTail(int val) 将一个值为 val 的节点追加到链表中作为链表的最后一个元素。
    - void addAtIndex(int index, int val) 将一个值为 val 的节点插入到链表中下标为 index 的节点之前。如果 index 等于链表的长度，那么该节点会被追加到链表的末尾。如果 index 比长度更大，该节点将 不会插入 到链表中。
    - void deleteAtIndex(int index) 如果下标有效，则删除链表中下标为 index 的节点。
 */

// @lc code=start

class LinkNode {
    constructor(val, next) {
        this.val = val;
        this.next = next;
    }
}

/**
 * Initialize your data structure here.
 * 单链表 储存头尾节点 和 节点数量
 */
var MyLinkedList = function() {
    this._size = 0;
    this._tail = null;
    this._head = null;
};

/**
 * Get the value of the index-th node in the linked list. If the index is invalid, return -1. 
 * @param {number} index
 * @return {number}
 */
MyLinkedList.prototype.getNode = function(index) {
    if(index < 0 || index >= this._size) return null;
    // 创建虚拟头节点
    let cur = new LinkNode(0, this._head);
    // 0 -> head
    while(index-- >= 0) {
        cur = cur.next;
    }
    return cur;
};
MyLinkedList.prototype.get = function(index) {
    if(index < 0 || index >= this._size) return -1;
    // 获取当前节点
    return this.getNode(index).val;
};

/**
 * Add a node of value val before the first element of the linked list. After the insertion, the new node will be the first node of the linked list. 
 * @param {number} val
 * @return {void}
 */
MyLinkedList.prototype.addAtHead = function(val) {
    const node = new LinkNode(val, this._head);
    this._head = node;
    this._size++;
    if(!this._tail) {
        this._tail = node;
    }
};

/**
 * Append a node of value val to the last element of the linked list. 
 * @param {number} val
 * @return {void}
 */
MyLinkedList.prototype.addAtTail = function(val) {
    const node = new LinkNode(val, null);
    this._size++;
    if(this._tail) {
        this._tail.next = node;
        this._tail = node;
        return;
    }
    this._tail = node;
    this._head = node;
};

/**
 * Add a node of value val before the index-th node in the linked list. If index equals to the length of linked list, the node will be appended to the end of linked list. If index is greater than the length, the node will not be inserted. 
 * @param {number} index 
 * @param {number} val
 * @return {void}
 */
MyLinkedList.prototype.addAtIndex = function(index, val) {
    if(index > this._size) return;
    if(index <= 0) {
        this.addAtHead(val);
        return;
    }
    if(index === this._size) {
        this.addAtTail(val);
        return;
    }
    // 获取目标节点的上一个的节点
    const node = this.getNode(index - 1);
    node.next = new LinkNode(val, node.next);
    this._size++;
};

/**
 * Delete the index-th node in the linked list, if the index is valid. 
 * @param {number} index
 * @return {void}
 */
MyLinkedList.prototype.deleteAtIndex = function(index) {
    if(index < 0 || index >= this._size) return;
    if(index === 0) {
        this._head = this._head.next;
        // 如果删除的这个节点同时是尾节点，要处理尾节点
        if(index === this._size - 1){
            this._tail = this._head
        }
        this._size--;
        return;
    }
    // 获取目标节点的上一个的节点
    const node = this.getNode(index - 1);    
    node.next = node.next.next;
    // 处理尾节点
    if(index === this._size - 1) {
        this._tail = node;
    }
    this._size--;
};

// MyLinkedList.prototype.out = function() {
//     let cur = this._head;
//     const res = [];
//     while(cur) {
//         res.push(cur.val);
//         cur = cur.next;
//     }
// };
/**
 * Your MyLinkedList object will be instantiated and called as such:
 * var obj = new MyLinkedList()
 * var param_1 = obj.get(index)
 * obj.addAtHead(val)
 * obj.addAtTail(val)
 * obj.addAtIndex(index,val)
 * obj.deleteAtIndex(index)
 */
/** 
    定义双头节点的结构：同时包含前指针`prev`和后指针next`
*/
class Node {
    constructor(val, prev, next) {
        this.val = val
        this.prev = prev
        this.next = next
    }
}

/**
    双链表：维护 `head` 和 `tail` 两个哨兵节点，这样可以简化对于中间节点的操作  
    并且维护 `size`，使得能够以O(1)时间判断操作是否合法
*/
var MyLinkedList = function () {
    this.tail = new Node(-1)
    this.head = new Node(-1)
    this.tail.prev = this.head
    this.head.next = this.tail
    this.size = 0
};

/** 
 * 获取在index处节点的值
 *
 * @param {number} index
 * @return {number}
 *
 * 时间复杂度: O(n)
 * 空间复杂度: O(1)
 */
MyLinkedList.prototype.get = function (index) {
    // 当索引超出范围时，返回-1
    if (index > this.size) {
        return -1
    }

    let cur = this.head
    for (let i = 0; i <= index; i++) {
        cur = cur.next
    }

    return cur.val
};

/**
 * 在链表头部添加一个新节点
 *
 * @param {number} val
 * @return {void}
 * 
 * 时间复杂度: O(1)
 * 空间复杂度: O(1)
 */
MyLinkedList.prototype.addAtHead = function (val) {
    /** 
       head <-> [newNode] <-> originNode
    */
    this.size++
    const originNode = this.head.next
    // 创建新节点，并建立连接
    const newNode = new Node(val, this.head, originNode)

    // 取消原前后结点的连接
    this.head.next = newNode
    originNode.prev = newNode
};

/** 
 * 在链表尾部添加一个新节点
 *
 * @param {number} val
 * @return {void}
 *
 * 时间复杂度: O(1)
 * 空间复杂度: O(1)
 */
MyLinkedList.prototype.addAtTail = function (val) {
    /** 
        originNode <-> [newNode] <-> tail
    */
    this.size++
    const originNode = this.tail.prev

    // 创建新节点，并建立连接
    const newNode = new Node(val, originNode, this.tail)

    // 取消原前后结点的连接
    this.tail.prev = newNode
    originNode.next = newNode
};

/** 
 * 在指定索引位置前添加一个新节点
 *
 * @param {number} index 
 * @param {number} val
 * @return {void}
 *
 * 时间复杂度: O(n)
 * 空间复杂度: O(1)
 */
MyLinkedList.prototype.addAtIndex = function (index, val) {
    // 当索引超出范围时，直接返回
    if (index > this.size) {
        return
    }
    this.size++

    let cur = this.head
    for (let i = 0; i < index; i++) {
        cur = cur.next
    }

    const new_next = cur.next

    // 创建新节点，并建立连接
    const node = new Node(val, cur, new_next)

    // 取消原前后结点的连接
    cur.next = node
    new_next.prev = node
};

/**
 * 删除指定索引位置的节点
 *
 * @param {number} index
 * @return {void}
 *
 * 时间复杂度: O(n)
 * 空间复杂度: O(1)
 */
MyLinkedList.prototype.deleteAtIndex = function (index) {
    // 当索引超出范围时，直接返回
    if (index >= this.size) {
        return
    }

    this.size--
    let cur = this.head
    for (let i = 0; i < index; i++) {
        cur = cur.next
    }

    const new_next = cur.next.next
    // 取消原前后结点的连接
    new_next.prev = cur
    cur.next = new_next
};