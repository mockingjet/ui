import React, { forwardRef, Ref } from 'react';

export type TestProps = {
	/**
	 Add a prefix "Hello"
	 */
	hasHello?: boolean;
	/**
     Name
     */
	name?: 'world' | 'you';
};

const TestWithForwardRef = forwardRef(
	({ hasHello, name, ...rest }: TestProps, ref: Ref<HTMLDivElement>) => (
		<div {...rest} ref={ref}>
			{hasHello ? 'hello' : ''} {name}
		</div>
	),
);

TestWithForwardRef.displayName = 'TestWithForwardRef';

export default TestWithForwardRef;
