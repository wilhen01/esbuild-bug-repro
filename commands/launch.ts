import { commandSync } from 'execa';
import { readdirSync } from 'fs';
import { join } from 'path';
import { parseOptions } from '../src/helpers';
import { SubCommand } from '../src/subCommand';
import { findWorkspacePackages } from './packages/findPackages';

export const launch: SubCommand = async function(searchTerms, done) {
  // get the package by shifting the first two elements away
  searchTerms.shift();
  searchTerms.shift();

  const monorepo = process.env.MONOREPO_ROOT as string;
  const packages = await findWorkspacePackages(monorepo, { includeRoot: false });

  const options = parseOptions(searchTerms);
  const shouldAdd = Boolean(options?.a) || Boolean(options?.add);

  const matchedPackages = searchTerms
    .map((term) => {
      if (term.endsWith('.code-workspace')) {
        const workspaces = readdirSync(join(monorepo, 'code-workspaces'));
        const workspace = workspaces.filter(ws => ws === term).shift();

        if (workspace !== undefined) {
          return join(monorepo, 'code-workspaces', workspace);
        }
      }

      return packages
        .filter((pkg) => [pkg.manifest.name, pkg.commitScope, pkg.baseDir].includes(term))
        .map((pkg) => pkg.dir)
        .shift();
    });

  const paths: string[] = matchedPackages.filter(Boolean) as string[];

  if (paths.length <= 0) {
    console.log('Nothing found with that name. Refusing to launch VSCode.');

    return done();
  }

  const command = `code ${shouldAdd ? '-a' : ''} ${paths.join(' ')}`;
  commandSync(command);

  done();
};
