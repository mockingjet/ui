import React from 'react';
import renderer from 'react-test-renderer';

import ItemTitle from './ItemTitle.component';

jest.mock('react-dom');

const item = {
	id: 1,
	name: 'Hello world',
	created: '2016-09-22',
	modified: '2016-09-22',
	author: 'Jean-Pierre DUPONT',
	icon: 'fa fa-file-excel-o',
	displayMode: 'input',
};

describe('ItemTitle', () => {
	it('should render text title', () => {
		// given
		const props = {
			className: 'my-title',
			item,
			titleProps: {
				key: 'name',
				displayModeKey: undefined, // no display mode in item
				onClick: undefined, // no click callback
			},
		};

		// when
		const wrapper = renderer.create(<ItemTitle {...props} />).toJSON();

		// then
		expect(wrapper).toMatchSnapshot();
	});

	it('should render button title', () => {
		// given
		const props = {
			className: 'my-title',
			item,
			titleProps: {
				key: 'name',
				displayModeKey: undefined, // no display mode in item
				onClick: jest.fn(), // provided click callback
			},
		};

		// when
		const wrapper = renderer.create(<ItemTitle {...props} />).toJSON();

		// then
		expect(wrapper).toMatchSnapshot();
	});

	it('should render input title', () => {
		// given
		const props = {
			className: 'my-title',
			item,
			titleProps: {
				key: 'name',
				displayModeKey: 'displayMode', // item.displayMode is the provided display mode
				onChange: jest.fn(),
				onCancel: jest.fn(),
			},
		};

		// when
		const wrapper = renderer.create(<ItemTitle {...props} />).toJSON();

		// then
		expect(wrapper).toMatchSnapshot();
	});

	it('should render icon', () => {
		// given
		const props = {
			className: 'my-title',
			item,
			titleProps: {
				key: 'name',
				iconKey: 'icon', // item.icon is the icon name
			},
		};

		// when
		const wrapper = renderer.create(<ItemTitle {...props} />).toJSON();

		// then
		expect(wrapper).toMatchSnapshot();
	});
});
