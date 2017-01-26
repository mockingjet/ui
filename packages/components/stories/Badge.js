import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { Badge, IconsProvider } from '../src/';

const style = { maxWidth: '260px' };


storiesOf('Badge', module)
	.addWithInfo('default', () => (
		<section>
			<IconsProvider />
			<div id="default">
				<Badge label="Option 1" tcStyle="outline" />
				<Badge label="Option 2" tcStyle="outline" onDelete={action('remove badge 2')} />
				<Badge label="Option 3" tcStyle="outline" onDelete={action('remove badge 3')} />
				<Badge label="option 4 option 4" />
				<Badge label="option 5" onDelete={action('remove badge 5')} />
			</div>
			<div style={style} id="overflow">
				<Badge label="option 6 option 6 option 6 option 6 option 6" onDelete={action('remove badge 6')} />
				<Badge label="option 7 option 7 option 7 option 7 option 7" />
			</div>
		</section>
	));
