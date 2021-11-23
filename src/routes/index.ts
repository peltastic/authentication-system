import UserRouter from "./user.route";

export default (router: any) => {
  router.use(UserRouter());
  
  return router;
};
