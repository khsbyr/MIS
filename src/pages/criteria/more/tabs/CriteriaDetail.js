import React, { useEffect, useState } from 'react';
import { Descriptions } from 'antd';
import ContentWrapper from '../../criteria.style';
import { getService } from '../../../../service/service';
import { useToolsStore } from '../../../../context/Tools';
import {
  errorCatch,
  formatIndicator,
  formatFrequency,
  formatFormula,
} from '../../../../tools/Tools';

const CriteriaDetail = props => {
  const [criteriaRow, setCriteriaRow] = useState({});
  const { setIsShowLoader } = useToolsStore();

  useEffect(() => {
    setIsShowLoader(true);
    getService(`/criteria/getById/${props.id}`)
      .then(result => {
        setCriteriaRow(result);
      })
      .finally(setIsShowLoader(false))
      .catch(error => {
        errorCatch(error);
        setIsShowLoader(false);
      });
  }, []);

  return (
    <ContentWrapper>
      <Descriptions bordered column={1}>
        <Descriptions.Item Span={4} label="Бүрэлдэхүүн">
          {criteriaRow.criteriaReference
            ? criteriaRow.criteriaReference.name
            : ''}
        </Descriptions.Item>
        <Descriptions.Item Span={4} label="Шалгуур үзүүлэлт">
          {criteriaRow.name}
        </Descriptions.Item>
        <Descriptions.Item label="Код">{criteriaRow.code}</Descriptions.Item>
        <Descriptions.Item label="Шалгуур үзүүлэлтийн төрөл">
          {formatFormula(criteriaRow.indicator)}
        </Descriptions.Item>
        <Descriptions.Item label="Хүрэх үр дүн">
          {criteriaRow.resultTobeAchieved +
            formatIndicator(criteriaRow.indicator)}
        </Descriptions.Item>
        <Descriptions.Item label="Үр дүнгийн биелэлт">
          {criteriaRow.processResult + formatIndicator(criteriaRow.indicator)}
        </Descriptions.Item>
        <Descriptions.Item label="Давтамж">
          {formatFrequency(criteriaRow.frequency)}
        </Descriptions.Item>
        <Descriptions.Item label="Мэдээллийн эх үүсвэр">
          {criteriaRow.sourceOfInformation}
        </Descriptions.Item>
        <Descriptions.Item label="Мэдээлэл цуглуулах аргачлал">
          {criteriaRow.dataCollectionMethodology}
        </Descriptions.Item>
        <Descriptions.Item label="Харицах нэгж">
          {criteriaRow.unitOfResponsibility}
        </Descriptions.Item>
        <Descriptions.Item label="Тайлбар">
          {criteriaRow.description}
        </Descriptions.Item>
      </Descriptions>
      ,
    </ContentWrapper>
  );
};

export default CriteriaDetail;
