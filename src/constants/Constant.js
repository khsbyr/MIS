export const PAGESIZE = 20;
export const DATEFORMAT = 'YYYY-MM-DD';

export const MSG = {
  SUCCESS: 'Амжилттай хадгалагдлаа',
  SUCCESS_REQUEST: 'Хүсэлтийг амжилттай хадгаллаа',
  SUCCESS_DEL: 'Амжилттай устлаа',
  NOT_AUTHORIZED: 'Танд энэ үйлдлийг хийх эрх олгогдоогүй байна!',
};

export const ORG_WISH = {
  CREATE: 1,
  CHANGE_INFO: 2,
  ESTABLISH: 3,
  REQUEST_FOR_END: 4,
};

export const ORG_STEP = {
  ACTIVE: 1,
  APPROVED: 2,
  REJECTED: 3,
  EXPIRED: 4,
};

export const TYPE = {
  NEW: 'new',
  EDIT: 'edit',
  DRAFT: 'draft',
  VIEW: 'view',
  DECIDE: 'decide',
  REJECTED: 'rejected',
  END: 'end',
  ESTABLISH: 'establish',
};

export const ORGTYPE = {
  EquityParticipationCompany: 1, // Төрийн болон орон нутгийн өмчит, өмчийн оролцоотой компани
  TusviinBaiguullaga: 2, // Төсвийн байгууллага
  FundedProject: 3, // Олон улсын санхүүжилттэй төсөл хөтөлбөр
  LocallyOwnedPlace: 4, // Төрийн болон орон нутгийн өмчит үйлдвэрийн газар
  UnRegisteredInfo: 5, // Бусад улсын бүртгэлд бүртгэлгүй мэдээлэл оруулах нэгж(Төрийн сан дээр данстай)
};

export const criteriaFrequencyData = [
  {
    id: '1',
    name: 'Улирал тутам',
  },
  {
    id: '2',
    name: 'Жил тутам',
  },
  {
    id: '3',
    name: 'Суурь, дунд хугацаанд болон төгсгөлд',
  },
  {
    id: '4',
    name: 'Төслийн төгсгөлд',
  },
];

export const shapeData = [
  {
    id: '1',
    name: 'Албан бичиг',
  },
  {
    id: 2,
    name: 'Мэдээлэл холбооны технологиор дамжуулан',
  },
  {
    id: 3,
    name: 'Фэйсбүүк',
  },
];

export const PlanType = [
  {
    id: 0,
    name: 'Төсөл хэрэгжүүлэгч нэгж',
  },
  {
    id: 1,
    name: 'Залуу малын эмч хөтөлбөр',
  },
];

export const PlanType1 = [
  {
    id: 0,
    name: 'Төсөл хэрэгжүүлэгч нэгж',
  },
];

export const PlanType2 = [
  {
    id: 1,
    name: 'Залуу малын эмч хөтөлбөр',
  },
];

export const OrgType = [
  {
    id: 1,
    name: 'Энгийн байгууллага',
  },
  {
    id: 2,
    name: 'Ажил олгогч',
  },
];

export const OrgType1 = [
  {
    id: 1,
    name: 'Энгийн байгууллага',
  },
];

export const OrgType2 = [
  {
    id: 2,
    name: 'Ажил олгогч',
  },
];
export default {
  criteriaFrequencyData,
};
