import React, { useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Space, Result, Radio, Col, Row, DatePicker, Dropdown, Menu, message, Modal, Popconfirm } from 'antd';
import {
    ExclamationCircleOutlined, FileOutlined, FileSyncOutlined, FolderAddFilled, PrinterOutlined, SettingFilled
} from "@ant-design/icons";
import SaveIcon from "@material-ui/icons/Save";
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import axios from "axios"
import "./test.css"
import { getService, putService } from '../../../service/service';

function handleMenuClick(e) { console.log("click", e.key[0]); }
function onChange(date, dateString) {
    console.log(date, dateString);
  }

const data = [

    {
      key: '1',
      name: 'John Brown',
      indicatorProcess: 32,
      upIndicator: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      indicatorProcess: 42,
      upIndicator: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      indicatorProcess: 32,
      upIndicator: 'Sidney No. 1 Lake Park',
    },
    {
      key: '4',
      name: 'asdasdUser',
      indicatorProcess: 99,
      upIndicator: 'Sidney No. 1 Lake Park',
    }
  ];

const columns = [
    {
        title: '№',
        dataIndex: 'index',
        key: 'index',
        // sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
        title: 'Код',
        dataIndex: 'code',
        key: 'code',
        // sorter: (a, b) => a.lastName.localeCompare(b.lastName),
    },
    {
        title: 'Шалгуур үзүүлэлтийн нэр',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Хүрэх үр дүн',
        dataIndex: 'indicatorProcess',
        key: 'indicatorProcess',

    },
    {
        title: 'Үр дүнгийн биелэлт',
        dataIndex: 'upIndicator',
        key: 'upIndicator',
    },
    {
        title: 'Шалгуур үзүүлэлтийн төрөл',
    },
    {
        title: 'operation',
        dataIndex: 'operation',
        render: (_, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
              <a>Delete</a>
            </Popconfirm>
          ) : null,
      },
];



const menu = (
    <Menu onClick={handleMenuClick}>
        <Menu.Item
            key="1"
            icon={<FileSyncOutlined style={{ fontSize: "14px", color: "#45629c" }} />}
        >

            Импорт
        </Menu.Item>
        <Menu.Item
            key="2"
            icon={<FileOutlined style={{ fontSize: "14px", color: "#45629c" }} />}
        >
            Экспорт
        </Menu.Item>

        <Menu.Item
            key="3"
            icon={<PrinterOutlined style={{ fontSize: "14px", color: "#45629c" }} />}
        >

            Хэвлэх
        </Menu.Item>

    </Menu>
);

var isEditMode;
const Test = () => {
    let loadLazyTimeout = null;
    const [list, setList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [lazyParams, setLazyParams] = useState({
        page: 0,
    });
    const [loading, setLoading] = useState(false);
    const PAGESIZE = 20;
    const [selectedRows, setSelectedRows] = useState([]);

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record) => ({
          disabled: record.name === 'Disabled User',
          // Column configuration not to be checked
          name: record.name,
        }),
      };

    useEffect(() => {
        onInit();
    }, [lazyParams])

    const onInit = () => {
    setLoading(true);
    if (loadLazyTimeout) {
        clearTimeout(loadLazyTimeout);
    }
    getService("criteria/get", list)
        .then((result) => {
            let list = result.content || [];
            list.map(
                (item, index) =>
                    (item.index = lazyParams.page * PAGESIZE + index + 1)
            );
            setList(list);})
    };

    
    // const add = () => {
    //     setIsModalVisible(true);
    //     isEditMode = false;
    // };
    // const pop = () => {
    //     if (selectedRowKeys.length === 0) {
    //         message.warning("Устгах өгөгдлөө сонгоно уу");
    //         return;
    //     } else {
    //         confirm();
    //     }
    // };
    // const handleDeleted = () => {
    //     if (selectedRowKeys.length === 0) {
    //         message.warning("Устгах өгөгдлөө сонгоно уу");
    //         return;
    //     }
        
    //     putService("criteria/delete/" + selectedRowKeys[0])
    //         .then((result) => {
    //             message.success("Амжилттай устлаа");
    //             onInit();
    //         })
 
    // };
    // function confirm() {
    //     Modal.confirm({
    //         title: "Та устгахдаа итгэлтэй байна уу ?",
    //         icon: <ExclamationCircleOutlined />,
    //         okButtonProps: {},
    //         okText: "Устгах",
    //         cancelText: "Буцах",
    //         onOk() {
    //             handleDeleted();
    //             onInit();
    //         },
    //         onCancel() { },
    //     });
    // }

    return (
        <>
        {/* <Row>
        <Col span={2}>
            <Button onClick={add} type="link" icon={<SaveIcon />}>
                Нэмэх
            </Button>
        </Col>
        <Col span={2}>
            <Button onClick={pop} type="link" icon={<FolderAddFilled />}>
                Устгах
            </Button>
        </Col>
        <Col span={2}>
            <DatePicker onChange={onChange} picker="year" />
        </Col>
        <Col span={18} style={{ textAlign: "right" }}>
            <div style={{ marginRight: "5px" }}>
                <Dropdown.Button
                    overlay={menu}
                    placement="bottomCenter"
                    icon={
                        <SettingFilled
                            style={{ marginLeft: "8px", color: "#45629c" }}
                        />
                    }
                ></Dropdown.Button>
            </div>
        </Col>
    </Row> */}
        <Table
            rowSelection={rowSelection} 
            rowKey={record =>record.id}
            dataSource={list} columns={columns}
            pagination={{
                position: ['bottomRight'],
                hideOnSinglePage: true,
                pageSize: 10
            }}
            bordered
        />      
    </>
    
    )
}

export default Test;