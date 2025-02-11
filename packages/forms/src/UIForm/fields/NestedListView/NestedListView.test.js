import { shallow } from 'enzyme';
import keycode from 'keycode';
import React from 'react';
import ReactDOM from 'react-dom';
import { NestedListViewWidget } from './NestedListView.component';
import { getDisplayedItems, prepareItemsFromSchema } from './NestedListView.utils';

jest.useFakeTimers();

describe('NestedListView component', () => {
	let props;

	beforeEach(() => {
		props = {
			id: 'NestedListView',
			onChange: jest.fn(),
			onFinish: jest.fn(),
			schema: {
				title: 'Nested ListView',
				schema: {
					properties: {
						bar: {
							items: {
								type: 'string',
								enum: ['bar_1', 'bar_2'],
								enumNames: ['Bar 1', 'Bar 2'],
							},
						},
						foo: {
							items: {
								type: 'string',
								enum: ['foo_1', 'foo_2'],
								enumNames: ['Foo 1', 'Foo 2'],
							},
						},
					},
				},
				items: [
					{
						key: ['bar'],
						title: 'Bar',
						titleMap: [
							{ name: 'Bar 1', value: 'bar_1' },
							{ name: 'Bar 2', value: 'bar_2' },
						],
					},
					{
						key: ['foo'],
						title: 'Foo',
						titleMap: [
							{ name: 'Foo 1', value: 'foo_1' },
							{ name: 'Foo 2', value: 'foo_2' },
						],
					},
				],
				value: {},
				t: jest.fn(),
			},
			value: {},
		};
	});

	it('should render component', () => {
		// when
		const wrapper = shallow(<NestedListViewWidget {...props} />);

		// then
		expect(wrapper.getElement()).toMatchSnapshot();
	});

	describe('componentDidUpdate', () => {
		it('should update items on props.value change', () => {
			// given
			const node = document.createElement('div');
			// eslint-disable-next-line react/no-render-return-value
			const instance = ReactDOM.render(<NestedListViewWidget {...props} value={{}} />, node);
			const previousItems = instance.state.displayedItems;
			expect(previousItems.length).toBe(2);
			previousItems.forEach(({ checked, children }) => {
				expect(checked).toBe(false);
				children.forEach(childrenItem => expect(childrenItem.checked).toBe(false));
			});

			// when : trigger a props update
			const allValues = props.schema.items.reduce((acc, item) => {
				acc[item.key] = item.titleMap.map(titleMapItem => titleMapItem.value);
				return acc;
			}, {});
			ReactDOM.render(<NestedListViewWidget {...props} value={allValues} />, node);

			// then
			const nextItems = instance.state.displayedItems;
			expect(nextItems.length).toBe(2);
			nextItems.forEach(({ checked, children }) => {
				expect(checked).toBe(true);
				children.forEach(childrenItem => expect(childrenItem.checked).toBe(true));
			});
		});
	});

	describe('onExpandToggle', () => {
		it('should expand the right children', () => {
			// given
			const event = {};
			const item = { key: 'foo' };

			// when
			const wrapper = shallow(<NestedListViewWidget {...props} />);
			wrapper.instance().onExpandToggle(event, item);

			// then
			const { displayedItems } = wrapper.state();
			expect(displayedItems[0].expanded).toBe(false);
			expect(displayedItems[1].expanded).toBe(true);
		});

		it('should collapse an already expanded section', () => {
			// given
			const event = {};
			const item = { key: 'foo' };

			// when
			const wrapper = shallow(<NestedListViewWidget {...props} />);
			const beforeState = wrapper.state();
			beforeState.displayedItems[1].expanded = true;
			wrapper.instance().items[1].expanded = true;
			wrapper.setState(beforeState);
			wrapper.instance().onExpandToggle(event, item);

			// then
			const { displayedItems } = wrapper.state();
			expect(displayedItems[0].expanded).toBe(false);
			expect(displayedItems[1].expanded).toBe(false);
		});
	});

	describe('onParentChange', () => {
		it('should select all children when parent is selected and no child is selected', () => {
			// given
			const event = {};
			const item = { key: 'foo' };

			// when
			const wrapper = shallow(<NestedListViewWidget {...props} />);
			wrapper.instance().onParentChange(event, item);

			// then
			const { value } = wrapper.instance();
			expect(value.foo).toEqual(['foo_1', 'foo_2']);
		});

		it('should unselect all children when parent is selected and at least a child is already selected', () => {
			// given
			const event = {};
			const item = { key: 'foo' };

			// when
			const wrapper = shallow(<NestedListViewWidget {...props} />);
			wrapper.instance().value = { foo: ['foo_2'] };
			wrapper.instance().onParentChange(event, item);

			// then
			const { value } = wrapper.instance();
			expect(value.foo).toEqual([]);
		});
	});

	describe('onChange', () => {
		it('should call both onChange and onFinish props', () => {
			// given
			const event = {};
			const value = { bar: ['baz'] };

			// when
			const wrapper = shallow(<NestedListViewWidget {...props} />);
			wrapper.instance().value = value;
			wrapper.instance().onChange(event);

			// then
			expect(props.onChange).toHaveBeenCalledWith(event, {
				schema: props.schema,
				value,
			});

			expect(props.onFinish).toHaveBeenCalledWith(event, {
				schema: props.schema,
				value,
			});
		});
	});

	describe('onCheck', () => {
		it('should add a value', () => {
			// given
			const event = {};
			const checked = { value: 'Bar_2' };
			const parent = { key: 'bar' };

			// when
			const wrapper = shallow(<NestedListViewWidget {...props} />);
			wrapper.instance().onCheck(event, checked, parent);

			// then
			const { value } = wrapper.instance();
			expect(value).toEqual({ bar: ['Bar_2'] });
		});

		it('should remove a value', () => {
			// given
			const event = {};
			const checked = { value: 'Bar_2' };
			const parent = { key: 'bar' };
			props.value = { bar: ['Bar_1', 'Bar_2'] };

			// when
			const wrapper = shallow(<NestedListViewWidget {...props} />);
			wrapper.instance().onCheck(event, checked, parent);

			// then
			const { value } = wrapper.instance();
			expect(value).toEqual({ bar: ['Bar_1'] });
		});
	});

	describe('onInputChange', () => {
		it('should debounced-refresh items props', () => {
			// given
			const event = {};
			const item = { value: 'foo' };

			// when
			const wrapper = shallow(<NestedListViewWidget {...props} />);
			wrapper.instance().onInputChange(event, item);
			jest.runAllTimers();

			// then
			expect(setTimeout).toHaveBeenCalled();
			expect(wrapper.state('searchCriteria')).toEqual('foo');
		});
	});

	describe('onInputKeyDown', () => {
		const event = { preventDefault: jest.fn() };

		beforeEach(() => {
			event.preventDefault.mockReset();
		});

		it('should manage enter key pressed', () => {
			// when
			const wrapper = shallow(<NestedListViewWidget {...props} />);
			event.keyCode = keycode('enter');
			wrapper.instance().onInputKeyDown(event);

			// then
			expect(event.preventDefault).toHaveBeenCalled();
		});

		it('should manage esc key pressed', () => {
			// when
			const wrapper = shallow(<NestedListViewWidget {...props} />);
			event.keyCode = keycode('escape');
			wrapper.instance().onInputKeyDown(event);

			// then
			expect(event.preventDefault).toHaveBeenCalled();
			expect(wrapper.state('displayMode')).toEqual('DISPLAY_MODE_DEFAULT');
		});
	});

	describe('switchToSearchMode', () => {
		it('should switch to "search" mode in the state', () => {
			// when
			const wrapper = shallow(<NestedListViewWidget {...props} />);
			wrapper.instance().switchToSearchMode();

			// then
			expect(wrapper.state('displayMode')).toEqual('DISPLAY_MODE_SEARCH');
		});
	});

	describe('switchToDefaultMode', () => {
		it('should switch to "default" mode in the state', () => {
			// when
			const wrapper = shallow(<NestedListViewWidget {...props} />);
			wrapper.instance().switchToDefaultMode();

			// then
			expect(wrapper.state('displayMode')).toEqual('DISPLAY_MODE_DEFAULT');
		});
	});
});

