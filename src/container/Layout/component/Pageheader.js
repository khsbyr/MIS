// import React from "react";
// import "antd/dist/antd.css";
// import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
// import { Button, Input, DatePicker, Dropdown, Icon, Divider } from "antd";
// import PageHeaderWrapper from "./Pageheader.style";
// import {
//   DownOutlined,
//   SearchOutlined,
//   CopyOutlined,
//   PoweroffOutlined,
// } from "@ant-design/icons";
// import { Row, Col } from "antd";
// // import {useTranslation} from 'react-i18next';
// function onChange(date, dateString) {
//   console.log(date, dateString);
// }
// const onSearch = (value) => console.log(value);
// const Pageheader = ({ className }) => {
//   return (
//     <PageHeaderWrapper>
//       <Row>
//         <Col xs={8} md={8} lg={6}>
//           <DatePicker
//             onChange={onChange}
//             bordered={false}
//             suffixIcon={<DownOutlined />}
//             placeholder="Select year"
//             picker="year"
//             className="DatePicker"
//             style={{
//               width: "120px",
//               color: "black",
//               cursor: "pointer",
//             }}
//           />
//         </Col>
//         <Col xs={8} md={8} lg={6}>
//           <Input
//             placeholder="Хайлт хийх"
//             allowClear
//             prefix={<SearchOutlined />}
//             bordered={false}
//             onSearch={onSearch}
//             style={{
//               width: 150,
//               borderBottom: "1px solid #103154",
//             }}
//           />
//         </Col>
//         <Col xs={8} md={8} lg={4}>
//           <Button icon={<CopyOutlined />}>Хэвлэх</Button>
//         </Col>
//         <Col xs={8} md={8} lg={4}>
//           <Button className="export" icon={<CopyOutlined />}>Экспорт</Button>
//         </Col>
//         <Col xs={8} md={8} lg={4}>
//           <Button className="export" icon={<CopyOutlined />}>Нэмэх</Button>
//         </Col>
//       </Row>
//     </PageHeaderWrapper>
//   );
// };
// export default Pageheader;
