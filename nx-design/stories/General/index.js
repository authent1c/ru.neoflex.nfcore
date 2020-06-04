import React from 'react';
import { storiesOf } from '@storybook/react';

import ButtonPage from './Button';
import IconPage from './Icon';
import InputPage from './Input';

storiesOf('General', module)
  .add('Button', () => <ButtonPage />)
  .add('Icons', () => <IconPage />)
  .add('Input', () => <InputPage />)

