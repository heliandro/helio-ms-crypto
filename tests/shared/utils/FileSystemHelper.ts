import * as FileSystem from 'fs';

export const deleteFolder = (path: string) => {
    FileSystem.rmSync(path, { recursive: true, force: true });
};
