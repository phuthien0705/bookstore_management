export const contentMapping = (createOrUpdate: boolean) => {
  return {
    idle: createOrUpdate ? "cập nhật" : "tạo",
    success: createOrUpdate ? "cập nhật thành công" : "tạo thành công",
    error: createOrUpdate ? "cập nhật thất bại" : "tạo thất bại",
    loading: createOrUpdate ? "đang cập nhật ..." : "đang tạo ...",
  };
};
export const createInvoiceMaping = (createOrUpdate: boolean) => {
  return {
    idle: createOrUpdate ? "cập nhật" : " ",
    success: createOrUpdate ? "cập nhật thành công" : "Tạo hóa đơn thành công!",
    error: createOrUpdate ? "cập nhật thất bại" : "Tạo hóa đơn thất bại!",
    loading: createOrUpdate ? "đang cập nhật ..." : "Đang tạo ...",
  };
};
