import React, { useState, useEffect, useContext } from 'react';
import { Modal, Tree, Alert, message } from 'antd';
import { CheckSquareFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { getService, putService } from '../../../service/service';
import { ToolsContext } from '../../../context/Tools';
import { errorCatch } from '../../../tools/Tools';

let allData = [];

export default function MenuConfig(props) {
  const { t } = useTranslation();
  const { visible, role } = props;
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [roleTree, setRoleTree] = useState([]);
  const toolsStore = useContext(ToolsContext);

  const convertTree = list => {
    const result = list;
    result.forEach(menu => {
      menu.key = menu.id;
      menu.title = menu.name;
      menu.children = convertTree(menu.menus);
    });
    return result.sort((a, b) => (a.priority > b.priority ? 1 : -1));
  };

  useEffect(() => {
    toolsStore.setIsShowLoader(true);
    getService('/menus/get').then(result => {
      const list = result || [];
      allData = convertTree(list);
      setRoleTree(convertTree(list));
      getService(`/menuShows/getByRoleId/${role.id}`)
        .then(Response => {
          if (!Response) return;
          Response.forEach(item => {
            item.key = item.menu?.id;
            if (item.isAccess) checkedKeys.push(item.key);
          });
          setCheckedKeys([...checkedKeys]);
        })
        .finally(() => toolsStore.setIsShowLoader(false));
    });
  }, []);

  const onCheck = checkedKeysValue => {
    setCheckedKeys(checkedKeysValue);
  };

  const save = () => {
    const saveData = [];
    allData.forEach(item => {
      const isAccess = !!checkedKeys.includes(item.id);
      saveData.push({
        isAccess,
        role: { id: role.id },
        menu: { id: item.id },
      });
    });

    toolsStore.setIsShowLoader(true);
    putService('/menuShows/update', saveData)
      .then(() => {
        props.close();
        toolsStore.setIsShowLoader(false);
        message.success('Амжилттай хадгалагдлаа');
      })
      .catch(error => {
        toolsStore.setIsShowLoader(false);
        errorCatch(error);
      });
  };

  return (
    <Modal
      title={t('Set the menu')}
      className="permission"
      visible={visible}
      centered
      width={700}
      okText={t('Save')}
      cancelText={t('Cancel')}
      bodyStyle={{ height: '70vh' }}
      onOk={save}
      onCancel={() => props.close()}
    >
      <h2>{role?.name}</h2>
      <p>
        <Alert
          message="Зөвхөн тухайн дүрд хамаарах цэсүүдийг сонгоно уу"
          type="info"
          icon={<CheckSquareFilled />}
          showIcon
        />
      </p>
      <Tree
        checkable
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        treeData={roleTree}
      />
    </Modal>
  );
}
