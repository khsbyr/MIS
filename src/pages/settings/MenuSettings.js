// import React, { useState, useEffect, Suspense, useContext } from 'react';
// import { TreeTable } from 'primereact/treetable';
// import { Column } from 'primereact/column';
// import { Button, message, Layout, Checkbox, Tooltip } from 'antd';
// import {
//   FolderAddFilled,
//   DeleteFilled,
//   CaretUpOutlined,
//   CaretDownOutlined,
// } from '@ant-design/icons';
// import { ToolsContext } from '../../context/Tools';
// import { errorCatch, isEmptyObject, sortArray } from '../../tools/Tools';
// import {
//   deleteService,
//   getService,
//   patchService,
//   postService,
//   putService,
// } from '../../service/Service';
// import MenuModal from './components/MenuModal';
// import { Confirm } from '../../components/Confirm';
// import style from './style.module.scss';
// import { MSG } from '../../constants/Constant';

// let isEditMode;
// const url = '/gap-core-service/menus';

// export default function MenuSettings() {
//   const toolsStore = useContext(ToolsContext);
//   const [menuList, setMenuList] = useState([]);
//   const [selectedMenus, setSelectedMenus] = useState([]);
//   const [isShowModal, setIsShowModal] = useState(false);
//   const [selectedRow, setSelectedRow] = useState({});

//   const convertTree = listArg => {
//     const list = listArg.filter(row => row.status);
//     list.forEach(menu => {
//       menu.key = menu.id;
//       menu.data = menu;
//       menu.children = convertTree(menu.menus);
//     });
//     return sortArray(list, 'priority');
//   };

//   const loadData = () => {
//     toolsStore.setIsShowLoader(true);
//     const param = { search: 'isParent:true', sort: 'priority,asc' };
//     getService(url, param)
//       .then(data => {
//         const list = data.content || [];
//         setMenuList(convertTree(list));
//         setSelectedMenus([]);
//         toolsStore.setIsShowLoader(false);
//       })
//       .catch(error => {
//         message.error(error.message);
//         toolsStore.setIsShowLoader(false);
//       });
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   const save = menu => {
//     toolsStore.setIsShowLoader(true);
//     if (isEditMode) {
//       putService(`${url}/${menu.id}`, menu)
//         .then(() => {
//           setIsShowModal(false);
//           loadData();
//         })
//         .catch(error => {
//           errorCatch(error);
//           toolsStore.setIsShowLoader(false);
//         });
//     } else {
//       postService(url, menu)
//         .then(() => {
//           setIsShowModal(false);
//           setSelectedRow({});
//           loadData();
//         })
//         .catch(error => {
//           errorCatch(error);
//           toolsStore.setIsShowLoader(false);
//         });
//     }
//   };

//   function deleteMenuPromise() {
//     return new Promise((resolve, reject) => {
//       Object.entries(selectedMenus).forEach(([key, menu]) => {
//         if (menu.checked) {
//           deleteService(`${url}/${key}`)
//             .then(() => resolve('ok'))
//             .catch(error => {
//               reject(error);
//             });
//         }
//       });
//     });
//   }

//   async function deleteData() {
//     toolsStore.setIsShowLoader(true);
//     try {
//       await deleteMenuPromise().then(result => {
//         if (result === 'ok') {
//           message.success(MSG.SUCCESS_DEL);
//           loadData();
//         }
//       });
//     } catch (error) {
//       errorCatch(error);
//     } finally {
//       toolsStore.setIsShowLoader(false);
//     }
//   }

//   const add = () => {
//     setIsShowModal(true);
//     isEditMode = false;
//   };

//   const remove = () => {
//     if (isEmptyObject(selectedMenus)) {
//       message.warning('Устгах өгөгдлөө сонгоно уу');
//       return;
//     }
//     Confirm(deleteData);
//   };

//   const onSelecttion = e => {
//     e.originalEvent.preventDefault();
//     e.originalEvent.stopPropagation();
//     // e.stopPropagation();
//     setSelectedMenus(e.value);
//   };

//   const edit = row => {
//     isEditMode = true;
//     setIsShowModal(true);
//     setSelectedRow(row.node);
//   };

//   const activeBodyTemplate = rowData => (
//     <Checkbox defaultChecked={rowData.isSeparator} disabled />
//   );

//   const priorityBodyTemplate = row => {
//     const priorityChange = (e, isUp) => {
//       e.preventDefault();
//       e.stopPropagation();
//       const serviceName = isUp ? 'priorityUp' : 'priorityDown';
//       patchService(`${url}/${serviceName}/${row.id}`).then(() => {
//         loadData();
//       });
//     };
//     return (
//       <div className={style.priority}>
//         <Tooltip placement="left" title="Дээш">
//           <Button
//             icon={<CaretUpOutlined />}
//             size="small"
//             className={style.priorityBtn}
//             onClick={e => priorityChange(e, true)}
//           />
//         </Tooltip>
//         <Tooltip placement="left" title="Доош">
//           <Button
//             icon={<CaretDownOutlined />}
//             size="small"
//             className={style.priorityBtn}
//             onClick={e => priorityChange(e, false)}
//           />
//         </Tooltip>
//       </div>
//     );
//   };

//   return (
//     <div>
//       <div className="btn-layout">
//         <Button type="link" icon={<FolderAddFilled />} onClick={add}>
//           Нэмэх
//         </Button>
//         <Button type="link" icon={<DeleteFilled />} onClick={remove}>
//           Устгах
//         </Button>
//         {/* <Button type="link" icon={<FileExcelFilled />}>
//                     Экспорт
//                 </Button>
//                 <Button type="link" icon={<PrinterFilled />}>
//                     Хэвлэх
//                 </Button> */}
//       </div>
//       <Layout className="Hynax-table">
//         <TreeTable
//           value={menuList}
//           selectionMode="checkbox"
//           selectionKeys={selectedMenus}
//           onSelectionChange={onSelecttion}
//           onRowClick={edit}
//         >
//           <Column
//             field="priority"
//             header="Дараалал"
//             style={{ width: '60px' }}
//           />
//           <Column field="name" header="Цэсний нэр" expander filter />
//           <Column field="description" header="Нэр" filter />
//           <Column
//             field="url"
//             header="Цэсний URL хаяг"
//             filter
//             style={{ width: '20%' }}
//           />
//           <Column
//             field="isSeparator"
//             header="Холбоостой эсэх"
//             style={{ width: 80, textAlign: 'center' }}
//             body={activeBodyTemplate}
//           />
//           <Column
//             field=""
//             header="Дараалал өөрчлөх"
//             style={{ width: 100 }}
//             body={priorityBodyTemplate}
//           />
//         </TreeTable>
//       </Layout>
//       {isShowModal && (
//         <Suspense fallback={<div>...</div>}>
//           <MenuModal
//             visible={isShowModal}
//             isEditMode={isEditMode}
//             editValue={selectedRow}
//             close={() => setIsShowModal(false)}
//             save={save}
//           />
//         </Suspense>
//       )}
//     </div>
//   );
// }
