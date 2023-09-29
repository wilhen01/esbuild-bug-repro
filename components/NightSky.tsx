import { Box, Newline, Text } from 'ink';
import Gradient from 'ink-gradient';
import React, { FunctionComponent, PropsWithChildren } from 'react';

// const V = ` .     .  *       .             *
//      |                   *
//  *  -o-       *       .       .       *
//    . |    *
//            .     .  *        *
//        .                .        .
// .  *           *                     *
//                              .
//          *          .   *`;
// const Sky = ` .     .  *       .             *
//      |                   *
//  *  -o-  ⍺umi. CLI for Sounds Polaris
//    . |    *
//            .     .  *        *
//        .                .        .
// .  *           *                     *
//                              .
//          *          .   *`;

const SkyPreTitle = ` .     .  *       .             *
     |                   *
 *  -o-  `;

const SkyPostTitle = `   . |    *                       .
           .     .  *        *`;

const SkyPreContent = `.      *                .        .                
    *     .  *           *                     * `;

const SkyPostContent = '   .     *          .   *                    .    ';

interface NightSkyProps {
  title: string;
}

const NightSky: FunctionComponent<PropsWithChildren<NightSkyProps>> = ({ title, children }): React.ReactElement => {
  const colors = ['#fffdb3', '#fefefe', '#e3e19d'];

  return (
    <Box paddingX={3} paddingY={1}>
      <Text>
        <Gradient colors={colors}>{SkyPreTitle}</Gradient>
        <Text bold underline>
          <Gradient colors={colors}>{title}</Gradient>
        </Text>
        <Newline />
        <Gradient colors={colors}>{SkyPostTitle}</Gradient>
      </Text>
      <Box flexDirection='column' alignItems='center'>
        <Gradient colors={colors.reverse()}>{SkyPreContent}</Gradient>
        <Text>{children}</Text>
        <Gradient colors={colors.reverse()}>{SkyPostContent}</Gradient>
      </Box>
    </Box>
  );
};

export default NightSky;
