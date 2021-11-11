import { Col, Row, Select } from 'antd';
import { Chart } from 'primereact/chart';
import React, { useState } from 'react';
import { getService } from '../../../service/service';
import ContentWrapper from './criteria.style';

const stackedOptions = {
  indexAxis: 'y',
  maintainAspectRatio: false,
  aspectRatio: 1.2,

  plugins: {
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    legend: {
      display: true,
    },
  },
  scales: {
    x: {
      stacked: true,
      ticks: {
        color: 'white',
      },
      grid: {
        color: '#ebedef',
        display: false,
      },
    },
    y: {
      stacked: true,
      ticks: {
        color: 'white',
      },
      grid: {
        color: '#ebedef',
        display: false,
      },
    },
  },
};

function dashboardCriteria() {
  const { Option, OptGroup } = Select;
  const [CriteriaList, setCriteriaList] = useState();

  const stackedData = {
    labels: [
      // 'Залуу мэргэжилтэн (тоо)',
      // 'Залуу мэргэжилтэн (тоо) эмэгтэй',
      // 'ХХАБ-ын төслийн нэгжийн ажилчид (Эр)',
      // 'ХХАБ-ын төслийн нэгжийн ажилчид (Эм)',
      CriteriaList?.map(z => z.name),
    ],
    datasets: [
      {
        type: 'bar',
        label: 'Гүйцэтгэл',
        backgroundColor: '#66BB6A',
        data: [80, 70, 80, 30, 60, 40],
      },
      {
        type: 'bar',
        label: '',
        backgroundColor: '#42A5F5',
        data: [20, 30, 20, 70, 30, 60],
      },
    ],
  };

  function selectComposition(value) {
    getService(`/criteria/getListByCriteriaReferenceId/${value}`).then(
      result => {
        if (result) {
          setCriteriaList(result);
        }
      }
    );
  }

  return (
    <div>
      <ContentWrapper>
        <Row
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '50px',
          }}
        >
          <Col lg={20}>
            {/* <div style={{ marginLeft: '12%', width: '50%' }}> */}
            <Select
              placeholder="Шалгуур үзүүлэлтийн бүрэлдэхүүн сонгох"
              style={{ width: '100%' }}
              onChange={value => selectComposition(value)}
              size="small"
            >
              <OptGroup label="ТӨСЛИЙН ХӨГЖЛИЙН ЗОРИЛГЫН ТҮВШНИЙ  ШАЛГУУР ҮЗҮҮЛЭЛТҮҮД">
                <Option value={1}>Малын эрүүл мэндийн үйлчилгээ</Option>
                <Option value={2}>
                  Нэмүү өртгийн сүлжээний эдийн засгийн эргэлтийг нэмэгдүүлэх
                </Option>
              </OptGroup>
              <OptGroup label="ДУНД ТҮВШНИЙ ШАЛГУУР ҮЗҮҮЛЭЛТҮҮД">
                <Option value={3}>Малын эрүүл мэндийн үйлчилгээ</Option>
                <Option value={4}>
                  Нэмүү өртгийн сүлжээний эдийн засгийн эргэлтийг нэмэгдүүлэх
                </Option>
                <Option value={5}>Төслийн хэрэгжилтийг дэмжлэг</Option>
                <Option value={6}>
                  Болзошгүй онцгой байдлын хариу арга хэмжээний бүрэлдэхүүн
                  хэсэг
                </Option>
              </OptGroup>
            </Select>
            {/* </div> */}
            <div style={{ marginLeft: '12%' }}>
              <Chart type="bar" data={stackedData} options={stackedOptions} />
            </div>
          </Col>
        </Row>
      </ContentWrapper>
    </div>
  );
}

export default dashboardCriteria;
