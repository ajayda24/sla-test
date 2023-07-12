const checkAccessFn = (dashboardData, module, name) => {
  if (dashboardData.data.user_permissions.find((object) => object.name === name && object.module === module)) {
    if (dashboardData.data.permissions.find((object) => object.name === name && object.module === module)) {
      return true;
    }
  }
};

export { checkAccessFn };
