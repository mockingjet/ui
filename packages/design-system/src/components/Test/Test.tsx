import React from 'react';

export type TestProps = {
	/**
	 Add a prefix "Hello"
	 */
	hasHello?: boolean;
	/**
	 Name
	 */
	name: 'world' | 'you';
};

const Test = ({ hasHello, name, ...rest }: TestProps) => (
	<div {...rest}>
		{hasHello ? 'hello' : ''} {name}
	</div>
);

export default Test;
