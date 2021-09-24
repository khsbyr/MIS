import moment from 'moment';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { PAGESIZE } from '../../../../constants/Constant';
import { ToolsContext, useToolsStore } from '../../../../context/Tools';
import { getService } from '../../../../service/service';
import { convertLazyParamsToObj, errorCatch } from '../../../../tools/Tools';
import ContentWrapper from '../../criteria.style';

const CriteriaProject = props => {
  const [list, setList] = useState([]);
  const { setIsShowLoader } = useToolsStore();
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    page: 0,
    size: PAGESIZE || 20,
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const dt = useRef(null);
  const toolsStore = useContext(ToolsContext);
  let loadLazyTimeout = null;
  const history = useHistory();

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const obj = convertLazyParamsToObj(lazyParams);
      getService(`/project/getListByCriteria/${props.id}`, obj)
        .then(result => {
          const listResult = result.content || [];
          listResult.forEach((item, index) => {
            item.index = lazyParams.page * PAGESIZE + index + 1;
          });
          setTotalRecords(result.totalElements);
          setList(listResult);
        })
        .finally(setIsShowLoader(false))
        .catch(error => {
          errorCatch(error);
          setIsShowLoader(false);
        });
    }, 500);
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
      <span className="p-column-title">Төслийн нэр</span>
      {row.projectName}
    </>
  );

  const userBodyTemplate = row => (
    <>
      <span className="p-column-title">Хариуцсан хүн</span>
      {row.nameOfAuthorizedPerson}
    </>
  );

  const dateBodyTemplate = row => (
    <>
      <span className="p-column-title">Төсөл хэрэгжүүлэх хугацаа</span>
      {row.period} сар
    </>
  );

  const dateSentBodyTemplate = row => (
    <>
      <span className="p-column-title">Төсөл ирүүлсэн огноо</span>
      {moment(row.createdDate && row.createdDate).format('YYYY-M-D')}
    </>
  );

  const ShowProjectInfo = row => history.push(`/projectList/${row.data.id}`);

  const onPage = event => {
    const params = { ...lazyParams, ...event };
    setLazyParams(params);
  };

  const onSort = event => {
    const params = { ...lazyParams, ...event };
    setLazyParams(params);
  };

  const onFilter = event => {
    const params = { ...lazyParams, ...event, page: 0 };
    setLazyParams(params);
  };

  return (
    <ContentWrapper>
      <div className="button-demo">
        <div className="datatable-responsive-demo">
          <DataTable
            emptyMessage="Өгөгдөл олдсонгүй..."
            value={list}
            removableSort
            paginator
            className="p-datatable-responsive-demo"
            onRowClick={ShowProjectInfo}
            dataKey="id"
            ref={dt}
            lazy
            first={lazyParams.first}
            rows={PAGESIZE}
            totalRecords={totalRecords}
            onPage={onPage}
            onSort={onSort}
            sortField={lazyParams.sortField}
            sortOrder={lazyParams.sortOrder}
            onFilter={onFilter}
            filters={lazyParams.filters}
          >
            <Column
              field="index"
              header="№"
              body={indexBodyTemplate}
              style={{ width: 40 }}
            />
            <Column
              header="Төслийн нэр"
              field="projectName"
              filter
              body={NameBodyTemplate}
              sortable
              filterPlaceholder="Хайх"
              filterMatchMode="contains"
            />
            <Column
              header="Хариуцсан хүн"
              field="nameOfAuthorizedPerson"
              filter
              sortable
              body={userBodyTemplate}
              filterPlaceholder="Хайх"
              filterMatchMode="contains"
            />
            <Column
              header="Төсөл хэрэгжүүлэх хугацаа"
              field="period"
              filter
              sortable
              body={dateBodyTemplate}
              filterPlaceholder="Хайх"
            />
            <Column
              header="Төсөл ирүүлсэн огноо"
              field="createdDate"
              sortable
              body={dateSentBodyTemplate}
            />
            {/* <Column header="Статус" body={statusBodyTemplate} sortable />
            <Column headerStyle={{ width: '6rem' }} body={action} /> */}
          </DataTable>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default CriteriaProject;