describe('NestedListView utils', () => {
	describe('prepareItemsFromSchema', () => {
		it('should prepare items from schema prop', () => {
			// given
			const schema = {
				items: [
					{
						title: 'Bar',
						key: ['foo', 'bar'],
						titleMap: [
							{ label: 'Baz', value: 'baz' },
							{ label: 'Boo', value: 'boo' },
						],
					},
				],
				required: true,
				title: 'title',
				placeholder: 'placeholder',
			};

			const callbacks = {
				onExpandToggle: jest.fn(),
				onParentChange: jest.fn(),
				onCheck: jest.fn(),
			};

			// when
			const items = prepareItemsFromSchema(schema, callbacks);

			// then
			expect(items[0].onExpandToggle).toBe(callbacks.onExpandToggle);
			expect(items[0].onChange).toBe(callbacks.onParentChange);
			expect(items[0].children[0].onChange).toBe(callbacks.onCheck);
			expect(items[0].children[1].onChange).toBe(callbacks.onCheck);
		});
	});

	describe('getDisplayedItems', () => {
		const items = [
			{
				key: 'fruits',
				label: 'Fruits',
				children: [
					{ label: 'Orange', value: 'orange' },
					{ label: 'Apple', value: 'apple' },
				],
			},
			{
				key: 'vegetables',
				label: 'Vegetables',
				children: [
					{ label: 'Carrot', value: 'carrot' },
					{ label: 'Pineapple', value: 'pineapple' },
					{ label: 'Tomato', value: 'tomato' },
				],
			},
			{
				key: 'single',
				label: 'Single',
				children: [{ label: 'Single', value: 'single' }],
			},
		];

		const value = { fruits: ['orange'] };

		it('should get displayed items with preset values', () => {
			// given
			const searchCriteria = '';

			// when
			const displayedItems = getDisplayedItems(items, value, searchCriteria);

			// then
			expect(displayedItems).toHaveLength(3); // Number of displayed items and sub items
			expect(displayedItems[0].children).toHaveLength(2);
			expect(displayedItems[1].children).toHaveLength(3);
			expect(displayedItems[2].children).toHaveLength(1);
			expect(displayedItems[0].checked).toBe(true); // Sections checked
			expect(displayedItems[1].checked).toBe(false);
			expect(displayedItems[0].children[0].checked).toBe(true); // Elements checked
			expect(displayedItems[0].children[1].checked).toBe(false);
			expect(displayedItems[1].children[0].checked).toBe(false);
			expect(displayedItems[1].children[1].checked).toBe(false);
			expect(displayedItems[1].children[2].checked).toBe(false);
			expect(displayedItems[2].children[0].checked).toBe(false);
		});

		it('should filter displayed items according to given search criteria', () => {
			// given
			const searchCriteria = 'apple';

			// when
			const displayedItems = getDisplayedItems(items, value, searchCriteria);

			// then
			expect(displayedItems).toHaveLength(2); // Number of displayed items and sub items
			expect(displayedItems[0].children).toHaveLength(1);
			expect(displayedItems[1].children).toHaveLength(1);
			expect(displayedItems[0].checked).toBe(true); // Sections checked
			expect(displayedItems[1].checked).toBe(false);
			expect(displayedItems[0].children[0].checked).toBe(false); // Elements checked
			expect(displayedItems[1].children[0].checked).toBe(false);
		});

		it('should filter displayed parent items according to given search criteria', () => {
			// given
			const searchCriteria = 'vegetables';

			// when
			const displayedItems = getDisplayedItems(items, value, searchCriteria);

			// then
			expect(displayedItems).toHaveLength(1); // Number of displayed items and sub items
			expect(displayedItems[0].children).toHaveLength(3);
			expect(displayedItems[0].checked).toBe(false); // Sections checked
			expect(displayedItems[0].children[0].checked).toBe(false); // Elements checked
			expect(displayedItems[0].children[1].checked).toBe(false);
			expect(displayedItems[0].children[1].checked).toBe(false);
		});
	});
});
