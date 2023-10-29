import { Router, json } from 'express';
import { controller } from './controller';
import { body, param } from 'express-validator';

const router = Router();
router.use(json());

router.get('/', controller.drivers);
router.get('/:id', param('id').notEmpty(), controller.driver);
router.post(
  '/',
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('email').trim().notEmpty().isEmail(),
  body('phoneNumber').trim().notEmpty(),
  controller.create,
);
router.patch(
  '/edit/:id',
  param('id').notEmpty(),
  body('firstName').optional(),
  body('lastName').optional(),
  body('email').optional(),
  body('phoneNumber').optional(),
  controller.update,
);
router.delete('/delete/:id', param('id').notEmpty(), controller.deleteOne);

export default router;
