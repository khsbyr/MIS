import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState, useContext, useRef } from 'react';
import { message, Button } from 'antd';
import { MSG, PAGESIZE } from '../../constants/Constant';
import { ToolsContext } from '../../context/Tools';
import { getService, putService } from '../../service/service';
import { errorCatch, convertLazyParamsToObj } from '../../tools/Tools';
import ContentWrapper from '../criteria/criteria.style';
import { Confirm } from '../../components/Confirm';

const signUpRequest = () => {
  const toolsStore = useContext(ToolsContext);
  const [list, setList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    page: 0,
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const dt = useRef(null);

  let loadLazyTimeout = null;

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const obj = convertLazyParamsToObj(lazyParams);
      getService('signUpRequest/get', obj)
        .then(result => {
          const datas = result.content || [];
          datas.forEach((item, index) => {
            item.index = lazyParams.page * PAGESIZE + index + 1;
          });
          setTotalRecords(result.totalElements);
          setList(datas);
          setSelectedRows([]);
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

  const indexBodyTemplate = row => (
    <>
      <span className="p-column-title">№</span>
      {row.index}
    </>
  );

  const firstnameBodyTemplate = row => (
    <>
      <span className="p-column-title">Нэр</span>
      {row.user.firstname}
    </>
  );

  const lastnameBodyTemplate = row => (
    <>
      <span className="p-column-title">Овог</span>
      {row.user.lastname}
    </>
  );

  const registerBodyTemplate = row => (
    <>
      <span className="p-column-title">Регистрийн дугаар</span>
      {row.user.register}
    </>
  );

  const emailBodyTemplate = row => (
    <>
      <span className="p-column-title">Й-мэйл</span>
      {row.user.email}
    </>
  );

  const actionBodyTemplate = rowData => {
    const approve = () => {
      if (!rowData) return;
      toolsStore.setIsShowLoader(true);
      putService(`signUpRequest/approve/${rowData.id}`).then(() => {
        message.success(MSG.SUCCESS);
        onInit();
        toolsStore.setIsShowLoader(false);
      });
    };
    const reject = () => {
      if (!rowData) return;
      toolsStore.setIsShowLoader(true);
      putService(`signUpRequest/decline/${rowData.id}`).then(() => {
        message.success(MSG.SUCCESS);
        onInit();
        toolsStore.setIsShowLoader(false);
      });
    };
    return (
      <>
        <Button
          onClick={e => {
            e.preventDefault();
            Confirm(
              approve,
              'Уг хэрэглэгчийг системийн хэрэглэгчээр бүртгэхдээ итгэлтэй байна уу?'
            );
          }}
        >
          Зөвшөөрөх
        </Button>
        <Button
          danger
          style={{ marginLeft: 10 }}
          onClick={e => {
            e.preventDefault();
            Confirm(
              reject,
              'Уг хэрэглэгчийн хүсэлтийг татгалзахдаа итгэлтэй байна уу?'
            );
          }}
        >
          Татгалзах
        </Button>
      </>
    );
  };

  const onPage = event => {
    const params = { ...lazyParams, ...event };
    setLazyParams(params);
  };

  const onSort = event => {
    const params = { ...lazyParams, ...event };
    setLazyParams(params);
  };

  const onFilter = event => {
    const params = { ...lazyParams, ...event };
    params.first = 0;
    setLazyParams(params);
  };

  return (
    <ContentWrapper>
      <div className="button-demo">
        <p className="title">Бүртгүүлэх хүсэлтийн жагсаалт</p>
        <div className="datatable-responsive-demo">
          <DataTable
            value={list}
            removableSort
            paginator
            className="p-datatable-responsive-demo"
            selection={selectedRows}
            editMode="row"
            onSelectionChange={e => {
              setSelectedRows(e.value);
            }}
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
              field="firstname"
              header="Нэр"
              body={firstnameBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              field="lastname"
              header="Овог"
              body={lastnameBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              field="register"
              header="Регистрийн дугаар"
              body={registerBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              field="email"
              header="Й-мэйл"
              body={emailBodyTemplate}
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              field="user.role.name"
              header="Дүр"
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              field="status.status"
              header="Төлөв"
              sortable
              filter
              filterPlaceholder="Хайх"
            />
            <Column
              field=""
              header="Үйлдэл"
              style={{ width: 300, textAlign: 'right' }}
              body={actionBodyTemplate}
            />
          </DataTable>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default signUpRequest;
