import { useApp } from 'ink';
import React, { isValidElement, useEffect, useState } from 'react';
import { cli } from '../src/cli';

function CLI(
  { argv }: { argv: string[] },
): React.ReactElement {
  const [component, setComponent] = useState(<></>);

  const { exit } = useApp();

  useEffect(() => {
    const getSubcommand = async (): Promise<void> => {
      try {
        const response = await cli(argv, () => {
          exit();
        });
        if (isValidElement(response)) {
          setComponent(response);
        }
      } catch (error: any) {
        exit(error);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getSubcommand();
  }, []);

  return component;
}

export function getComponent(argv: string[]): React.ReactElement {
  return <CLI argv={argv} />;
}
