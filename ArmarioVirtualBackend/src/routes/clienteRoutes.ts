import { Router } from 'express';
import { verificarTelefone, cadastrar, salvarMedidas } from '../controllers/clienteController';

const router = Router();

router.post('/verificar', verificarTelefone);
router.post('/cadastrar', cadastrar);
router.post('/medidas', salvarMedidas);

export default router;