// 元素频率统计
// 编写一个函数，该函数以数组作为输入参数，并返回一个对象。在这个对象中，每个键值对表示数组中一个元素及其对应的出现频率（即该元素在数组中出现的次数）。例如，若输入数组为[1, 2, 2, 3, 3, 3]，则返回的对象应为{1: 1, 2: 2, 3: 3}。请确保你的函数能够正确处理各种类型的数组元素，包括数字、字符串、布尔值、null、undefined等，并且要考虑到数组可能为空的情况。

// 示例 1：
// 输入：[1, 2, 2, 3, 3, 3]
// 输出：{1: 1, 2: 2, 3: 3}

// 示例 2：
// 输入：['a', 'b', 'a', 'c', 'b', 'a']
// 输出：{'a': 3, 'b': 2, 'c': 1}

// 示例 3：
// 输入：[true, false, true, true]
// 输出：{true: 3, false: 1}

// 示例 4：
// 输入：[]
// 输出：{}

// 示例 5：
// 输入[：5]
// 输出：{5: 1}

// 示例 6：
// 输入：[null, null, undefined, undefined]
// 输出：{null: 2, undefined: 2}

// 示例 7：
// 输入：[{}, {}, []]
// 输出：{"[object Object]": 2, "[]": 1}


function frequencyCount(nums){
    if (!Array.isArray(nums)) {
        throw new Error('Input must be an array');
    }
    // nums.reduce((acc,cur)=>{
    //     if(!result[cur]){
    //         result[cur] = 1;
    //     }else{
    //         result[cur]++
    //     }
    // },{})
    // return result
    return nums.reduce((acc, cur) => {
        acc[cur] = (acc[cur] || 0) + 1;
        console.log(acc)
        return acc;
    }, {});
}


console.log(frequencyCount([1, 2, 2, 3, 3, 3]))
console.log(frequencyCount(['a', 'b', 'a', 'c', 'b', 'a']))
console.log(frequencyCount([true, false, true, true]))
console.log(frequencyCount([]))
console.log(frequencyCount([null, null, undefined, undefined]))
console.log(frequencyCount([{}, {}, []]))
