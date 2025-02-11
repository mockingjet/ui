import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import InputSizer from './InputSizer.component';

describe('InputSizer', () => {
	it('should call children with width', () => {
		// given
		const children = jest.fn();
		const placeholder = 'YYYY-MM-DD';
		window.HTMLElement.prototype.getBoundingClientRect = () => ({ width: 42 });

		// when
		act(() => {
			mount(<InputSizer placeholder={placeholder}>{children}</InputSizer>);
		});

		// then
		expect(children).toHaveBeenCalledWith(47);
	});
	it('should apply inputText style when there is input', () => {
		// given
		const children = jest.fn();
		// when
		const wrapper = shallow(
			<InputSizer placeholder="HH:mm" inputText="2019-08-21">
				{children}
			</InputSizer>,
		);
		// then
		const style = wrapper.find('span').prop('style');
		expect(style).toEqual({
			padding: '0 1rem',
			fontSize: '1.4rem',
			visibility: 'hidden',
			position: 'absolute',
		});
	});
});
