# Installation
```sh
npm install dummy-node-fs
```

# Usage
```js
const fs = dummyFs({
    './path/dst/file.js': 'test',
    './path/to/other': {},
    './path/to/new/nested/file.js': '',
    './path/to/src/files': {},
});
fs.existsSync('./path/to'); //true
fs.mkdirSync('./path/to/project');
fs.existsSync('./path/to/project'); // true
const content = fs.readFileSync('./path/dst/file.js'); // test
```

# API
Implemented methods:
* existsSync
* mkdirSync
* readFileSync
* writeFileSync

# Note
Feel free to extend this API.
 
# Licence
## MIT