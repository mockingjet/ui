/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import TreeView from './TreeView.component';

const structure = [
	{ name: 'hitmonlee', children: [{ name: 'Hitmonchan' }], isOpened: false },
	{ name: 'pikachu', children: [{ name: 'raichu' }], isOpened: true },
	{
		id: 'selected',
		name: 'Abra',
		isOpened: true,
		children: [
			{
				name: 'Kadabra',
				isOpened: true,
				children: [
					{
						name: 'Alakazam',
					},
				],
			},
		],
	},
];

const structureWithIcons = [
	{
		name: 'hitmonlee',
		children: [{ name: 'Hitmonchan' }],
		isOpened: false,
		icon: {
			name: 'talend-versioning',
			tooltipLabel: 'New version of the Pokemon is available',
		},
	},
	{
		name: 'pikachu',
		children: [
			{
				name: 'raichu',
				icon: {
					name:
						'src-http://static.pokemonpets.com/images/monsters-images-300-300/2026-Shiny-Raichu.png',
				},
			},
		],
		isOpened: true,
		icon: {
			name:
				'src-http://static.pokemonpets.com/images/monsters-images-300-300/2025-Shiny-Pikachu.png',
		},
	},
	{
		id: 'selected',
		name: 'Abra',
		icon: { name: 'src-http://static.pokemonpets.com/images/monsters-images-300-300/63-Abra.png' },
		isOpened: true,
		children: [
			{
				name: 'Kadabra',
				icon: {
					name: 'src-http://static.pokemonpets.com/images/monsters-images-300-300/64-Kadabra.png',
				},
				isOpened: true,
				children: [
					{
						name: 'Alakazam',
						icon: {
							name:
								'src-http://static.pokemonpets.com/images/monsters-images-300-300/65-Alakazam.png',
						},
					},
				],
			},
		],
	},
];

const structureWithoutIcons = [
	{
		name: 'hitmonlee',
		children: [{ name: 'Hitmonchan' }],
		isOpened: false,
		icon: false,
	},
	{
		name: 'pikachu',
		children: [
			{
				name: 'raichu',
				icon: false,
			},
		],
		isOpened: true,
		icon: false,
	},
	{
		id: 'selected',
		name: 'Abra',
		icon: false,
		isOpened: true,
		children: [
			{
				name: 'Kadabra',
				icon: false,
				isOpened: true,
				children: [
					{
						name: 'Alakazam',
						icon: false,
					},
				],
			},
		],
	},
];

const removeAction = [
	{
		action: action('itemRemoveCallback'),
		icon: 'talend-trash',
		label: 'remove element',
	},
];

const actions = [
	{
		action: action('itemAddCallback'),
		icon: 'talend-plus',
		label: 'Add Item',
	},
	{
		action: action('itemEditCallback'),
		icon: 'talend-pencil',
		label: 'Edit Item',
	},
	{
		action: action('itemRemoveCallback'),
		icon: 'talend-trash',
		label: 'Remove Item',
	},
];

const structureWithCounterAndAction = [
	{
		name: 'hitmonlee',
		isOpened: true,
		children: [
			{
				name: 'raichu',
				showCounter: true,
				counter: 111,
				actions: removeAction,
			},
		],
		counter: -1,
		showCounter: true,
		actions: removeAction,
	},
	{
		name: 'pikachu',
		isOpened: true,
		counter: 2911,
		showCounter: true,
		actions: removeAction,
	},
];

const structureWithActions = [
	{
		name: 'hitmonlee',
		isOpened: true,
		children: [
			{
				name: 'raichu',
				actions,
			},
		],
		actions,
	},
	{
		name: 'pikachu',
		isOpened: true,
		actions,
	},
];

