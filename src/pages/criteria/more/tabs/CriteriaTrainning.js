import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useToolsStore } from '../../../../context/Tools';
import { getService } from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import ContentWrapper from '../../criteria.style';

const CriteriaTrainning = props => {
  const loadLazyTimeout = null;
  const [list, setList] = useState([]);
  const [lazyParams] = useState({
    page: 0,
  });
  const PAGESIZE = 20;
  const { setIsShowLoader } = useToolsStore();

  const history = useHistory();

  const onInit = () => {
    setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    getService(`/criteria/getById/${props.id}`)
      .then(result => {
        const listResult = result.training || [];
        listResult.forEach((item, index) => {
          item.index = lazyParams.page * PAGESIZE + index + 1;
        });
        setList(listResult);
      })
      .finally(setIsShowLoader(false))
      .catch(error => {
        errorCatch(error);
        setIsShowLoader(false);
      });
  };

  useEffect(() => {
    onInit();
  }, [lazyParams]);

  const indexBodyTemplate = row => (
    <>
      <span className="p-column-title">№</span>
      {row.index}
    </>
  );

  const NameBodyTemplate = row => (
    <>
      <span className="p-column-title">Сургалтын нэр</span>
      {row.name}
    </>
  );

  const totalBudgetBodyTemplate = row => (
    <>
      <span className="p-column-title">Төсөв</span>
      {row.trainingBudget && row.trainingBudget.totalBudget}
    </>
  );

  const performanceBudgetBodyTemplate = row => (
    <>
      <span className="p-column-title">Гүйцэтгэлийн төсөв</span>
      {row.trainingBudget && row.trainingBudget.performanceBudget}
    </>
  );

  const startDateBodyTemplate = row => (
    <>
      <span className="p-column-title">Эхэлсэн огноо</span>
      {row.startDateFormat}
    </>
  );

  const endDateBodyTemplate = row => (
    <>
      <span className="p-column-title">Дууссан огноо</span>
      {row.endDateFormat}
    </>
  );

  const participantBodyTemplate = row => (
    <>
      <span className="p-column-title">Оролцогчдын тоо</span>
      {row.totalParticipants}
    </>
  );

  const ShowTrainingInfo = row => history.push(`/trainingList/${row.data.id}`);

  return (
    <ContentWrapper>
      <div className="button-demo">
        <div className="datatable-responsive-demo">
          <DataTable
            value={list}
            removableSort
            paginator
            rows={10}
            className="p-datatable-responsive-demo"
            onRowClick={ShowTrainingInfo}
            dataKey="id"
          >
            <Column
              field="index"
              header="№"
              body={indexBodyTemplate}
              style={{ width: 40 }}
            />
            <Column
              header="Сургалтын сэдэв"
              filter
              body={NameBodyTemplate}
              sortable
            />
            <Column
              header="Төсөв"
              headerStyle={{ width: '10rem' }}
              filter
              body={totalBudgetBodyTemplate}
            />
            <Column
              header="Гүйцэтгэлийн төсөв"
              headerStyle={{ width: '10rem' }}
              filter
              body={performanceBudgetBodyTemplate}
            />
            <Column
              header="Эхэлсэн огноо"
              headerStyle={{ width: '10rem' }}
              filter
              body={startDateBodyTemplate}
            />
            <Column
              header="Дууссан огноо"
              headerStyle={{ width: '10rem' }}
              filter
              body={endDateBodyTemplate}
            />
            <Column
              header="Оролцогчдын тоо"
              headerStyle={{ width: '10rem' }}
              filter
              body={participantBodyTemplate}
            />
          </DataTable>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default CriteriaTrainning;
