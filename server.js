const fs = require('fs');

function processArgs() {
    process.argv.forEach((value, index) => {
        if(value.indexOf('=') > -1) {
            let arr = value.split('=');
            let key = arr[0];
            let val = arr[1];

            switch(key) {
                case "file":
                    setFile(val);
                    break;
                case "chars":
                    setChars(val);
                    break;
                default:
                    break;
            }
        }
    })
}

function setFile(path) {
    process.env.FILE = path;
}

function setChars(chars) {
    process.env.CHARS = chars;
}

function replaceString(obj, modText) {
    if(typeof(obj) === 'object') {
        Object.keys(obj).forEach(key => {
            if(typeof(obj[key]) === 'object') {
                obj[key] = replaceString(obj[key], modText);
            } else {
                obj[key] = modText + obj[key] + modText;
            }
        })
        return obj;
    } else {
        return modText + obj + modText;
    }
}

function performTest() {
    processArgs();
    if(process.env.FILE && process.env.CHARS) {
        fs.readFile(process.env.FILE, 'utf-8', (err, data) => {
            if(err) {
                throw err;
            }
            let result = replaceString(JSON.parse(data), process.env.CHARS);

            fs.writeFile(process.env.FILE, JSON.stringify(result), 'utf-8', (err) => {
                if(err) {
                    throw err;
                }
                console.log(process.env.FILE + 'has been updated');
            });
        });
    } else {
        console.log('please pass in a FILE and CHARS argument');
    }
}

performTest();
