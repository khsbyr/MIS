export const PAGESIZE = 25
export const DATEFORMAT = "YYYY-MM-DD"

export const MSG = {
    SUCCESS: "Амжилттай хадгалагдлаа",
    SUCCESS_REQUEST: "Хүсэлтийг амжилттай хадгаллаа",
    SUCCESS_DEL: "Амжилттай устлаа",
    NOT_AUTHORIZED: "Танд энэ үйлдлийг хийх эрх олгогдоогүй байна!"
}

export const ORG_WISH = {
    CREATE: 1,
    CHANGE_INFO: 2,
    ESTABLISH: 3,
    REQUEST_FOR_END: 4,
}

export const ORG_STEP = {
    ACTIVE: 1,
    APPROVED: 2,
    REJECTED: 3,
    EXPIRED: 4,
}

export const TYPE = {
    NEW: "new",
    EDIT: "edit",
    DRAFT: "draft",
    VIEW: "view",
    DECIDE: "decide",
    REJECTED: "rejected",
    END: "end",
    ESTABLISH: "establish"
}

export const ORGTYPE = {
    EquityParticipationCompany: 1,  //Төрийн болон орон нутгийн өмчит, өмчийн оролцоотой компани
    TusviinBaiguullaga: 2,          //Төсвийн байгууллага
    FundedProject: 3,               //Олон улсын санхүүжилттэй төсөл хөтөлбөр 
    LocallyOwnedPlace: 4,           //Төрийн болон орон нутгийн өмчит үйлдвэрийн газар
    UnRegisteredInfo: 5,            //Бусад улсын бүртгэлд бүртгэлгүй мэдээлэл оруулах нэгж(Төрийн сан дээр данстай)
}