import test from 'ava';
import dummyFs from '../src/dummy-node-fs'

test.beforeEach(t => {
    t.context.fs = dummyFs({
        './path/dst/file.js': '',
        './path/to/other': {},
        './path/to/new/nested/file.js': '',
        './path/to/src/files': {},
    });
});

test('should check path existance', t => {
    const fs = t.context.fs;

    t.is(fs.existsSync('./path/to'), true);
    t.is(fs.existsSync('./path/to/test'), false);
    t.is(fs.existsSync('./path/to/test/other'), false);
    t.is(fs.existsSync('./path/to/test/other/nested'), false);
});

test('should create an empty directory one level down', t => {
    const fs = t.context.fs;

    fs.mkdirSync('./path/to/project');
    fs.mkdirSync('./path/to/new/nested/folder');

    t.is(fs.existsSync('./path/to/project'), true);
    t.is(fs.existsSync('./path/to/new/nested/folder'), true);
});

test('should throw if directory already exists', t => {
    const fs = t.context.fs;

    t.throws(() => fs.mkdirSync('./path'), 'Error: Directory already exit.');
    t.throws(() => fs.mkdirSync('./path/'), 'Error: Directory already exit.');
    t.throws(() => fs.mkdirSync('./path/to'), 'Error: Directory already exit.');
    t.throws(() => fs.mkdirSync('./path/to/other'), 'Error: Directory already exit.');
});

test('should throw if failed to create nested directory', t => {
    const fs = t.context.fs;

    t.throws(() => fs.mkdirSync('./path/into/something'), 'Error: File or directory does not exit.');
    t.throws(() => fs.mkdirSync('./path/into/project'), 'Error: File or directory does not exit.');
    t.notThrows(() => fs.mkdirSync('./module'));
});

test('should update existing file content', t => {
    const fs = t.context.fs;
    const fileContent = 'file content';
    fs.writeFileSync('./path/dst/file.js', fileContent);

    const content = fs.readFileSync('./path/dst/file.js');
    t.is(content, fileContent);
});

test('should throw if tries to create file in missing directory', t => {
    const fs = t.context.fs;
    const fileContent = 'file content';

    const create = () => fs.writeFileSync('./new/path/to/file.js', fileContent);

    t.throws(create, 'Error: File or directory does not exit.');
});

test('should not throw if creates new file in existing directory', t => {
    const fs = t.context.fs;
    const fileContent = 'file content';
    
    const create = () => fs.writeFileSync('./path/to/file.js', fileContent);

    t.notThrows(create);
});

test('should add new file to the file system', t => {
    const fs = t.context.fs;
    const fileContent = 'file content';

    fs.writeFileSync('./path/to/other/file.js', fileContent);

    const content = fs.readFileSync('./path/to/other/file.js');
    t.is(content, fileContent);
});