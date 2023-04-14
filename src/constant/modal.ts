export const contentMapping = (createOrUpdate: boolean) => {
  return {
    idle: createOrUpdate ? "update" : "create",
    success: createOrUpdate ? "update successfully" : "create successfully",
    error: createOrUpdate ? "update failed" : "create failed",
    loading: createOrUpdate ? "updateting..." : "creating...",
  };
};