const structureWithDisabledActions = [
	{
		name: 'doge',
		isOpened: true,
		children: [
			{
				name: 'dogecoin',
				actions,
			},
		],
		actions,
	},
	{
		name: 'hitmonlee',
		isOpened: false,
		disabled: true,
		icon: {
			name: 'talend-warning',
			tooltipLabel: 'New version of the Pokemon is available',
		},
		children: [
			{
				name: 'raichu',
				actions,
			},
		],
	},
	{
		id: 'selected',
		name: 'Selected item',
		isOpened: true,
		actions,
	},
];

const defaultProps = {
	id: 'my-treeview',
	structure,
	onSelect: action('onSelect'),
	onToggle: action('onToggle'),
	onToggleAllSiblings: action('onToggleAllSiblings'),
	selectedId: 'selected',
};

const withAddAction = {
	...defaultProps,
	addAction: action('added'),
};

const withHeader = {
	...withAddAction,
	headerText: 'some elements',
	addActionLabel: 'add element',
};

const withRemoval = {
	...withAddAction,
};
withRemoval.structure = structureWithCounterAndAction;

const withActions = {
	...withAddAction,
};
withActions.structure = structureWithActions;

const withDisabledItems = {
	...withAddAction,
};

const withClassNames = {
	...withAddAction,
	structure: [
		{ name: 'hitmonlee', children: [{ name: 'Hitmonchan' }], isOpened: false, className: 'test-class' },
		{ name: 'pikachu', children: [{ name: 'raichu' }], isOpened: true, className: 'test-class' },
		{
			id: 'selected',
			name: 'Abra',
			isOpened: true,
			children: [
				{
					name: 'Kadabra',
					isOpened: true,
					children: [
						{
							name: 'Alakazam',
						},
					],
				},
			],
		},
	]
};

withDisabledItems.structure = structureWithDisabledActions;

const hugeStructure = [
	{
		name: 'Hitmonlee1',
		isOpened: true,
		children: [
			{
				name: 'Hitmonchan2',
				isOpened: true,
				children: [
					{
						name: 'Hitmonchan3',
						isOpened: true,
						children: [
							{
								name: 'Hitmonchan4',
								isOpened: true,
								children: [
									{
										name: 'Hitmonchan5',
										isOpened: true,
										children: [
											{
												name: 'Hitmonchan6',
												isOpened: true,
												children: [
													{
														name: 'Hitmonchan7',
														isOpened: true,
														children: [
															{
																name: 'Hitmonchan8',
																isOpened: true,
																children: [
																	{
																		name: 'Hitmonchan9',
																		isOpened: true,
																		children: [
																			{
																				name: 'Hitmonchan10',
																				isOpened: true,
																				children: [
																					{
																						name: 'Hitmonchen11',
																						isOpened: true,
																						children: [
																							{
																								name: 'Hitmonchen12',
																								isOpened: true,
																								children: [
																									{
																										name: 'Hitmonchen13',
																										isOpened: true,
																										children: [
																											{
																												name: 'Hitmonchen14',
																											},
																										],
																									},
																								],
																							},
																						],
																					},
																				],
																			},
																		],
																	},
																],
															},
														],
													},
												],
											},
										],
									},
								],
							},
						],
					},
				],
			},
		],
	},
];

const withDeepStructure = {
	...defaultProps,
};
withDeepStructure.structure = hugeStructure;

const cornerCaseLongName = {
	...defaultProps,
};
cornerCaseLongName.structure = [
	{
		name:
			'Hitmonlee1Hitmonlee1Hitmonlee1Hitmonlee1Hitmonlee1 Hitmonlee1Hitmonlee1Hitmonlee1Hitmonlee1Hitmonlee1',
		isOpened: true,
	},
];

const style = { width: '300px', border: '1px solid #eee', marginLeft: '10px' };

