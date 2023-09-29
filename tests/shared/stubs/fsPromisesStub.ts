import sinon from 'sinon';
import fsPromises from 'node:fs/promises';

type FileStatOptions = {
    isDirectory?: boolean;
    isFile?: boolean;
};

const stat = (options?: FileStatOptions) => {
    const fileSystemStatOptions: any = {
        isDirectory: () => options?.isDirectory ?? false,
        isFile: () => options?.isFile ?? false
    };
    return sinon.stub(fsPromises, 'stat').resolves(fileSystemStatOptions);
};

const readFile = (data?: string) => {
    return sinon.stub(fsPromises, 'readFile').resolves(data ?? '');
};

const writeFile = () => {
    return sinon.stub(fsPromises, 'writeFile').resolves();
};

const mkdir = () => {
    return sinon.stub(fsPromises, 'mkdir').resolves();
};

export default {
    stat,
    readFile,
    writeFile,
    mkdir
};
