import { readdirSync } from 'fs';
import { join } from 'path';
import { findWorkspacePackages } from '../commands/packages/findPackages';
import { Completion } from '../commands';

export const launch: Completion = async (words, current): Promise<string[]> => {
  // current term
  const term = words[current];

  if (term.startsWith('-')) {
    return ['--add'];
  }

  const monorepo = process.env.MONOREPO_ROOT as string;
  const packages = await findWorkspacePackages(monorepo, { includeRoot: false });
  const workspaces = readdirSync(join(monorepo, 'code-workspaces'));

  return packages
    .map(pkg => pkg.commitScope)
    .concat(workspaces)
    .filter((pkg?: string) => {
      return Boolean(pkg?.startsWith(term));
    }) as string[];
};
