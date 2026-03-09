import { Router } from 'express';
import { login, cadastrar } from '../controllers/vendedorController';

const router = Router();

router.post('/login', login);
router.post('/cadastrar', cadastrar);

export default router;