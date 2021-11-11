import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ToolsContext } from '../../context/Tools';
import { getService } from '../../service/service';
import { errorCatch } from '../../tools/Tools';
import './report.style.css';

const exportReport = React.forwardRef((props, ref) => {
  const toolsStore = useContext(ToolsContext);
  const [list, setList] = useState([]);
  const loadLazyTimeout = null;
  const [lazyParams] = useState({
    page: 0,
  });
  const PAGESIZE = 20;
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

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    getService(`planReport/getList${location.search}`)
      .then(result => {
        const listResult = result || [];
        listResult.forEach((item, index) => {
          item.index = lazyParams.page * PAGESIZE + index + 1;
        });
        setList(listResult);
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

  return (
    <div className="containerr" ref={ref}>
      <h1 className="titler">
        МАЛ АЖ АХУЙН ЭДИЙН ЗАСГИЙН ЭРГЭЛТИЙГ НЭМЭГДҮҮЛЭХ <br /> ТӨСЛИЙН
        (6508-MN) {getQueryVariable('year')} САРЫН ТАЙЛАН
      </h1>
      {list.map(z => (
        <>
          <div className="tabler">
            <table
              className="tableContainer"
              align="center"
              style={{ width: '100%', marginTop: '30px' }}
            >
              <tbody>
                <tr className="tableTr">
                  <th
                    style={{
                      width: '30%',
                      paddingLeft: '20px',
                      textAlign: 'left',
                    }}
                    className="tableTh"
                  >
                    Албан тушаал
                  </th>
                  <td align="left" style={{ paddingLeft: '20px' }}>
                    {z.user.position}
                  </td>
                </tr>
                <tr className="tableTr">
                  <th
                    style={{
                      width: '30%',
                      paddingLeft: '20px',
                      textAlign: 'left',
                    }}
                    className="tableTh"
                  >
                    Нэр
                  </th>
                  <td align="left" style={{ paddingLeft: '20px' }}>
                    {z.user.firstname}
                  </td>
                </tr>

                <tr className="tableTr">
                  <th
                    style={{
                      width: '30%',
                      paddingLeft: '20px',
                      textAlign: 'left',
                    }}
                    className="tableTh"
                  >
                    И-мэйл хаяг
                  </th>
                  <td align="left" style={{ paddingLeft: '20px' }}>
                    {z.user.email}
                  </td>
                </tr>

                <tr className="tableTr">
                  <th
                    style={{
                      width: '30%',
                      paddingLeft: '20px',
                      textAlign: 'left',
                    }}
                    className="tableTh"
                  >
                    Төслийн нэгжийн байршил, утас/факс
                  </th>
                  <td align="left" style={{ paddingLeft: '20px' }}>
                    Монгол Улс, Улаанбаатар, Сүхбаатар дүүрэг, 1-р хороо, Парк
                    плэйс оффис, 602 тоот Утас: 70104041, 70104042
                  </td>
                </tr>

                <tr className="tableTr">
                  <th
                    style={{
                      width: '30%',
                      paddingLeft: '20px',
                      textAlign: 'left',
                    }}
                    className="tableTh"
                  >
                    Төсөл эхлэх, дуусах, сунгасан хугацаа
                  </th>
                  <td align="left" style={{ paddingLeft: '20px' }}>
                    777-777-7777
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '20px' }}>
            <p
              style={{
                textTransform: 'uppercase',
                fontSize: '16px',
                textDecoration: 'underline',
              }}
            >
              БҮРЭЛДЭХҮҮН ХЭСЭГ: {z.plan.criteriaReference.name}
            </p>
          </div>

          <div style={{ display: 'flex' }}>
            <p style={{ fontSize: '16px', paddingRight: '20px' }}>
              Төлөвлөгөө:
            </p>
            <p style={{ fontSize: '16px' }}>{z.plan.name} </p>
          </div>

          <div style={{ display: 'flex' }}>
            <p style={{ fontSize: '16px', paddingRight: '34px' }}>Гүйцэтгэл:</p>
            <p style={{ fontSize: '16px' }}>{z.performance} </p>
          </div>
        </>
      ))}
    </div>
  );
});

export default exportReport;
