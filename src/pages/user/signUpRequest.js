import { message, Select, Tag } from 'antd';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { PAGESIZE } from '../../constants/Constant';
import { ToolsContext } from '../../context/Tools';
import { getService, putService } from '../../service/service';
import { convertLazyParamsToObj, errorCatch } from '../../tools/Tools';
import ContentWrapper from '../criteria/criteria.style';

const { Option } = Select;

const signUpRequest = () => {
  const toolsStore = useContext(ToolsContext);
  const [list, setList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    page: 0,
    size: PAGESIZE || 20,
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const dt = useRef(null);
  const [status, setStatus] = useState();
  const [requestId, setRequestId] = useState();

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
    getService('signUpStatus/get').then(result => {
      if (result) {
        setStatus(result.content || []);
      }
    });
  }, [lazyParams]);

  const indexBodyTemplate = row => (
    <>
      <span className="p-column-title">???</span>
      {row.index}
    </>
  );

  const firstnameBodyTemplate = row => (
    <>
      <span className="p-column-title">??????</span>
      {row.user.firstname ? row.user?.firstname : '??????????????????????'}
    </>
  );

  const lastnameBodyTemplate = row => (
    <>
      <span className="p-column-title">????????</span>
      {row.user.lastname ? row.user?.lastname : '??????????????????????'}
    </>
  );

  const registerBodyTemplate = row => (
    <>
      <span className="p-column-title">???????????????????? ????????????</span>
      {row.user.register ? row.user?.register : '??????????????????????'}
    </>
  );

  const emailBodyTemplate = row => (
    <>
      <span className="p-column-title">??-????????</span>
      {row.user.email ? row.user?.email : '??????????????????????'}
    </>
  );

  const onChangeStatus = value => {
    const datas = {
      statusId: value,
      signUpRequestId: requestId,
    };
    putService(`signUpRequest/updateStatus`, datas)
      .then(() => {
        message.success('?????????????????? ??????????????????');
      })
      .catch(error => {
        errorCatch(error);
      });
  };

  const selectedStatus = (event, row) => {
    event.preventDefault();
    event.stopPropagation();
    setRequestId(row.id);
  };

  const getColor = id => {
    switch (id) {
      case 1:
        return 'processing';
      case 2:
        return 'success';
      case 3:
        return 'error';
      default:
        return 'processing';
    }
  };

  const statusBodyTemplate = row => (
    <>
      <span className="p-column-title">????????????</span>
      <Select
        defaultValue={
          <Tag color={getColor(row.status.id)}>{row.status.status}</Tag>
        }
        onChange={onChangeStatus}
        onClick={event => selectedStatus(event, row)}
        style={{ width: '90%', background: 'unset' }}
      >
        {status?.map(z => (
          <Option key={z.id}>
            <Tag color={getColor(z.id)}>{z.status}</Tag>
          </Option>
        ))}
      </Select>
    </>
  );

  // const statusBodyTemplate = rowData => {
  //   const approve = () => {
  //     if (!rowData) return;
  //     toolsStore.setIsShowLoader(true);
  //     putService(`signUpRequest/approve/${rowData.id}`).then(() => {
  //       message.success(MSG.SUCCESS);
  //       onInit();
  //       toolsStore.setIsShowLoader(false);
  //     });
  //   };
  //   const reject = () => {
  //     if (!rowData) return;
  //     toolsStore.setIsShowLoader(true);
  //     putService(`signUpRequest/decline/${rowData.id}`).then(() => {
  //       message.success(MSG.SUCCESS);
  //       onInit();
  //       toolsStore.setIsShowLoader(false);
  //     });
  //   };

  //   return (
  //     <>
  //       <Button
  //         onClick={e => {
  //           e.preventDefault();
  //           Confirm(
  //             approve,
  //             '???? ???????????????????????? ?????????????????? ???????????????????????? ???????????????????? ???????????????? ?????????? ?????'
  //           );
  //         }}
  //       >
  //         ??????????????????
  //       </Button>
  //       <Button
  //         danger
  //         style={{ marginLeft: 10 }}
  //         onClick={e => {
  //           e.preventDefault();
  //           Confirm(
  //             reject,
  //             '???? ???????????????????????? ?????????????????? ???????????????????????? ???????????????? ?????????? ?????'
  //           );
  //         }}
  //       >
  //         ??????????????????
  //       </Button>
  //     </>
  //   );
  // };

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
        <p className="title">???????????????????? ?????????????????? ????????????????</p>
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
              header="???"
              body={indexBodyTemplate}
              style={{ width: 40 }}
            />
            <Column
              field="user.firstname"
              header="??????"
              body={firstnameBodyTemplate}
              sortable
              filter
              filterPlaceholder="????????"
              filterMatchMode="contains"
            />
            <Column
              field="user.lastname"
              header="????????"
              body={lastnameBodyTemplate}
              sortable
              filter
              filterPlaceholder="????????"
              filterMatchMode="contains"
            />
            <Column
              field="user.register"
              header="???????????????????? ????????????"
              body={registerBodyTemplate}
              sortable
              filter
              filterPlaceholder="????????"
              filterMatchMode="contains"
            />
            <Column
              field="user.email"
              header="??-????????"
              body={emailBodyTemplate}
              sortable
              filter
              filterPlaceholder="????????"
              filterMatchMode="contains"
            />
            <Column
              field="user.role.name"
              header="??????"
              sortable
              filter
              filterPlaceholder="????????"
              filterMatchMode="contains"
            />
            <Column
              field="status.status"
              header="??????????"
              body={statusBodyTemplate}
              sortable
              filter
              filterPlaceholder="????????"
            />
          </DataTable>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default signUpRequest;
