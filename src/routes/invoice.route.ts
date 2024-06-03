import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { downloadInvoice, getInvoices, uploadInvoice } from "../controllers/invoice.controller";

const router = Router();

router.post('/invoices', [protect], getInvoices);
router.post('/uploadInvoice', [protect], uploadInvoice);
router.post('/downloadInvoice', [protect], downloadInvoice);

export default router;