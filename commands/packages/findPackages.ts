import findPackages, { Project as BaseProject } from 'find-packages';
import { basename, dirname, join } from 'path';
import readYamlFile from 'read-yaml-file';

export const WORKSPACE_MANIFEST_FILENAME = 'pnpm-workspace.yaml';

export async function requirePackagesManifest(
  dir: string,
): Promise<{ packages?: string[] } | null> {
  try {
    return await readYamlFile<{ packages?: string[] }>(
      join(dir, WORKSPACE_MANIFEST_FILENAME),
    );
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return null;
    }
    throw err;
  }
}

const removeScope = (name?: string, scope: string = '@companyscope'): string | undefined => {
  if (name?.startsWith(scope + '/') ?? false) {
    return name?.substring(scope.length + 1);
  }

  return name;
};

export interface Project extends BaseProject {
  baseDir?: string; // aumi-cli
  path?: string; // tools/aumi-cli
  group?: string; // tools
  commitScope?: string; // aumi-cli
}

export async function findWorkspacePackages(
  workspaceRoot: string,
  opts: { patterns?: string[]; includeRoot?: boolean } = {},
): Promise<Project[]> {
  let patterns = opts?.patterns;
  if (patterns == null) {
    const packagesManifest = await requirePackagesManifest(workspaceRoot);
    patterns = packagesManifest?.packages ?? undefined;
  }
  const pkgs = await findPackages(workspaceRoot, {
    ignore: [
      '**/node_modules/**',
      '**/bower_components/**',
    ],
    includeRoot: opts?.includeRoot ?? true,
    patterns,
  });

  return pkgs
    .sort((pkg1, pkg2) => pkg1.dir.localeCompare(pkg2.dir))
    .map(pkg => ({
      ...pkg,
      baseDir: basename(pkg.dir),
      path: join(basename(dirname(pkg.dir)), basename(pkg.dir)),
      group: basename(dirname(pkg.dir)),
      commitScope: removeScope(pkg.manifest.name),
    }));
}
