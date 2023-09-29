import React from 'react';
import AboutBanner, { CommandHelpDetails } from '../components/AboutBanner';
import { CommandDetailsProps } from '../src/CommandDetails';
import { commands } from '../src/config';
import { SubCommand } from '../src/subCommand';

function detailsToHelp(props: CommandDetailsProps): CommandHelpDetails {
  const parts = props.exampleUsage?.split(' ') ?? [];
  const optionsIndex = parts.findIndex(part => part.startsWith('--'));
  const optionsStart = optionsIndex >= 0 ? optionsIndex : parts.length;

  return {
    commands: parts.slice(0, optionsStart),
    options: parts.slice(optionsStart),
    description: props.tagline as string,
  };
}

export const banner: SubCommand = function(_argv, _done) {
  const help: CommandHelpDetails[] = commands
    .filter(({ props }) => props.hidden !== true)
    .filter(({ props }) => Boolean(props.tagline))
    .filter(({ props }) => Boolean(props.exampleUsage))
    .map(({ props }): CommandHelpDetails => detailsToHelp(props));

  return <AboutBanner help={help} />;
};
