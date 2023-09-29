import { Newline, Text, useStdin } from 'ink';
import React, { ReactElement, useEffect, useState } from 'react';
import NightSky from './NightSky';
export interface CommandHelpDetails {
  commands: string[];
  options?: string[];
  description: string;
}

const CommandHelp = ({ help }: { help: CommandHelpDetails }): ReactElement => {
  const main = help.commands.slice(0, 1);
  const args = help.commands.slice(1);

  return <Text>
    <Text italic>{help.description}</Text>
    <Newline />
    <Text color='green'>$</Text> aumi <Text color='#f6eb61'>{main}</Text> {args.join(' ')}
    <Text dimColor>{(help.options ?? []).join(' ')}</Text>
  </Text>;
};

const AboutBanner = (
  { help }: { help: CommandHelpDetails[] },
): ReactElement => {
  const [command, setCommand] = useState(0);

  const { setRawMode } = useStdin();

  useEffect(() => {
    setRawMode(true);
    const displayTime = 2500;

    const cycle = setInterval(() => {
      setCommand((previousCommand: number) => {
        if (previousCommand + 1 >= help.length) {
          return 0;
        }
        return previousCommand + 1;
      });
    }, displayTime);

    return () => {
      clearInterval(cycle);
    };
  }, []);

  return <NightSky title='⍺umi. CLI for Sounds Polaris'>
    <CommandHelp help={help[command]} />
  </NightSky>;
};

export default AboutBanner;
