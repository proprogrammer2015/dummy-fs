import { getCommonPathIndex } from 'corresponding-path';

const NOT_FOUND = 'Error: File or directory does not exit.';
const EXISTS = 'Error: Directory already exit.';
const ONE_FOLDER_LEVEL = 1;
const EMPTY_DIRECTORY = {};

const find = (path, files) => {
    const found = Object.keys(files).find((key) => key === path);
    if (!!found) {
        return {
            path: found,
            value: files[found]
        };
    }
    return {
        path: null,
        value: null
    };
}

const pathExists = (path, files) => {
    const dst = path.split('/');
    return Object.keys(files)
        .map(filePath => filePath.split('/'))
        .map(fileSystemPath => getCommonPathIndex(fileSystemPath, dst))
        .some(index => dst.length - 1 === index);
}

const getValueOrThrow = ({ value }) => {
    if (value) {
        return value;
    }
    throw new Error(NOT_FOUND);
}

export const writeFileSync = ({ path, value }, files) => {
    if (files[path] !== void 0) {
        files[path] = value;
        return void 0;
    }
    
    if (files[path] === void 0) {
        const dstPath = path.split('/').filter(isEmpty => isEmpty);
        const dst = dstPath.slice(0, -1);
        const nestedLevels = Object.keys(files)
            .map(filePath => filePath.split('/'))
            .map(fileSystemPath => getCommonPathIndex(fileSystemPath, dst))
            .map(index => dst.length - 1- index);

            // isExistingDirectory
            if (nestedLevels.some(level => level < ONE_FOLDER_LEVEL)) {
                files[path] = value;
                return void 0;
            }
    }

    throw new Error(NOT_FOUND);
}

const dummyFs = (files) => {
    let _files = { ...files };

    return {
        existsSync: (path) => pathExists(path, _files),
        readFileSync: (path) => getValueOrThrow(find(path, _files)),
        writeFileSync: (path, value) => writeFileSync({ path, value }, _files),
        mkdirSync: (path, options) => {
            const dst = path.split('/').filter(isEmpty => isEmpty);
            const nestedLevels = Object.keys(_files)
                .map(filePath => filePath.split('/'))
                .map(fileSystemPath => getCommonPathIndex(fileSystemPath, dst))
                .map(index => dst.length - 1 - index);

            // isExistingDirectory
            if (nestedLevels.some(level => level < ONE_FOLDER_LEVEL)) {
                throw new Error(EXISTS);
            }

            // isNewDirectory
            if (nestedLevels.some(level => level === ONE_FOLDER_LEVEL)) {
                _files[path] = EMPTY_DIRECTORY;
                return void 0;
            }

            throw new Error(NOT_FOUND);
        }
    };
}

export default dummyFs;