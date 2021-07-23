import React, { useState, useEffect, useContext } from 'react';
import { Modal, Tree, Alert, message } from 'antd';
import { CheckSquareFilled } from '@ant-design/icons';
import { getService, postService } from '../../../service/service';
import { ToolsContext } from '../../../context/Tools';
import { errorCatch } from '../../../tools/Tools';

let oldData = [];

export default function RoleConfig(props) {
  const { visible, role } = props;
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [roleTree, setRoleTree] = useState([]);
  const toolsStore = useContext(ToolsContext);

  useEffect(() => {
    toolsStore.setIsShowLoader(true);
    getService('role/get').then(result => {
      const list = result.content || [];
      result.forEach(item => {
        item.key = `${item.id}`;
        item.title = item.name;
        item.userControllers.forEach(item1 => {
          item1.key = `${item.key}-${item1.id}`;
          item1.title = item1.name;
          item1.userMappings.forEach(item2 => {
            item2.key = `${item1.key}-${item2.id}`;
            item2.title = item2.name;
          });
          item1.children = item1.userMappings;
        });
        item.children = item.userControllers;
      });
      setRoleTree(list);
      getService('/gap-user-service/userPermissions', {
        search: `status:true AND userRole.id:${role.id}`,
        size: 500,
      })
        .then(resultResponse => {
          if (!resultResponse) return;

          result.content.forEach(item => {
            const key = `${item.userMapping.userController.userService.id}-${item.userMapping.userController.id}-${item.userMapping.id}`;
            item.key = key;
            if (item.isAccess) checkedKeys.push(key);
          });
          oldData = result.content;
          setCheckedKeys([...checkedKeys]);
        })
        .finally(() => toolsStore.setIsShowLoader(false));
    });
  }, []);

  const onCheck = (checkedKeysValue, info) => {
    console.log('onCheck', info);
    setCheckedKeys(checkedKeysValue);
  };

  const save = () => {
    const saveData = [];
    checkedKeys.forEach(key => {
      const keys = key.split('-');
      const findObj = oldData.find(item => item.key === key);
      if (!findObj && keys.length === 3) {
        saveData.push({
          isAccess: true,
          userRole: { id: role.id },
          userService: { id: Number(keys[0]) },
          userController: { id: Number(keys[1]) },
          userMapping: { id: Number(keys[2]) },
        });
      }
    });
    // erkhiig boliulsan bol isAccess=false bolgoj bn
    oldData.forEach(item => {
      if (!checkedKeys.includes(item.key)) {
        const keys = item.key.split('-');
        saveData.push({
          isAccess: false,
          id: item.id,
          userRole: { id: role.id },
          userService: { id: Number(keys[0]) },
          userController: { id: Number(keys[1]) },
          userMapping: { id: Number(keys[2]) },
        });
      }
    });
    if (!saveData.length) {
      message.warn('Өөрчлөгдсөн өгөгдөл олдсонгүй');
      return;
    }

    toolsStore.setIsShowLoader(true);

    postService('/gap-user-service/userPermissions', saveData)
      .then(result => {
        props.close();
        toolsStore.setIsShowLoader(false);
      })
      .catch(error => {
        toolsStore.setIsShowLoader(false);
        errorCatch(error);
      });
  };

  return (
    <Modal
      title="Эрх тохируулах"
      className="permission"
      visible={visible}
      centered
      width={700}
      okText="Хадгалах"
      cancelText="Болих"
      bodyStyle={{ height: '70vh' }}
      onOk={save}
      onCancel={() => props.close()}
    >
      <h2>{role?.name}</h2>
      <p>
        <Alert
          message="Зөвхөн тухайн дүрд хамаарах эрхүүдийг сонгоно уу"
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
