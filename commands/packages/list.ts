import { existsSync } from 'fs';
import { join } from 'path';
import { SubCommand } from '../../src/subCommand';
import { findWorkspacePackages, Project } from './findPackages';

const count = <T extends unknown>(
  list: T[],
  condition: (a: T) => boolean = (a) => Boolean(a),
  selector: (a: T) => T = (a) => a,
): number =>
  list
    .map(selector)
    .reduce(
      (count: number, value: T) => (condition(value) ? count + 1 : count),
      0,
    );

const lockFile = (dir: string): string | false => {
  if (existsSync(join(dir, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  if (existsSync(join(dir, 'package-lock.json'))) {
    return 'npm';
  }
  if (existsSync(join(dir, 'yarn.lock'))) {
    return 'yarn';
  }

  return false;
};

export const list: SubCommand = async (_argv, done) => {
  const monorepo = process.env.MONOREPO_ROOT as string;
  const packages = (
    await findWorkspacePackages(monorepo, { includeRoot: false })
  )
    .filter((pkg) => Boolean(pkg.manifest.name))
    .map((pkg) => ({
      ...pkg,
      lock: lockFile(pkg.dir),
    }))
    .map(
      ({
        group,
        lock,
        manifest: { name, version, private: isPrivate, license },
      }: Project & {
        lock: string | false;
        manifest: Project['manifest'] & { license?: string };
      }) => ({
        name,
        group,
        lock,
        version,
        isPrivate: isPrivate ?? false,
        license,
      }),
    );

  console.table(packages);
  console.table([
    {
      'Total Packages': packages.length,
      'Private Packages': count(packages, (pkg) => pkg.isPrivate),
      'Published Packages': count(packages, (pkg) => !pkg.isPrivate),
    },
  ]);

  done();
};
