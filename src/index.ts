#! /usr/bin/env node

import { Command } from 'commander';
import figlet from 'figlet';
import { lstat, readdir } from 'fs/promises';
import { resolve } from 'path';

const program = new Command();

console.log(figlet.textSync('TS CLI TEMPLATE', { horizontalLayout: 'full' }));

program
  .version('1.0.0')
  .description('An example CLI for managing a directory')
  .option('-l, --ls  [value]', 'List directory contents')
  .parse(process.argv);

async function listDirContents(filepath: string) {
  try {
    const files = await readdir(filepath);
    const detailedFilesPromises = files.map(async (file: string) => {
      const fileDetails = await lstat(resolve(filepath, file));
      const { size, birthtime } = fileDetails;
      return { filename: file, 'size(KB)': size, created_at: birthtime };
    });
    const detailedFiles = await Promise.all(detailedFilesPromises);
    console.table(detailedFiles);
  } catch (error) {
    console.error('Cannot read directory', error);
  }
}

const options = program.opts();

if (options.ls) {
  const filepath = typeof options.ls === 'string' ? options.ls : __dirname;
  listDirContents(filepath);
}

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
