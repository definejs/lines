
const $String = require('@definejs/string');

/**
* 把文本分裂成行的工具。
*/
module.exports = exports = {
    /**
    * 换行符。
    */
    seperator: '\r\n',

    /**
    * 把文本内容分裂成行的数组。
    * 方法可以确保内容是完全按行分裂的。
    * 已重载 split(lines); 传入一个行的数组。
    * 已重载 split(content); 传入一个字符作为内容。
    */
    split(content) {
        //如果传入一个行的数组，先 join 一次再分裂，以确保数组元素中的内容也能得到分裂。
        if (Array.isArray(content)) {
            content = exports.join(content);
        }

        //在某些操作系统下，换行符不一致时会出错，这里统一替换成 `\n`。
        content = content.split('\r\n').join('\n');
        content = content.split('\r').join('\n');

        let lines = content.split('\n');

        return lines;
    },

    /**
    * 
    */
    join(lines) {
        if (!Array.isArray(lines)) {
            return String(lines);
        }

        //过滤掉 null 或 undefined 的项。
        lines = lines.filter(function (line) {
            return !(line == null);
        });

        return lines.join(exports.seperator);
    },


    /**
    * 查找指定字符串在行列表中所在的索引值(行号)。
    * 已重载 getIndex(content, string);
    */
    getIndex(lines, string, startIndex) {
        if (!Array.isArray(lines)) {
            lines = exports.split(lines);
        }

        startIndex = startIndex || 0;

        let len = lines.length;

        for (let i = startIndex; i < len; i++) {
            let item = lines[i];

            if (item.includes(string)) {
                return i;
            }
        }

        ////这样写为了更容易发现 bug，以防万一。
        //throw Error('无法找到所在 index!');

        return -1;
    },

    /**
    * 获取指定字符串在行列表中所在的行的整行内容。
    * 已重载 getLine(content, string);
    */
    getLine(lines, string) {
        if (!Array.isArray(lines)) {
            lines = exports.split(lines);
        }

        let item = lines.find(function (line) {
            return line.includes(string);
        });

        return item || '';
    },

    /**
    * 在所有的行前面填充指定数目的字符串。
    * 默认用空格填充。
    * 已重载 pad(lines, replacer, count);
    * 已重载 pad(content, replacer, count);
    * 已重载 pad(content, count);
    * 已重载 pad(lines, count);
    */
    pad(lines, replacer, count) {
        var isArray = Array.isArray(lines);

        lines = exports.split(lines); //确保是完全按行分裂的。

        //重载 pad(lines, count);
        //重载 pad(content, count);
        if (typeof replacer == 'number') {
            count = replacer;
            replacer = '';
        }

        replacer = replacer || ' ';
        count = count || 0;
        count = count * replacer.length;

        lines = lines.map(function (line) {
            let total = line.length + count;

            line = line.padStart(total, replacer);

            return line;
        });

        return isArray ? lines : exports.join(lines);

    },

    /**
    * 
    */
    stringify(lines, replacer, count) {

        let content = exports.join(lines);

        content = exports.pad(content, replacer, count);

        return content;
    },

    /**
    * 把行数组中指定的片段替换成目标内容，同时保持行数组的长度不变。
    */
    replace(lines, beginIndex, endIndex, target) {
        for (let i = beginIndex; i <= endIndex; i++) {
            lines[i] = null;    //先用 null 占位。
        }

        lines[beginIndex] = target;
    },


    /**
    * 获取最长行的信息。
    * @param {Array|string} lines 内容字符串或对应的分行。
    */
    maxLength(lines) { 
        let max = 0;
        let no = -1;

        lines = exports.split(lines); //确保是完全按行分裂的。

        lines.forEach((line, index) => {
            let len = $String.getByteLength(line);

            if (line.length >= max) {
                max = len;
                no = index;
            }
        });

        return {
            'length': max,
            'index': no,
            'line': lines[no],
        };

    },
    

    



};







