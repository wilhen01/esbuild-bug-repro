import { SubCommand } from '../../src/subCommand';
import { findWorkspacePackages } from './findPackages';

export const find: SubCommand = async (searchTerms, done): Promise<void> => {
  // get search terms by shifting the first two elements away
  searchTerms.shift();
  searchTerms.shift();

  // load packages
  const monorepo = process.env.MONOREPO_ROOT as string;
  const packages = await findWorkspacePackages(monorepo, {
    includeRoot: false,
  });

  const matchedPackages: string[] = searchTerms
    .map((term) => new RegExp(term))
    .flatMap(
      (termExp) =>
        packages
          .filter((pkg) =>
            ([pkg.manifest.name, pkg.path].filter(Boolean) as string[]).some(
              (val: string) => termExp.test(val),
            )
          )
          .map((pkg) => pkg.path)
          .filter(Boolean) as string[],
    );

  const trimmedResults = [...new Set<string>(matchedPackages)];

  // Output results
  trimmedResults.forEach((path) => console.log(path));

  done();
};
