import React from 'react';
import { Descriptions } from 'antd';
import ContentWrapper from './more/briefDraft.style';

function mainInfo() {
  return (
    <div>
      <ContentWrapper>
        <p style={{ fontSize: '18px' }}>Төслийн мэдээлэл</p>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Төслийн нэр" />
          <Descriptions.Item label="Төсөл хэрэгжих байршил:" />
          <Descriptions.Item label="Төсөл хэрэгжүүлэх хугацаа" />
        </Descriptions>

        <p style={{ fontSize: '18px', marginTop: '50px' }}>
          Байгууллагын мэдээлэл
        </p>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Байгууллагын нэр" />
          <Descriptions.Item label="Байгууллагын pегистрийн дугаар:" />
          <Descriptions.Item label="Байгууллагын улсын бүртгэлийн гэрчилгээний дугаар" />
          <Descriptions.Item label="Байгуулагдсан он" />
          <Descriptions.Item label="Эрх бүхий этгээд / Холбогдох ажилтан нэр" />
          <Descriptions.Item label="Хаяг (Төв  оффис болон зорилтот сумд дахь салбарын хаяг)" />
          <Descriptions.Item label="Утасны дугаар" />
          <Descriptions.Item label="Цахим шуудангийн хаяг" />
        </Descriptions>

        <p style={{ fontSize: '18px', marginTop: '50px' }}>Бусад мэдээлэл</p>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Өргөдөл гаргагчийн туршлага болон үйл ажиллагааны чиглэл" />
          <Descriptions.Item label="Өргөдөл гаргагчийн санал болгож буй үйл ажиллагааны чиглэл" />
          <Descriptions.Item label="Хамтран ажиллах түншлэгч байгууллагатай бол үйл ажиллагааны төрөл болон бусад дэлгэрэнгүй мэдээлэл" />
        </Descriptions>
      </ContentWrapper>
    </div>
  );
}

export default mainInfo;
