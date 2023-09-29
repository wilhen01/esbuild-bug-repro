interface SimpleMap<ValueType> {
  [key: string]: ValueType;
}

interface OptionsMap extends SimpleMap<string | true> {
  [key: string]: string | true;
}

export interface CommandLineInput {
  execPath: string;
  jsFile: string;
  args: string[];
  namedArgs: SimpleMap<string>;
  options: OptionsMap;
}

function parseArgs(args: string[]): string[] {
  return args
    .join(' ')
    .split('--', 1)
    .flatMap((arg) => arg.split(' '))
    .filter(Boolean);
}

function parseOptions(options: string[]): OptionsMap {
  return options
    .join(' ')
    .split('--')
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

export function parseFromCommandLine(
  argv: string[],
  argNames: string[] = [],
): CommandLineInput {
  const [execPath, jsFile] = argv;
  const args = parseArgs(argv.slice(2));
  const namedArgs = Object.fromEntries(
    args
      .map((arg, index) => [argNames[index], arg])
      .filter(([name]) => Boolean(name)),
  );
  const options = parseOptions(argv.slice(2 + args.length));

  return {
    execPath,
    jsFile,
    args,
    namedArgs,
    options,
  };
}
