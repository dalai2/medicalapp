import { Router } from 'express';
import { createConsultation, getConsultation, updateConsultation, deleteConsultation } from '../controllers/consultationController';

const router = Router();

router.post('', createConsultation);
router.get('/:id', getConsultation);
router.put('/:id', updateConsultation);
router.delete('/:id', deleteConsultation);

export default router;