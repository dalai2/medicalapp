import { Router, Request, Response } from 'express';
import doctorRoutes from './doctorRoutes';
import patientRoutes from './patientRoutes';
import consultationRoutes from './consultationRoutes';
const router: Router = Router();

/**
 * @route GET /
 * @desc Returns API status
 * @access Public
 */
router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API is working!' });
});

// Use the doctor routes
router.use('/doctors', doctorRoutes);
router.use('/patients', patientRoutes);
router.use('/consultations', consultationRoutes);

export default router;