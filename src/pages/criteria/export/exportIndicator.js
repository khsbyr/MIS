import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, DatePicker, Layout, Row, Tooltip } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToolsStore } from '../../../context/Tools';
import { getService } from '../../../service/service';
import { errorCatch, formatIndicator } from '../../../tools/Tools';
import ContentWrapper from '../../exportExcel/style';

const { Content } = Layout;

let loadLazyTimeout = null;

const exportIndicators = () => {
  const { t } = useTranslation();
  const toolsStore = useToolsStore();
  const [list, setList] = useState([]);
  const [lazyParams] = useState({
    first: 0,
    page: 0,
  });
  const dt = useRef(null);

  const PAGESIZE = 25;

  const onInit = value => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const url = value
        ? `/criteria/getList?stringDate=${value}`
        : `/criteria/getList?stringDate=`;
      getService(`${url}`)
        .then(result => {
          const listResult = result;
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
    }, 500);
  };

  useEffect(() => {
    onInit();
  }, [lazyParams]);

  const indicatorProcessBodyTemplate = row => (
    <>{row.resultTobeAchieved + formatIndicator(row.indicator)}</>
  );

  const upIndicatorBodyTemplate = row => (
    <>{row.processResult + formatIndicator(row.indicator)}</>
  );

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  function selectedQ(date, dateString) {
    onInit(dateString);
  }

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Content>
          <Row>
            <Col xs={24} md={12} lg={14}>
              <p className="title">?????????????? ????????????????</p>
            </Col>
            <Col xs={18} md={12} lg={10}>
              <Row justify="end" gutter={[16, 16]}>
                <Col>
                  <DatePicker
                    picker="quarter"
                    className="datepicker"
                    placeholder="???????????? ????????????"
                    style={{
                      border: 'none',
                    }}
                    onChange={selectedQ}
                  />
                </Col>
                <Col>
                  <Tooltip title={t('export')} arrowPointAtCenter>
                    <Button
                      type="text"
                      className="export"
                      icon={<FontAwesomeIcon icon={faFileExcel} />}
                      onClick={exportCSV}
                    >
                      {' '}
                    </Button>
                  </Tooltip>
                </Col>
              </Row>
            </Col>
          </Row>
        </Content>
        <div className="datatable-responsive-demo">
          <DataTable
            ref={dt}
            value={list}
            lazy
            first={lazyParams.first}
            sortField={lazyParams.sortField}
            sortOrder={lazyParams.sortOrder}
            filters={lazyParams.filters}
            emptyMessage="?????????????? ??????????????????..."
            className="p-datatable-responsive-demo"
          >
            <Column field="index" header="??????" style={{ width: 80 }} />
            <Column field="name" header="?????????????? ?????????????????????? ??????" />
            <Column field="englishName" header="?????????????? ?????????????????????? ??????" />
            <Column
              field="resultTobeAchieved"
              header="?????????? ???? ??????"
              body={indicatorProcessBodyTemplate}
            />
            <Column
              field="processResult"
              header="???? ?????????????? ??????????????"
              body={upIndicatorBodyTemplate}
            />
            <Column field="criteriaReference.name" header="??????????????????????" />
            <Column field="description" header="??????????????" />
            <Column field="sourceOfInformation" header="???????????????????? ???? ????????????" />
            <Column
              field="dataCollectionMethodology"
              header="???????????????? ?????????????????? ????????????????"
            />
            <Column field="unitOfResponsibility" header="???????????????? ????????" />
          </DataTable>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default exportIndicators;
