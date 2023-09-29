import { findWorkspacePackages } from '../commands/packages/findPackages';
import { Completion } from '../commands';

export const find: Completion = async (words, current): Promise<string[]> => {
  // current term
  const term = words[current];

  const monorepo = process.env.MONOREPO_ROOT as string;
  const packages = await findWorkspacePackages(monorepo, { includeRoot: false });

  return packages
    .map(pkg => pkg.commitScope)
    .filter((pkg?: string) => {
      return Boolean(pkg?.startsWith(term));
    }) as string[];
};
