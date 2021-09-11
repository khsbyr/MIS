import React, { useEffect, useState } from 'react';
import { getService } from '../../../service/service';

function countryInfo(props) {
  const [aimagList, setAimagList] = useState([]);

  useEffect(() => {
    // getService(`aimag/get/${props.point?.value}`).then(result => {
    //   if (result) {
    //     const dataList = result;
    //     setAimagList([dataList]);
    //   }
    // });
  }, []);

  return (
    <div>
      <h1>asdasd</h1>
    </div>
  );
}

export default countryInfo;
