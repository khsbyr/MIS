import styled from 'styled-components';

const ContentWrapper = styled.div`
  margin: 50px;

  .title {
    font-weight: 600;
    font-size: 20px;
  }

  .p-datatable .p-datatable-tbody > tr > td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export default ContentWrapper;
