import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import publicRouter from "./public";
import adminRouter from "./admin";
import adminEmployeesRouter from "./admin-employees";
import employeeAuthRouter from "./employee-auth";
import employeeRouter from "./employee";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(publicRouter);
router.use(adminRouter);
router.use(adminEmployeesRouter);
router.use(employeeAuthRouter);
router.use(employeeRouter);

export default router;
