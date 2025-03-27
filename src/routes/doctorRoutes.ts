import { Router } from 'express';
import { getDoctorAvailability } from '../controllers/doctorController';

const router = Router();

router.get('/availability', getDoctorAvailability);

export default router;