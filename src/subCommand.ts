import React from 'react';
import { CommandLineInput } from './commandParser';

export type SubCommand = (argv: string[], done: () => void) => Promise<any> | React.ReactElement;

function optionListHelper(option: string, value: string | true): string[] {
  const optionList = [`--${option}`];

  if (value !== true) {
    optionList.push(...value.split(' '));
  }

  return optionList;
}

function buildSubCommandArgv({
  execPath,
  jsFile,
  args,
  options,
}: CommandLineInput): string[] {
  return [
    execPath,
    jsFile,
    ...args.slice(1),
    ...Object.entries(options).flatMap((option) => optionListHelper(...option)),
  ];
}

export function pick(useExport?: string): (module: any) => Promise<SubCommand> {
  return async (module: any): Promise<SubCommand> => {
    if (useExport !== undefined) {
      return module[useExport];
    }

    if (typeof module !== 'function') {
      return module.default;
    }

    return module;
  };
}

export async function callSubCommand(
  command: Promise<SubCommand>,
  input: CommandLineInput,
  done: () => void,
): Promise<React.ReactElement | undefined> {
  return await (await command)(buildSubCommandArgv(input), done);
}
