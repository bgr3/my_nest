import { error } from 'node:console';
import fs, { existsSync, mkdirSync } from 'node:fs';
import path, { dirname } from 'node:path';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const readTextFileAsync = (relativePath: string): Promise<any> => {
  return new Promise((res, rej) => {
    if (!require.main) throw new error('have no "require.main" at fs-utils.ts');

    const rootDirPath = dirname(require.main.filename);
    const filePath = path.join(rootDirPath, relativePath);

    fs.readFile(filePath, { encoding: 'utf-8' }, (error, content) => {
      if (error) {
        console.error(error);
        rej(error);
      }
      res(content);
    });
  });
};

export const saveFileAsync = (
  relativePath: string,
  data: Buffer,
): Promise<void> => {
  return new Promise<void>(async (res, rej) => {
    if (!require.main) throw new error('have no "require.main" at fs-utils.ts');
    const rootDirPath = dirname(require.main.filename);
    const filePath = path.join(rootDirPath, relativePath);

    fs.writeFile(filePath, data, { encoding: 'utf-8' }, (error) => {
      if (error) {
        console.error(error);
        rej(error);
      }
      res();
    });
  });
};

export const ensureDirSync = async (relativePath: string): Promise<void> => {
  return new Promise<void>((res, rej) => {
    if (!require.main) throw new error('have no "require.main" at fs-utils.ts');

    const rootDirPath = dirname(require.main.filename);
    const dirPath = path.join(rootDirPath, relativePath);

    if (!existsSync(dirPath)) mkdirSync(dirPath, { recursive: true });
    res();
  });
};
