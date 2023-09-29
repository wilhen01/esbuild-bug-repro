import { appendFileSync, PathLike, readFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { Options } from './completer';

enum SUPPORTED_SHELL {
  BASH = 'bash',
  ZSH = 'zsh',
}

const shellSetupScripts = {
  [SUPPORTED_SHELL.BASH]: setupBashCompatibleRCFile(join(homedir(), '.bashrc')),
  [SUPPORTED_SHELL.ZSH]: setupZshCompatibleRCFile(join(homedir(), '.zshrc')),
};

function fileContains(file: PathLike, data: string): boolean {
  const contents = readFileSync(file);
  return contents.includes(data);
}

function setupBashCompatibleRCFile(file: PathLike): (binary: string, force: boolean) => void {
  return (binary: string, force: boolean) => {
    const command = `complete -C '${binary} completion' ${binary}`;

    if (fileContains(file, command) && !force) {
      console.log("✔︎ Looks like it's already setup. Skipping. Use '--force' to override.");
      return;
    }
    appendFileSync(file, `\n# Aumi CLI completions\n${command}\n`);
    console.log('✔︎ Done. Reload shell to activate.');
  };
}

function setupZshCompatibleRCFile(file: PathLike): (binary: string, force: boolean) => void {
  return (binary: string, force: boolean) => {
    const command = `autoload -U +X bashcompinit && bashcompinit && complete -C '${binary} completion' ${binary}`;

    if (fileContains(file, command) && !force) {
      console.log("✔︎ Looks like it's already setup. Skipping. Use '--force' to override.");
      return;
    }
    appendFileSync(file, `\n# Aumi CLI completions\n${command}\n`);
    console.log('✔︎ Done. Reload shell to activate.');
  };
}

function setupShell(shell: SUPPORTED_SHELL, binary: string, force: boolean): void {
  shellSetupScripts[shell](binary, force);
}

function detectShell(): string | undefined {
  return process.env.SHELL?.split('/').pop();
}

function getShell(shell: string | true): SUPPORTED_SHELL {
  const confirmedShell = shell === true ? detectShell() : shell;

  if (confirmedShell === undefined) {
    throw Error(
      'Unable to auto-detect shell. Please provide shell as option or consult README for manual setup instructions.',
    );
  }

  if (!Object.values(SUPPORTED_SHELL).includes(confirmedShell as SUPPORTED_SHELL)) {
    throw Error(`'${confirmedShell}' is not a supported shell. Please consult README for manual setup instructions.`);
  }

  return confirmedShell as SUPPORTED_SHELL;
}

export function installCompletions({ install, force }: Options, done: () => void, binary: string = 'aumi'): void {
  try {
    const shell = getShell(install);

    console.log(`Installing Aumi CLI completions for '${shell}'...`);
    setupShell(shell, binary, Boolean(force));
  } catch (error: any) {
    console.log(`Error: ${error.message as string}`);
  }

  done();
}
