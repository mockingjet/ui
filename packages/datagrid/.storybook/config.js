import { configure, addDecorator, addParameters } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import 'focus-outline-manager';
import '@talend/bootstrap-theme/dist/bootstrap.css';
import { locales as tuiLocales } from '@talend/locales-tui/locales';

const languages = {};
Object.keys(tuiLocales).forEach(key => (languages[key] = key));
addDecorator(withA11y);

addParameters({ layout: 'fullscreen' });

configure([require.context('../src', true, /\.stories\.js$/)], module);
