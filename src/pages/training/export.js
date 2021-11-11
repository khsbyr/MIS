/* eslint-disable import/no-unresolved */
import { Button } from 'antd';
import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';

import ExportTraining from './ExportTraining';

const Example = () => {
  const componentRef = useRef();

  return (
    <div
      style={{
        maxWidth: '1400px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <ReactToPrint
        trigger={() => (
          <Button
            style={{ marginTop: '10px' }}
            className="float-right"
            color="primary"
          >
            Хэвлэх
          </Button>
        )}
        content={() => componentRef.current}
      />
      <ExportTraining ref={componentRef} />
    </div>
  );
};

export default Example;
