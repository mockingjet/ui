import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Panel, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import OverlayTrigger from '../OverlayTrigger';
import Action from '../Actions/Action';
import ActionIconToggle from '../Actions/ActionIconToggle';
import Status from '../Status';
import Tag from '../Tag';
import TooltipTrigger from '../TooltipTrigger';

import css from './CollapsiblePanel.scss';
import I18N_DOMAIN_COMPONENTS from '../constants';

const TYPE_STATUS = 'status';
const TYPE_ACTION = 'action';
const TYPE_BADGE = 'badge';

function getActionHandler(func, item) {
	return function actionHandler(e) {
		e.stopPropagation();
		func(e, item);
	};
}

const displayModes = [TYPE_ACTION, TYPE_BADGE, TYPE_STATUS];

const statusPropTypes = {
	displayMode: PropTypes.oneOf(displayModes),
	className: PropTypes.string,
	...Status.propTypes,
};

const actionPropTypes = {
	displayMode: PropTypes.oneOf(displayModes),
	className: PropTypes.string,
	...Action.propTypes,
};

const simplePropTypes = {
	displayMode: PropTypes.oneOf(displayModes),
	className: PropTypes.string,
	element: PropTypes.element,
	label: PropTypes.string,
	bsStyle: PropTypes.string,
	tooltipLabel: OverlayTrigger.propTypes.label,
	tooltipPlacement: OverlayTrigger.propTypes.placement,
};

function renderHeaderItem({ displayMode, className, ...headerItem }, key) {
	switch (displayMode) {
		case TYPE_STATUS: {
			const { actions, ...restStatus } = headerItem;
			const statusActions =
				actions &&
				actions.map(action => ({
					...action,
					onClick: getActionHandler(action.onClick, headerItem),
				}));
			return (
				<Status key={key} actions={statusActions} {...restStatus} className={css[className]} />
			);
		}
		case TYPE_ACTION: {
			const { onClick, ...restAction } = headerItem;
			return (
				<Action
					key={key}
					onClick={getActionHandler(onClick, headerItem)}
					className={css[className]}
					{...restAction}
				/>
			);
		}
		case TYPE_BADGE: {
			const { label, tooltipLabel, tooltipPlacement, ...rest } = headerItem;
			return (
				<TooltipTrigger key={key} label={tooltipLabel || label} tooltipPlacement={tooltipPlacement}>
					<Tag {...rest} className={css[className]}>
						{label}
					</Tag>
				</TooltipTrigger>
			);
		}
		default: {
			const { element, label, tooltipLabel, tooltipPlacement } = headerItem;
			const labelExist = tooltipLabel || label;
			if (labelExist) {
				return (
					<TooltipTrigger key={key} label={labelExist} tooltipPlacement={tooltipPlacement}>
						<div className={css[className]}>{element || label}</div>
					</TooltipTrigger>
				);
			}
			return <div className={css[className]}>{element || label}</div>;
		}
	}
}
renderHeaderItem.propTypes = PropTypes.oneOfType([
	PropTypes.shape(statusPropTypes),
	PropTypes.shape(actionPropTypes),
	PropTypes.shape(simplePropTypes),
	PropTypes.arrayOf(
		PropTypes.oneOfType([
			PropTypes.shape(statusPropTypes),
			PropTypes.shape(actionPropTypes),
			PropTypes.shape(simplePropTypes),
		]),
	),
]);

function CollapsiblePanelHeader(props) {
	const { t } = useTranslation(I18N_DOMAIN_COMPONENTS);
	const { header, content, id, onSelect, onToggle, expanded, dataFeature } = props;
	const headerColumnClass = `col-${header.length}`;
	const headerItems = header.map((headerItem, index) => {
		const isHeaderItemArray = Array.isArray(headerItem);
		const elements = isHeaderItemArray
			? headerItem.map(renderHeaderItem)
			: renderHeaderItem(headerItem);

		const selectors = isHeaderItemArray
			? classNames(css.group, css[headerColumnClass])
			: classNames(css[headerItem.className], css[headerColumnClass]);

		return (
			<div key={index} className={selectors}>
				{elements}
			</div>
		);
	});

	// Panel component needs an array for header props
	const wrappedHeader = [
		onSelect ? (
			<Button
				className={classNames(css['panel-title'])}
				bsStyle="link"
				key="panel-toggle"
				onClick={onSelect}
			>
				<div className={classNames(css['panel-title'])}>{headerItems}</div>
			</Button>
		) : (
			/* eslint-disable jsx-a11y/no-static-element-interactions */
			// eslint-disable-next-line jsx-a11y/click-events-have-key-events
			<div className={classNames(css['panel-title'])} key="panel-toggle" onClick={onToggle}>
				{headerItems}
			</div>
		),
	];

	if (content || props.children) {
		const caretText = expanded
			? t('COLLAPSIBLE_PANEL_COLLAPSE', { defaultValue: 'Collapse panel' })
			: t('COLLAPSIBLE_PANEL_EXPAND', { defaultValue: 'Expand panel' });

		const defaultCaret = (
			<ActionIconToggle
				key={`collapse_header_${id}`}
				aria-expanded={expanded}
				className={classNames(css.toggle, 'toggle')}
				onClick={onToggle}
				id={id && `${id}__collapse`}
				label={caretText}
				type="button"
				active={expanded}
				icon="talend-caret-down"
				iconTransform={expanded ? 'flip-vertical' : null}
				data-feature={dataFeature}
			/>
		);
		wrappedHeader.push(defaultCaret);
	}
	return (
		<div className={classNames(css['panel-header-content'], 'panel-header-content')}>
			{wrappedHeader}
		</div>
	);
}

