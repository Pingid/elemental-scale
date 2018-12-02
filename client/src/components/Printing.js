import React from 'react';
import makeTick from '../utils/makeTick';

const Printing ({ tick }) => {
  return (
    <div>
      <h2 className="center py3">The Elemental Scale</h2>
      <p className="center py3 px2">99.9% of a human’s body mass is made of 11 elements. The remaining 0.01% are trace elements.</p>
      <p className="center py3 px2">These results show the approximate number of atoms of each element in your body.</p>
      <div className="my3 flex items-center justify-center flex-wrap" style={{ borderTop: '1px solid black', borderBottom: '1px solid black' }}>
        <div style={{ width: width * .4 }}>
          <p className="">Name: {name}</p>
          <p className="">Weight: {weight}N</p>
          <p className="">Value: ${cost}</p>
        </div>
      </div>
    </div>
  );
}

export default makeTick(Printing, 100);
