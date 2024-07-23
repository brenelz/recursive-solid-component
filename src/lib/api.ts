"use server";

import { cache } from "@solidjs/router";
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import path from 'path';
import { fileURLToPath } from 'url';

// https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
const walk = async (dirPath: string): Promise<any[]> => Promise.all(
    await readdir(dirPath, { withFileTypes: true }).then((entries) => entries.map(async (entry) => {
        const childPath = join(dirPath, entry.name)
        return entry.isDirectory() ? { name: entry.name, nodes: await walk(childPath) } : { name: entry.name };
    })),
)

export const getNodes = cache(async () => {
    const directory = path.dirname(fileURLToPath(import.meta.url));
    const dir = path.join(directory, '../filesystem');
    const nodes = await walk(dir);

    return [{
        name: 'Home',
        nodes
    }];
}, 'getNodes');