function getKeyValueContent(content) {
	return (
		<dl className={css.content}>
			{content.map((item, index) => [
				<dt className={css.label} key={`${index}_label`}>
					<Tag>{item.label}</Tag>
				</dt>,
				<dd className={css.description} key={`${index}_desc`}>
					{item.description}
				</dd>,
			])}
		</dl>
	);
}

function getTextualContent(content) {
	return (
		<div className={css.content}>
			<div className={css.head}>
				{content.head.map((item, index) => {
					const { label, tooltipPlacement, tooltipLabel, className } = item;
					return (
						<TooltipTrigger
							key={index}
							label={tooltipLabel || label}
							tooltipPlacement={tooltipPlacement}
						>
							<span className={className}>{label}</span>
						</TooltipTrigger>
					);
				})}
			</div>
			<div className={classNames(css['content-description'], 'content-description')}>
				{content.description}
			</div>
		</div>
	);
}

function CollapsiblePanel(props) {
	const { content, id, onToggle, status, expanded, theme, onEntered, onExited } = props;
	const className = classNames('panel panel-default', css['tc-collapsible-panel'], {
		[css['default-panel']]: !theme,
		[css[theme]]: !!theme,
		[css.open]: expanded,
		[css[Status.getBsStyleFromStatus(status) || status]]: !!status,
		status,
	});

	let children = null;
	if (content) {
		children = Array.isArray(content) ? getKeyValueContent(content) : getTextualContent(content);
	}
	return (
		<Panel id={id} className={className} expanded={expanded} onToggle={onToggle}>
			<Panel.Heading>
				<Panel.Title toggle={(content || props.children) && !onToggle}>
					<CollapsiblePanelHeader {...props} />
				</Panel.Title>
			</Panel.Heading>
			<Panel.Collapse onEntered={onEntered} onExited={onExited}>
				<Panel.Body>
					{children}
					{props.children}
				</Panel.Body>
			</Panel.Collapse>
		</Panel>
	);
}

CollapsiblePanel.displayName = 'CollapsiblePanel';

if (process.env.NODE_ENV !== 'production') {
	CollapsiblePanelHeader.propTypes = {
		/** Content of the panel body
		 *  If content is an array a key value content list is rendered
		 *  otherwise it is a textual content
		 */
		content: PropTypes.oneOfType([
			PropTypes.arrayOf(
				PropTypes.shape({
					label: PropTypes.string,
					description: PropTypes.string,
				}),
			),
			PropTypes.shape({
				head: PropTypes.arrayOf(PropTypes.shape(simplePropTypes)),
				description: PropTypes.string,
			}),
		]),
		/** Expanded state for controlled panel */
		expanded: PropTypes.bool,
		/** Header elements */
		header: PropTypes.arrayOf(renderHeaderItem.propTypes).isRequired,
		id: PropTypes.string.isRequired,
		/** Header click callback function */
		onSelect: PropTypes.func,
		/** Caret click callback function, needed for controlled panel */
		onToggle: PropTypes.func,
	};

	CollapsiblePanel.propTypes = {
		...CollapsiblePanelHeader.propTypes,
		/** Apply a status style */
		status: PropTypes.string,
		/** Styling theme to apply */
		theme: PropTypes.string,
	};
}

CollapsiblePanel.displayModes = { TYPE_STATUS, TYPE_ACTION, TYPE_BADGE };
export default CollapsiblePanel;
