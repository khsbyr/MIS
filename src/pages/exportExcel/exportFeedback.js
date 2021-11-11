import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Layout, Row, Tooltip } from 'antd';
import moment from 'moment';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToolsStore } from '../../context/Tools';
import { getService } from '../../service/service';
import { errorCatch } from '../../tools/Tools';
import ContentWrapper from './style';

const { Content } = Layout;

let loadLazyTimeout = null;

const ExportFeedback = () => {
  const { t } = useTranslation();
  const toolsStore = useToolsStore();
  const [list, setList] = useState([]);
  const [lazyParams] = useState({
    first: 0,
    page: 0,
  });
  const dt = useRef(null);
  const PAGESIZE = 25;

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      getService(`/feedback/getList`)
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

  const birthDate = row => (
    <>
      {moment(row && row.feedbackDate)
        .zone(0)
        .format('YYYY-MM-DD')}
    </>
  );

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  return (
    <ContentWrapper>
      <div className="button-demo">
        <Content>
          <Row>
            <Col xs={24} md={12} lg={14}>
              <p className="title">Санал гомдол, санал хүсэлт</p>
            </Col>
            <Col xs={18} md={12} lg={10}>
              <Row justify="end" gutter={[16, 16]}>
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
            emptyMessage="Өгөгдөл олдсонгүй..."
            className="p-datatable-responsive-demo"
          >
            <Column field="index" header="№" style={{ width: 80 }} />
            <Column field="complainant" header="Санал, гомдол гаргагч" />
            <Column
              field="registerNumber"
              header="Санал, гомдол гаргагчийн регистр"
            />
            <Column
              field="complainantEmail"
              header="Санал, гомдол гаргагчийн и-мэйл"
            />
            <Column
              field="phoneNumber"
              header="Санал, гомдол гаргагчийн утас"
            />
            <Column
              field="addressDetail"
              header="Санал, гомдол гаргагчийн хаяг"
            />
            <Column
              field="feedbackDate"
              header="Хүлээн авсан огноо"
              body={birthDate}
            />
            <Column
              field="description"
              header="Санал, гомдлын агуулга
"
            />
            <Column
              field="measures"
              header="Авсан арга хэмжээ
"
            />
          </DataTable>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default ExportFeedback;
