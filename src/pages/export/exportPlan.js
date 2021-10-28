/* eslint-disable prettier/prettier */
import { Table } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { ToolsContext } from '../../context/Tools';
import { getService } from '../../service/service';
import { errorCatch } from '../../tools/Tools';
import styles from "./style.module.scss";

const exportPlan = () => {
  const loadLazyTimeout = null;
  const toolsStore = useContext(ToolsContext);
  const [referenceId, setReferenceId] = useState([]);
  const [lazyParams] = useState({
    page: 0,
  });

  const PAGESIZE = 20;

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    getService('planActivity/get')
      .then(result => {
        const listResult = result || [];
        listResult.forEach((item, index) => {
          item.index = lazyParams.page * PAGESIZE + index + 1;
        });
        setReferenceId(listResult);
      })
      .finally(toolsStore.setIsShowLoader(false))
      .catch(error => {
        errorCatch(error);
        toolsStore.setIsShowLoader(false);
      });
  };

  useEffect(() => {
    onInit();
  }, []);

  let sameKey0;
  let sameKey1;
  let sameKey2;
  let sameKey3;
  let sameKey4;
  let sameKey5;


  const columns = [
    {
      title:()=><div className={styles.center} >
    Бүрэлдэхүүн
      </div>,   
      dataIndex: ['plan','criteriaReference', 'name'],
      key: ['plan','criteriaReference', 'name'],
       width: '10%',
      render: (value0) => {
        const obj = {
          //  children: value0,
          children: <div className={styles.exportPlan}>
             {value0}
             </div>,
          props: {
          },
        };
        obj.props.r;

        if (!(sameKey0 !== value0)) {
          obj.props.rowSpan = 0;
          return obj;
        }
        const count0 = referenceId.filter(
          item => item.plan.criteriaReference.name === value0
        ).length;

        sameKey0 = value0;
        obj.props.rowSpan = count0;
        return obj;
      },
    },
    {
      title:'Дэд бүрэлдэхүүн',
      dataIndex: ['plan','subCriteriaReference', 'name'],
      key: ['plan','subCriteriaReference', 'name'],
       width: '10%',
      render: (value1) => {
        const obj = {
          children: value1,
          props: {
          },
        };
        obj.props.r;

        if (!(sameKey1 !== value1)) {
          obj.props.rowSpan = 0;
          return obj;
        }
        const count1 = referenceId.filter(
          item => item.plan.subCriteriaReference.name === value1
        ).length;

        sameKey1 = value1;
        obj.props.rowSpan = count1;
        return obj;
      },
    },
    {
      title: 'Үйл ажиллагаа',
      dataIndex: ['plan','name'],
      key: ['plan','name'],
      render: (value2) => {
        const obj = {
          children: value2,
          props: {},
        };
        if (!(sameKey2 !== value2)) {
          obj.props.rowSpan = 0;
          return obj;
        }
        const count2 = referenceId.filter(
          item => item.plan.name === value2
        ).length;
        sameKey2 = value2;

        obj.props.rowSpan = count2;
        return obj;
      },
    },
    {
      title: 'Үйл ажиллагааны дэс дараалал, задаргаа',
      dataIndex: ['operation'],
      key: ['operation'],
      render: (value5) => {
        const obj = {
          children: value5,
          props: {},
        };
        if (!(sameKey5 !== value5)) {
          obj.props.rowSpan = 0;
          return obj;
        }
        const count5 = referenceId.filter(
          item => item.operation === value5
        ).length;
        sameKey5 = value5;

        obj.props.rowSpan = count5;
        return obj;
      },

    },
    {
        title: '2021',        
        children: [
          {
            title: 'Q1',
            key: 'q1',
            dataIndex: 'q1',
            render(text) {
              return {
                props: {
                  style: { background:  text===true ? "#B4C6E7" : "none"  }
                },
              };
            }
          },
          {
            title: 'Q2',
            dataIndex: 'q2',
           key: 'q2',
           render(text) {
            return {
              props: {
                style: { background:  text===true ? "#B4C6E7" : "none"  }
              },
            };
          }
         },
         {
           title: 'Q3',
           dataIndex: 'q3',
           key: 'q3',
           render(text) {
            return {
              props: {
                style: { background:  text===true ? "#B4C6E7" : "none"  }
              },
            };
          }
         },
         {
           title: 'Q4',
           dataIndex: 'q4',
           key: 'q4',
           render(text) {
            return {
              props: {
                style: { background:  text===true ? "#B4C6E7" : "none"  }
              },
            };
          }
         },
       ],
    },
    {
      title:
        'Төслийн хөгжлийн зорилт, дунд хугацааны шалгуур үзүүлэлтэд хамаарах үр дүн',
      dataIndex: ['plan','target'],
      key: ['plan','target'],
      render: (value3) => {
        const obj = {
          children: value3,
          props: {},
        };
        obj.props.r;

        if (!(sameKey3 !== value3)) {
          obj.props.rowSpan = 0;
          return obj;
        }
        const count3 = referenceId.filter(
          item3 => item3.plan.target === value3
        ).length;

        sameKey3 = value3;
        obj.props.rowSpan = count3;
        return obj;
      },
    },
    {
      title: 'Тайлбар',
      dataIndex: ['plan','description'],
      key: ['plan','description'],
      render: (value4) => {
        const obj = {
          children: value4,
          props: {},
        };
        obj.props.r;

        if (!(sameKey4 !== value4)) {
          obj.props.rowSpan = 0;
          return obj;
        }
        const count4 = referenceId.filter(
          item => item.plan.description === value4
        ).length;

        sameKey4 = value4;
        obj.props.rowSpan = count4;
        return obj;
      },
    },
  ];

  return (
    <div className="App">
    <header className="App-header">
          {/* <img src className="App-logo" alt="logo" /> */}
          <p>&nbsp;</p>
        <p style={{textAlign: 'right', paddingRight: '100px'}}><span data-contrast="auto">Батлав:&nbsp; ______________________________</span><strong><span data-contrast="auto">&nbsp;</span></strong> <strong><span data-contrast="auto">Т.Жамбалцэрэн&nbsp;</span></strong><span data-ccp-props="{&quot;201341983&quot;:0,&quot;335551550&quot;:6,&quot;335551620&quot;:6,&quot;335559739&quot;:0,&quot;335559740&quot;:240}">&nbsp;</span></p>
        <p style={{textAlign: 'right', paddingRight: '100px'}}><span data-contrast="auto">Хүнс, хөдөө аж ахуй, хөнгөн үйлдвэрийн яамны</span><span data-ccp-props="{&quot;201341983&quot;:0,&quot;335551550&quot;:6,&quot;335551620&quot;:6,&quot;335559739&quot;:0,&quot;335559740&quot;:240}">&nbsp;</span></p>
        <p style={{textAlign: 'right', paddingRight: '100px'}}><span data-contrast="auto">Төрийн нарийн бичгийн дарга&nbsp;</span><span data-ccp-props="{&quot;201341983&quot;:0,&quot;335551550&quot;:6,&quot;335551620&quot;:6,&quot;335559739&quot;:0,&quot;335559740&quot;:240}">&nbsp;</span></p>
        <p style={{textAlign: 'right', paddingRight: '100px'}}><span data-contrast="auto">(Төслийн удирдах хороог төлөөлж)</span><span data-ccp-props="{&quot;201341983&quot;:0,&quot;335551550&quot;:6,&quot;335551620&quot;:6,&quot;335559685&quot;:2880,&quot;335559731&quot;:720,&quot;335559739&quot;:0,&quot;335559740&quot;:240}">&nbsp;</span></p>
        <p><span data-ccp-props="{&quot;201341983&quot;:0,&quot;335551550&quot;:6,&quot;335551620&quot;:6,&quot;335559739&quot;:0,&quot;335559740&quot;:240}">&nbsp;</span></p>
        <p style={{textAlign: 'center'}}><strong><span data-contrast="auto">МОНГОЛ УЛС:&nbsp;ХӨДӨӨ АЖ АХУЙН ЭДИЙН ЗАСГИЙН ЭРГЭЛТИЙГ НЭМЭГДҮҮЛЭХ ТӨСӨЛ</span></strong><span data-ccp-props="{&quot;201341983&quot;:0,&quot;335551550&quot;:6,&quot;335551620&quot;:6,&quot;335559739&quot;:0,&quot;335559740&quot;:240}">&nbsp;</span></p>
        <p style={{textAlign: 'center'}}><strong><span data-contrast="auto">ҮЙЛ АЖИЛЛАГААНЫ ТӨЛӨВЛӨГӨӨ</span></strong><span data-ccp-props="{&quot;201341983&quot;:0,&quot;335551550&quot;:6,&quot;335551620&quot;:6,&quot;335559739&quot;:0,&quot;335559740&quot;:240}">&nbsp;</span></p>
        <p><span data-ccp-props="{&quot;201341983&quot;:0,&quot;335551550&quot;:6,&quot;335551620&quot;:6,&quot;335559739&quot;:0,&quot;335559740&quot;:240}">&nbsp;</span></p>
        <p style={{textAlign: 'center'}}><strong><span data-contrast="auto">Хамрах&nbsp;хугацаа:&nbsp;2021&nbsp;оны 1 дүгээр сарын&nbsp;1 –&nbsp;2021&nbsp;оны 12 дугаар сарын&nbsp;31</span></strong><span data-ccp-props="{&quot;201341983&quot;:0,&quot;335551550&quot;:6,&quot;335551620&quot;:6,&quot;335559739&quot;:0,&quot;335559740&quot;:240}">&nbsp;</span></p>
        <p style={{textAlign: 'center'}}><span data-ccp-props="{&quot;201341983&quot;:0,&quot;335551550&quot;:6,&quot;335551620&quot;:6,&quot;335559739&quot;:0,&quot;335559740&quot;:240}">&nbsp;</span></p>
        <p style={{textAlign: 'center'}}><span data-contrast="auto">Шинэчилсэн огноо:&nbsp;</span> <span data-contrast="auto">2021&nbsp;оны&nbsp;1&nbsp;дүгээр сарын&nbsp;</span><span data-contrast="auto">…</span><span data-ccp-props="{&quot;201341983&quot;:0,&quot;335551550&quot;:6,&quot;335551620&quot;:6,&quot;335559739&quot;:0,&quot;335559740&quot;:240}">&nbsp;</span></p>
        <p style={{textAlign: 'center'}}><span data-contrast="auto">Баталсан огноо:&nbsp;</span> <span data-contrast="auto">2021 оны 1&nbsp;дугаар сарын&nbsp;</span><span data-contrast="auto">...</span><span data-ccp-props="{&quot;201341983&quot;:0,&quot;335551550&quot;:6,&quot;335551620&quot;:6,&quot;335559739&quot;:0,&quot;335559740&quot;:240}">&nbsp;</span></p>
        <p><span data-ccp-props="{&quot;201341983&quot;:0,&quot;335551550&quot;:6,&quot;335551620&quot;:6,&quot;335559739&quot;:0,&quot;335559740&quot;:240}">&nbsp;</span></p>
      </header>
      <Table
      columns={columns}
      dataSource={referenceId.map((d, i) => ({ key: i, ...d }))}
      pagination={false}
      bordered
      style={{
        paddingLeft: '30px',
        paddingRight: '30px',

      }}
    />
    </div>
    
    
  );
};

export default exportPlan;
