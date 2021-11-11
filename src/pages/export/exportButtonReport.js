/* eslint-disable import/no-unresolved */
import { Button } from 'antd';
import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import ExportReport from './exportReport';

const ExportButtonReport = () => {
  const componentRef = useRef();

  return (
    <div>
      <ReactToPrint
        trigger={() => (
          <Button
            style={{
              marginTop: '10px',
              marginLeft: '320px',
            }}
            className="float-right"
            color="primary"
          >
            Хэвлэх
          </Button>
        )}
        content={() => componentRef.current}
      />
      <ExportReport ref={componentRef} />
    </div>
  );
};

export default ExportButtonReport;