storiesOf('Data/Tree/FolderTreeView', module)
	.add('default', () => (
		<div>
			<h1>TreeView</h1>
			<h3>Definition</h3>
			<p>A view component to display any tree structure, like folders or categories.</p>
			<h3>Default property-set with action example: </h3>
			<div style={style}>
				<TreeView {...withAddAction} />
			</div>
		</div>
	))
	.add('with custom icons', () => (
		<div>
			<h1>TreeView</h1>
			<h3>Definition</h3>
			<p>The icons can be customized, passign the Icon components props</p>
			<div style={style}>
				<TreeView {...withAddAction} structure={structureWithIcons} />
			</div>
		</div>
	))
	.add('with custom header text', () => (
		<div>
			<h1>TreeView</h1>
			<h3>Definition</h3>
			<p>A view component to display any tree structure, like folders or categories.</p>
			<h3>Custom header and action tooltip property-set example: </h3>
			<div style={style}>
				<TreeView {...withHeader} />
			</div>
		</div>
	))
	.add('without action', () => (
		<div>
			<h1>TreeView</h1>
			<h3>Definition</h3>
			<p>A view component to display any tree structure, like folders or categories.</p>
			<h3>Default property-set without action example: </h3>
			<div style={style}>
				<TreeView {...defaultProps} />
			</div>
		</div>
	))
	.add('without header', () => (
		<div>
			<h1>TreeView</h1>
			<h3>Definition</h3>
			<p>A view component to display any tree structure, like folders or categories.</p>
			<h3>Default property-set without header example: </h3>
			<div style={style}>
				<TreeView {...defaultProps} noHeader />
			</div>
		</div>
	))
	.add('with remove action and counter', () => (
		<div>
			<h1>TreeView</h1>
			<h3>Definition</h3>
			<p>A view component to display any tree structure, like folders or categories.</p>
			<h3>Default property-set with remove action example: </h3>
			<div style={style}>
				<TreeView {...withRemoval} />
			</div>
		</div>
	))
	.add('with many actions', () => (
		<div>
			<h1>TreeView</h1>
			<h3>Definition</h3>
			<p>A view component to display any tree structure, like folders or categories.</p>
			<h3>Default property-set with remove action example: </h3>
			<div style={style}>
				<TreeView {...withActions} />
			</div>
		</div>
	))
	.add('with disabled items', () => (
		<div>
			<h1>TreeView</h1>
			<h3>Definition</h3>
			<p>
				When an element cannot be selected the whole line is 0.54 opacity, with a not-allowed
				cursor.
			</p>
			<h3>An example with disabled items: </h3>
			<div style={style}>
				<TreeView {...withDisabledItems} />
			</div>
		</div>
	))
	.add('with deep structure', () => (
		<div>
			<h1>TreeView</h1>
			<h3>Definition</h3>
			<p>A view component to display any tree structure, like folders or categories.</p>
			<h3>Default property-set with deep structure: </h3>
			<div style={style}>
				<TreeView {...withDeepStructure} />
			</div>
		</div>
	))
	.add('with long name', () => (
		<div>
			<h1>TreeView</h1>
			<h3>Definition</h3>
			<p>A view component to display any tree structure, like folders or categories.</p>
			<h3>Default property-set with cornercase: longname </h3>
			<div style={style}>
				<TreeView {...cornerCaseLongName} />
			</div>
		</div>
	))
	.add('without icons', () => (
		<div>
			<h1>TreeView</h1>
			<h3>Definition</h3>
			<p>A view component to display any tree structure, like folders or categories.</p>
			<h3>Default property-set without icons: </h3>
			<div style={style}>
				<TreeView {...withAddAction} structure={structureWithoutIcons} />
			</div>
		</div>
	))
	.add('Items classNames', () => (
		<div>
			<h1>TreeView</h1>
			<h3>Definition</h3>
			<p>A view component to display any tree structure, like folders or categories.</p>
			<h3>You can pass custom class names to a tree view items </h3>
			<style>
				{`
					.test-class {
						background: rgba(0,0,0,0.1);
						animation: mymove 2s infinite;
					}
					.test-class .tc-treeview-item {
						cursor: copy;
					}

					@keyframes mymove {
						0% {opacity: 1;}
						50% {opacity: 0.4;}
						100% {opacity: 1;}
					}`}
			</style>
			<div style={style}>
				<TreeView {...withClassNames} />
			</div>
		</div>
	));
