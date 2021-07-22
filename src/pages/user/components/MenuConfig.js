import React, { useState, useEffect } from "react";
import { Modal, Tree, Alert, message } from "antd";
import { CheckSquareFilled } from "@ant-design/icons";
import { getService, postService } from "../../../service/service";
import { isShowLoading } from "../../../context/Tools";
import { errorCatch } from "../../../tools/Tools";

var oldData = [];

export default function MenuConfig(props) {
    const { visible, role } = props;
    const [checkedKeys, setCheckedKeys] = useState([]);
    const [roleTree, setRoleTree] = useState([]);
    useEffect(() => {
        isShowLoading(true)
        getService("menu/get").then((result) => {
            let list = result.content || [];
            setRoleTree(convertTree(list));
            getService("/gap-core-service/menuShows", {
                search: `userRoleId:${role.id}`,
                size: 500
            }).then((result) => {
                if (!result) return;
                result.content.map((item) => {
                    item.key = item.menu?.id;
                    checkedKeys.push(item.key);
                });
                oldData = result.content;
                setCheckedKeys([...checkedKeys]);
            }).finally(() => isShowLoading(false));
        });
    }, []);

    const convertTree = (list) => {
        list = list.filter(row => row.status)
        list.map(menu => {
            menu.key = menu.id
            menu.title = menu.name
            menu.children = convertTree(menu.menus)
        })
        return list.sort((a, b) => (a.priority > b.priority) ? 1 : -1)
    }

    const onCheck = (checkedKeysValue, info) => {
        console.log("onCheck", info);
        setCheckedKeys(checkedKeysValue);
    };

    const save = () => {
        let saveData = [];
        checkedKeys.map((key) => {
            const findObj = oldData.find((item) => item.key === key);
            if (!findObj) {
                saveData.push({
                    isAccess: true,
                    userRoleId: role.id,
                    menu: { id: key },
                });
            }
        });
        //check boliulsan bol isAccess=false bolgoj bn
        oldData.map((item) => {
            if (!checkedKeys.includes(item.key)) {
                saveData.push({
                    isAccess: false,
                    id: item.id,
                    userRoleId: role.id,
                    menu: { id: item.key },
                });
            }
        });
        if (!saveData.length) {
            message.warn("Өөрчлөгдсөн өгөгдөл олдсонгүй");
            return;
        }
        console.log("--->", JSON.stringify(saveData));
        isShowLoading(true);
        postService("/gap-core-service/menuShows", saveData)
            .then(() => {
                props.close();
                isShowLoading(false);
                message.success('Амжилттай хадгалагдлаа')
            })
            .catch((error) => {
                isShowLoading(false);
                errorCatch(error);
            });
    };

    return (
        <Modal
            title="Цэс тохируулах"
            className="permission"
            visible={visible}
            centered={true}
            width={700}
            okText="Хадгалах"
            cancelText="Болих"
            bodyStyle={{ height: "70vh" }}
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
