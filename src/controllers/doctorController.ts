import { Request, Response } from 'express';
import logger from '../utils/logger';
import { processAvailability } from '../services/doctorService';

export const getDoctorAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const availability = await processAvailability();
    logger.info('Disponibilidad guardada exitosamente en MongoDB');
    res.status(201).json({
      message: 'Disponibilidad unificada con éxito',
      availability
    });
  } catch (error) {
    logger.error('Error al procesar la disponibilidad:', error);
    res.status(500).json({ message: 'Error al procesar la disponibilidad' });
  }
};