import { existsSync } from 'fs';
import { join, resolve } from 'path';

function isMonorepoRoot(rootPath: string): boolean {
  return existsSync(join(rootPath, 'package.json')) && existsSync(join(rootPath, '.git'))
    && (existsSync(join(rootPath, 'pnpm-workspace.yaml')));
}

export function getMonorepoRoot(): string {
  const { MONOREPO_ROOT: pathFromEnv } = process.env;
  if (pathFromEnv !== undefined && isMonorepoRoot(pathFromEnv)) {
    return pathFromEnv;
  }

  return resolve(join(__dirname, '..', '..', '..'));
}

export function parseOptions(options: string[]): { [key: string]: string | true } {
  return (' ' + options.join(' '))
    .split(' --').flatMap(o => o.split(' -'))
    .filter(Boolean)
    .map((option) => option.trim())
    .map((option) => option.split(/[= ]/))
    .reduce(
      (options, [optionName, ...optionValue]) => ({
        ...options,
        [optionName]: optionValue.length > 0 ? optionValue.join(' ') : true,
      }),
      {},
    );
}
