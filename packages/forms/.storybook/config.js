import React from 'react';
import { configure, addDecorator, addParameters } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import { ThemeProvider } from '@talend/design-system';
import { locales as tuiLocales } from '@talend/locales-tui/locales';
import IconsProvider from '@talend/react-components/lib/IconsProvider';

import '@talend/bootstrap-theme/dist/bootstrap.css';

const languages = {};
Object.keys(tuiLocales).forEach(key => (languages[key] = key));

function withIconsProvider(story) {
	return (
		<>
			<IconsProvider bundles={['https://unpkg.com/@talend/icons/dist/svg-bundle/all.svg']} />
			<React.Suspense fallback={null}>{story()}</React.Suspense>
		</>
	);
}

const withFormLayout = (story, options) => {
	if (options.kind.includes('Layout')) {
		return story();
	}
	return (
		<div className="container-fluid">
			<div
				className="col-md-offset-1 col-md-10"
				style={{ marginTop: '20px', marginBottom: '20px' }}
			>
				{story()}
			</div>
		</div>
	);
};

addParameters({ layout: 'fullscreen' });

addDecorator(withIconsProvider);
addDecorator(withA11y);
addDecorator(withFormLayout);
addDecorator(storyFn => <ThemeProvider>{storyFn()}</ThemeProvider>);
configure(
	[
		require.context('../src', true, /\.stories\.js$/),
		require.context('../stories-core', false, /index\.js$/),
	],
	module,
);
