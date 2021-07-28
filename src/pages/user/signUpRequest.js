import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState, useContext } from 'react';
import { message, Button } from 'antd';
import { MSG } from '../../constants/Constant';
import { ToolsContext } from '../../context/Tools';
import { getService, putService } from '../../service/service';
import { errorCatch } from '../../tools/Tools';
import ContentWrapper from '../criteria/criteria.style';
import { Confirm } from '../../components/Confirm';

const User = () => {
  const toolsStore = useContext(ToolsContext);
  const loadLazyTimeout = null;
  const [list, setList] = useState([]);
  const [lazyParams] = useState({
    page: 0,
  });
  const PAGESIZE = 20;
  const [selectedRows, setSelectedRows] = useState([]);

  const onInit = () => {
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    toolsStore.setIsShowLoader(true);
    getService('signUpRequest/get', list)
      .then(result => {
        const datas = result || [];
        datas.forEach((item, index) => {
          item.index = lazyParams.page * PAGESIZE + index + 1;
        });
        setList(datas);
        setSelectedRows([]);
      })
      .finally(toolsStore.setIsShowLoader(false))
      .catch(error => {
        errorCatch(error);
        toolsStore.setIsShowLoader(false);
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

  return (
    <ContentWrapper>
      <div className="button-demo">
        <p className="title">Хэрэглэгчийн жагсаалт</p>
        <div className="datatable-responsive-demo">
          <DataTable
            value={list}
            removableSort
            paginator
            rows={10}
            className="p-datatable-responsive-demo"
            selection={selectedRows}
            editMode="row"
            onSelectionChange={e => {
              setSelectedRows(e.value);
            }}
            dataKey="id"
          >
            <Column
              field="index"
              header="№"
              body={indexBodyTemplate}
              sortable
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
            />
            <Column
              field="email"
              header="Й-мэйл"
              body={emailBodyTemplate}
              sortable
            />
            <Column field="user.role.name" header="Дүр" sortable />
            <Column field="status.status" header="Төлөв" sortable />
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

export default User;
