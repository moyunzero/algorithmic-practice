// 实现使用重复字符计数的字符串压缩函数。对于字符序列，如果字符重复，则应将其压缩为 character+count 格式。例如，字符串 “aabcccccaaa” 应变为 “a2b1c5a3”。如果压缩字符串不小于原始字符串，则返回原始字符串。


function stringCompression(val){
    let compressed = '';
    let count = 1;
    for(let i =0 ;i<val.length;i++){
        if(i+1 < val.length && val[i] === val[i+1]){
            count++;
        }else{
            compressed += val[i]+count
            count = 1
        }
    }
    return compressed.length < val.length ? compressed : val;
}


console.log(stringCompression('aabcccccaaa'))
console.log(stringCompression('abcdef')); 
