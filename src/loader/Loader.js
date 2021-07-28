import React from 'react';
import './loader.scss';

function Loader() {
  return (
    <div
      id="abcd"
      style={{
        position: 'fixed',
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        background: '#f8f9fa73',
        top: 0,
        left: 0,
      }}
    >
      <div className="ball-pulse-sync">
        <div />
        <div />
        <div />
      </div>
    </div>
  );
}

export default React.memo(Loader);
