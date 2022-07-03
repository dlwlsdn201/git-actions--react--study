import React, { useState } from 'react';

const Test = () => {
	const [state, setState] = useState({
		a: 0,
		b: 0
	});

	const setUpdate = (target: 'a' | 'b', value: string) => {
		console.log('target, value:', target, value);
		setState({ ...state, [target]: Number(value) });
	};
	return (
		<div>
			<input type='number' onChange={(e) => setUpdate('a', e.target.value)} />
			<input type='number' onChange={(e) => setUpdate('b', e.target.value)} />
			<span>LJW</span>
		</div>
	);
};

export default Test;
