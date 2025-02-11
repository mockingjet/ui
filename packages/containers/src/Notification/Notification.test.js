import React from 'react';
import { mount } from 'enzyme';
import { mock } from '@talend/react-cmf';
import Immutable, { fromJS } from 'immutable';
import Container from './Notification.container';
import Connected, { mergeProps, deleteNotification } from './Notification.connect';
import pushNotification from './pushNotification';
import clearNotifications from './clearNotifications';

jest.mock('@talend/react-components/lib/Notification', () => props => (
	<div className="tc-notifications" notifications={props.notifications} />
));

describe('Container Notification', () => {
	it('should render', () => {
		const context = mock.store.context();
		const wrapper = mount(<Container />, mock.Provider.getEnzymeOption(context));
		expect(wrapper.html()).toMatchSnapshot();
	});
});

describe('Connected Notification', () => {
	it('should connect Notification', () => {
		expect(Connected.displayName).toBe(`Connect(CMF(${Container.displayName}))`);
		expect(Connected.WrappedComponent).toBe(Container);
	});
	it('mergeProps should merge the props', () => {
		const message = { message: 'hello world' };
		const stateProps = {
			state: fromJS({ notifications: [message] }),
		};
		const dispatchProps = {
			setState: jest.fn(),
		};
		const ownProps = { foo: 'bar' };
		const props = mergeProps(stateProps, dispatchProps, ownProps);
		expect(props.foo).toBe('bar');
		expect(props.state.get('notifications').size).toBe(1);
		expect(typeof props.setState).toBe('function');
		expect(typeof props.deleteNotification).toBe('function');
		props.deleteNotification(message);
		expect(dispatchProps.setState).toHaveBeenCalledTimes(1);
	});

	it('deleteNotification should delete notification', () => {
		const message = fromJS({ message: 'hello world' });
		const stateProps = {
			state: fromJS({ notifications: [message] }),
		};
		expect(deleteNotification(message)(stateProps).toJS()).toEqual({
			notifications: [],
		});
	});

	it('deleteNotification should do nothing if the notification does not exist', () => {
		const ok = fromJS({ message: 'ahah' });
		const ko = fromJS({ message: 'hello world' });
		const stateProps = {
			state: fromJS({ notifications: [ok] }),
		};
		expect(deleteNotification(ko)(stateProps)).toEqual(stateProps.state);
	});
});

describe('Notification.pushNotification', () => {
	it('should add a Notification in the state', () => {
		const state = mock.store.state();
		state.cmf.components = fromJS({
			'Container(Notification)': {
				Notification: {
					notifications: [],
				},
			},
		});
		const notification = { message: 'hello world' };
		const newState = pushNotification(state, notification);
		expect(newState).not.toBe(state);
		const notifications = newState.cmf.components.getIn([
			'Container(Notification)',
			'Notification',
			'notifications',
		]);
		expect(notifications.size).toBe(1);
		expect(notifications.get(0).message).toBe('hello world');
	});

	it('should add a Notification in the state even if the state slot is not yet available', () => {
		const state = mock.store.state();
		state.cmf.components = new Immutable.Map();
		const notification = { message: 'hello world' };
		const newState = pushNotification(state, notification);
		const notifications = newState.cmf.components.getIn([
			'Container(Notification)',
			'Notification',
			'notifications',
		]);
		expect(notifications.size).toBe(1);
		expect(notifications.get(0).message).toBe('hello world');
	});

	it('should delete all Notification in the state', () => {
		const state = mock.store.state();
		state.cmf.components = fromJS({
			'Container(Notification)': {
				Notification: {
					notifications: [{ message: 'hello world' }, { message: 'hello world2' }],
				},
			},
		});
		const newState = clearNotifications(state);
		expect(newState).not.toBe(state);
		const notifications = newState.cmf.components.getIn([
			'Container(Notification)',
			'Notification',
			'notifications',
		]);
		expect(notifications.size).toBe(0);
	});

	it('should not change the state if no notification', () => {
		const state = mock.store.state();
		state.cmf.components = fromJS({
			'Container(Notification)': {
				Notification: {
					notifications: [],
				},
			},
		});
		const newState = pushNotification(state);
		expect(newState).toBe(state);
	});

	it('should not change the state if notification state is not yet availbale', () => {
		const state = mock.store.state();
		state.cmf.components = fromJS({});
		const newState = pushNotification(state);
		expect(newState).toBe(state);
	});
});
