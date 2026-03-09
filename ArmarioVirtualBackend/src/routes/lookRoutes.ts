import { Router } from 'express';
import { gerarLook, listarLooks, favoritarLook } from '../controllers/lookController';
import { autenticar } from '../middlewares/auth';

const router = Router();

router.post('/gerar', gerarLook);
router.get('/cliente/:clienteId', listarLooks);
router.patch('/favoritar/:id', autenticar, favoritarLook);

export default router;