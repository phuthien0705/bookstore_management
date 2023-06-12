export const contentMapping = (createOrUpdate: boolean) => {
  return {
    idle: createOrUpdate ? "cập nhật" : "tạo",
    success: createOrUpdate ? "cập nhật thành công" : "tạo thành công",
    error: createOrUpdate ? "cập nhật thất bại" : "tạo thất bại",
    loading: createOrUpdate ? "đang cập nhật ..." : "đang tạo ...",
  };
};
