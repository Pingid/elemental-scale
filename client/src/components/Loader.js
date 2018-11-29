import React from 'react';
import makeTick from '../utils/makeTick';

const Loader = ({ tick, text }) => (
	<div>
		{ new Array(tick).fill(0).map((_, i) => '-')}
	</div>
)

export default makeTick(Loader, 15)
