import React, { useState, useRef, useEffect, Suspense } from "react";
import { PAGESIZE } from "../../tools/Constant";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { isShowLoading } from "../../context/Tools";
import { Button, message, Layout, Checkbox } from "antd";
import { convertLazyParamsToObj, errorCatch } from "../../tools/Tools";
import { getService, postService, putService } from "../../service/service";
import {
  FolderAddFilled,
  PrinterFilled,
  FileExcelFilled,
} from "@ant-design/icons";
import RoleModal from "./components/RoleModal";
const RoleConfig = React.lazy(() => import("./components/RoleConfig"));
const MenuConfig = React.lazy(() => import("./components/MenuConfig"));

var isEditMode, selectedRole;
const url = "role/get";

export default function Roles() {
  const [totalRecords, setTotalRecords] = useState(0);
  const [list, setList] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowConfig, setIsShowConfig] = useState(false);
  const [isShowConfigMenu, setIsShowConfigMenu] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    page: 0,
  });
  const dt = useRef(null);

  let loadLazyTimeout = null;

  useEffect(() => {
    loadData();
  }, [lazyParams]);

  const loadData = () => {
    isShowLoading(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    loadLazyTimeout = setTimeout(() => {
      const obj = convertLazyParamsToObj(lazyParams);
      getService(url, obj)
        .then((data) => {
          let list = data || [];
          list.map((item, index) =>
            (item.index = lazyParams.page * PAGESIZE + index + 1)
          );
          setTotalRecords(data.totalElements);
          setList(list);
          isShowLoading(false);
        })
        .catch((error) => {
          message.error(error.toString());
          isShowLoading(false);
        });
    }, 500);
  };

  const save = (role) => {
    if (isEditMode)
      putService(`${url}/${role.id}`, role)
        .then((result) => {
          setIsShowModal(false);
          loadData();
        })
        .catch((error) => errorCatch(error));
    else
      postService(url, role)
        .then((result) => {
          setIsShowModal(false);
          setSelectedRow({});
          loadData();
        })
        .catch((error) => errorCatch(error));
  };

  const onPage = (event) => {
    let _lazyParams = { ...lazyParams, ...event };
    setLazyParams(_lazyParams);
  };

  const onSort = (event) => {
    let _lazyParams = { ...lazyParams, ...event };
    setLazyParams(_lazyParams);
  };

  const onFilter = (event) => {
    let _lazyParams = { ...lazyParams, ...event };
    _lazyParams["first"] = 0;
    setLazyParams(_lazyParams);
  };

  const add = () => {
    setIsShowModal(true);
    isEditMode = false;
  };

  const edit = (row) => {
    isEditMode = true;
    setIsShowModal(true);
    setSelectedRow(row.data);
  };

  const activeBodyTemplate = (rowData) => {
    return <Checkbox defaultChecked={rowData.isActive} disabled />;
  };

  const roleBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsShowConfig(true);
            selectedRole = rowData;
          }}
        >
          Эрх тавих
        </Button>
        <Button
          style={{ marginLeft: 10 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsShowConfigMenu(true);
            selectedRole = rowData;
          }}
        >
          Цэс тохируулах
        </Button>
      </>
    );
  };

  return (
    <div>
      <div className="btn-layout">
        <Button type="link" icon={<FolderAddFilled />} onClick={add}>
          Нэмэх
        </Button>
        <Button type="link" icon={<FileExcelFilled />}>
          Экспорт
        </Button>
        <Button type="link" icon={<PrinterFilled />}>
          Хэвлэх
        </Button>
      </div>
      <Layout className="Hynax-table">
        <DataTable
          ref={dt}
          value={list}
          lazy
          paginator
          first={lazyParams.first}
          rows={PAGESIZE}
          totalRecords={totalRecords}
          onPage={onPage}
          onSort={onSort}
          sortField={lazyParams.sortField}
          sortOrder={lazyParams.sortOrder}
          onFilter={onFilter}
          filters={lazyParams.filters}
          emptyMessage="Өгөгдөл олдсонгүй..."
          tableStyle={{ minWidth: 1000 }}
          onRowClick={edit}
        >
          <Column field="index" header="№" style={{ width: 40 }} />
          <Column field="name" header="Дүрийн нэр" sortable filter />
          <Column
            field="isActive"
            header="Идэвхтэй эсэх"
            sortable
            style={{ width: '25%', textAlign: 'center' }}
            body={activeBodyTemplate}
          />
          <Column
            field=""
            header="Үйлдэл"
            style={{ width: 300, textAlign: "right" }}
            body={roleBodyTemplate}
          />
        </DataTable>
      </Layout>
      {isShowModal && (
        <RoleModal
          visible={isShowModal}
          isEditMode={isEditMode}
          editValue={selectedRow}
          close={() => setIsShowModal(false)}
          save={save}
        />
      )}
      {isShowConfig && selectedRole && (
        <Suspense fallback={<div>...</div>}>
          <RoleConfig
            visible={isShowConfig}
            role={selectedRole}
            close={() => setIsShowConfig(false)}
          />
        </Suspense>
      )}
      {isShowConfigMenu && selectedRole && (
        <Suspense fallback={<div>...</div>}>
          <MenuConfig
            visible={isShowConfigMenu}
            role={selectedRole}
            close={() => setIsShowConfigMenu(false)}
          />
        </Suspense>
      )}
    </div>
  );
}
