import { Table } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ToolsContext } from '../../context/Tools';
import { getService } from '../../service/service';
import { errorCatch } from '../../tools/Tools';
import ContentWrapper from './style';

const exportPlan = React.forwardRef((props, ref) => {
  const loadLazyTimeout = null;
  const toolsStore = useContext(ToolsContext);
  const [referenceId, setReferenceId] = useState([]);
  const [lazyParams] = useState({
    page: 0,
  });
  const location = useLocation();

  function getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=');
      if (pair[0] === variable) {
        return pair[1];
      }
    }
    return false;
  }

  const PAGESIZE = 20;

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    getService(`planActivity/getList${location.search}`)
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
      title: () => <div>Бүрэлдэхүүн</div>,
      dataIndex: ['plan', 'criteriaReference', 'name'],
      key: ['plan', 'criteriaReference', 'name'],
      width: '10%',
      render: value0 => {
        const obj = {
          //  children: value0,
          children: <div>{value0}</div>,
          props: {},
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
      title: 'Дэд бүрэлдэхүүн',
      dataIndex: ['plan', 'subCriteriaReference', 'name'],
      key: ['plan', 'subCriteriaReference', 'name'],
      width: '10%',
      render: value1 => {
        const obj = {
          children: value1,
          props: {},
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
      dataIndex: ['plan', 'name'],
      key: ['plan', 'name'],
      render: value2 => {
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
      render: value5 => {
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
      title: getQueryVariable('year'),
      children: [
        {
          title: 'Q1',
          key: 'q1',
          dataIndex: 'q1',
          render(text) {
            return {
              props: {
                style: { background: text === true ? '#B4C6E7' : 'none' },
              },
            };
          },
        },
        {
          title: 'Q2',
          dataIndex: 'q2',
          key: 'q2',
          render(text) {
            return {
              props: {
                style: { background: text === true ? '#B4C6E7' : 'none' },
              },
            };
          },
        },
        {
          title: 'Q3',
          dataIndex: 'q3',
          key: 'q3',
          render(text) {
            return {
              props: {
                style: { background: text === true ? '#B4C6E7' : 'none' },
              },
            };
          },
        },
        {
          title: 'Q4',
          dataIndex: 'q4',
          key: 'q4',
          render(text) {
            return {
              props: {
                style: { background: text === true ? '#B4C6E7' : 'none' },
              },
            };
          },
        },
      ],
    },
    {
      title:
        'Төслийн хөгжлийн зорилт, дунд хугацааны шалгуур үзүүлэлтэд хамаарах үр дүн',
      dataIndex: ['plan', 'target'],
      key: ['plan', 'target'],
      render: value3 => {
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
      dataIndex: ['plan', 'description'],
      key: ['plan', 'description'],
      render: value4 => {
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
    <ContentWrapper>
      <div className="App" ref={ref}>
        <header className="App-header">
          <div className="header">
            <p style={{ fontSize: '13px', textAlign: 'right' }}>
              Батлав: ______________________ Т.Жамбалцэрэн
            </p>
            <p
              style={{
                marginLeft: '182px',
                marginTop: '-7px',
                fontSize: '12px',
                textAlign: 'right',
              }}
            >
              Хүнс, хөдөө аж ахуй, хөнгөн үйлдвэрийн яамны <br />
              Төрийн нарийн бичгийн дарга <br />
              (Төслийн удирдах хороог төлөөлж)
            </p>

            <p
              style={{
                fontSize: '15px',
                fontWeight: '600',
                textAlign: 'center',
              }}
            >
              МОНГОЛ УЛС: ХӨДӨӨ АЖ АХУЙН ЭДИЙН ЗАСГИЙН ЭРГЭЛТИЙГ НЭМЭГДҮҮЛЭХ
              ТӨСӨЛ
            </p>

            <p
              style={{
                fontSize: '13px',
                marginTop: '-10px',
                fontWeight: '600',
                textAlign: 'center',
              }}
            >
              ҮЙЛ АЖИЛЛАГААНЫ ТӨЛӨВЛӨГӨӨ
            </p>

            <p
              style={{
                fontSize: '11px',
                fontWeight: '600',
                textAlign: 'center',
              }}
            >
              Хамрах хугацаа: {getQueryVariable('year')} оны 1 дүгээр сарын 1 –
              {getQueryVariable('year')} оны 12 дугаар сарын 31
            </p>
            <p
              style={{
                fontSize: '11px',
                textAlign: 'center',
              }}
            >
              Шинэчилсэн огноо: ............... оны ........ сарын .......
              <br />
              Баталсан огноо: ............... оны ...... сарын ........
            </p>
          </div>
        </header>
        <Table
          columns={columns}
          dataSource={referenceId.map((d, i) => ({ key: i, ...d }))}
          pagination={false}
          bordered
          style={{
            marginLeft: '5px',
            marginRight: '5px',
          }}
        />
      </div>
    </ContentWrapper>
  );
});

export default exportPlan;
