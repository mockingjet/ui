import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Action from '../Actions/Action';
import Stepper from './Stepper.component';

const stories = storiesOf('Messaging & Communication/Stepper', module);
const title = 'Sample processing...';

function renderActions(isInError) {
	if (!isInError) {
		return null;
	}
	return (
		<React.Fragment>
			<Action label="retry" bsStyle="info" className="btn-inverse button-padding" />
			<Action label="edit dataset" bsStyle="info" className="button-padding" />
			<Action label="edit connection" bsStyle="info" className="button-padding" />
		</React.Fragment>
	);
}

stories
	.add('Stepper default', () => {
		const steps = [
			{ label: 'Fetch Sample', status: Stepper.LOADING_STEP_STATUSES.SUCCESS },
			{
				label: 'Global Quality',
				status: Stepper.LOADING_STEP_STATUSES.LOADING,
			},
			{ label: 'Flattening', status: Stepper.LOADING_STEP_STATUSES.LOADING },
			{
				label: 'Column Quality',
				status: Stepper.LOADING_STEP_STATUSES.PENDING,
			},
		];
		return <Stepper steps={steps} title={title} />;
	})
	.add('Stepper with error', () => {
		const steps = [
			{
				label: 'Fetch Sample',
				status: Stepper.LOADING_STEP_STATUSES.SUCCESS,
				message: { label: 'Everything is fine 🔥🐶' },
			},
			{
				label: 'Global Quality',
				status: Stepper.LOADING_STEP_STATUSES.FAILURE,
				message: { label: "We couldn't connect to the remote engine" },
			},
			{ label: 'Flattening', status: Stepper.LOADING_STEP_STATUSES.ABORTED },
			{
				label: 'Column Quality',
				status: Stepper.LOADING_STEP_STATUSES.ABORTED,
			},
		];
		return <Stepper steps={steps} title={title} renderActions={renderActions} />;
	})
	.add('Stepper without steps', () => (
		<Stepper title={title} renderActions={renderActions}>
			<p>No step to display here, it means content is already loaded.</p>
		</Stepper>
	))
	.add('Stepper successful without transition', () => (
		<Stepper
			title={title}
			steps={[{ label: 'Fetch Sample', status: Stepper.LOADING_STEP_STATUSES.SUCCESS }]}
		/>
	))
	.add('Form Stepper', () => (
		<Stepper.Form>
			<Stepper.Form.Step.Validated title="I'm ok" />
			<Stepper.Form.Step.Error title="I'm not ok" />
			<Stepper.Form.Step.Validated title="Hey" />
			<Stepper.Form.Step.Validated title="Yup" />
			<Stepper.Form.Step.InProgress title="Hey, I'm in progress" />
			<Stepper.Form.Step.Disabled title="I'm disabled" />
			<Stepper.Form.Step.Enabled title="I'm enabled" />
		</Stepper.Form>
	))
	.add('Horizontal form Stepper', () => (
		<Stepper.Form.Horizontal>
			<Stepper.Form.Step.Validated title="I'm ok" />
			<Stepper.Form.Step.InProgress title="Hey, I'm in progress" />
			<Stepper.Form.Step.Enabled title="I'm enabled" />
		</Stepper.Form.Horizontal>
	))
	.add('Stepper successful with transition', () => {
		const defaultSteps = [
			{ label: 'Fetch Sample', status: Stepper.LOADING_STEP_STATUSES.SUCCESS },
			{
				label: 'Global Quality',
				status: Stepper.LOADING_STEP_STATUSES.SUCCESS,
			},
			{ label: 'Flattening', status: Stepper.LOADING_STEP_STATUSES.SUCCESS },
			{
				label: 'Column Quality',
				status: Stepper.LOADING_STEP_STATUSES.LOADING,
			},
		];

		function GetSteps(props) {
			const [steps, setSteps] = useState(defaultSteps);

			const init = () => {
				setSteps([
					{
						label: 'Fetch Sample',
						status: Stepper.LOADING_STEP_STATUSES.SUCCESS,
					},
					{
						label: 'Global Quality',
						status: Stepper.LOADING_STEP_STATUSES.SUCCESS,
					},
					{
						label: 'Flattening',
						status: Stepper.LOADING_STEP_STATUSES.SUCCESS,
					},
					{
						label: 'Column Quality',
						status: Stepper.LOADING_STEP_STATUSES.LOADING,
					},
				]);
			};

			const end = () => {
				setSteps([
					{
						label: 'Fetch Sample',
						status: Stepper.LOADING_STEP_STATUSES.SUCCESS,
					},
					{
						label: 'Global Quality',
						status: Stepper.LOADING_STEP_STATUSES.SUCCESS,
					},
					{
						label: 'Flattening',
						status: Stepper.LOADING_STEP_STATUSES.SUCCESS,
					},
					{
						label: 'Column Quality',
						status: Stepper.LOADING_STEP_STATUSES.SUCCESS,
					},
				]);
			};

			return (
				<div>
					<div>
						<Action onClick={init} label="init" />
						<Action onClick={end} label="end" />
					</div>
					{props.children(steps)}
				</div>
			);
		}

		return (
			<GetSteps>
				{steps => (
					<Stepper steps={steps} title={title}>
						<div>
							Content is loaded.
							<div>
								<Action
									label="Action"
									bsStyle="info"
									className="btn-inverse button-padding"
									onClick={action('click')}
								/>
							</div>
						</div>
					</Stepper>
				)}
			</GetSteps>
		);
	});
