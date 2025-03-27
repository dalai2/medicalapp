// routes/patientRoutes.ts
import { Router, Request, Response } from 'express';
import { createPatient, getPatients ,getPatient, updatePatient, deletePatient } from '../controllers/patientController';


const router = Router();

router.post('/', createPatient);
router.get('/', getPatients);
router.get('/:id', getPatient);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

export default router;