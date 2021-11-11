import { Button } from 'antd';
import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import ExportPlan from './exportPlan';

const ExportButton = () => {
  const componentRef = useRef();

  return (
    <div>
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
      <ExportPlan ref={componentRef} />
    </div>
  );
};

export default ExportButton;
