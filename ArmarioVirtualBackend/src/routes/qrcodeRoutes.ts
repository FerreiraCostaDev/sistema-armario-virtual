import { Router } from 'express';
import { gerarQRCode, verificarQRCode } from '../controllers/qrcodeController';
import { autenticar } from '../middlewares/auth';

const router = Router();

router.post('/gerar', autenticar, gerarQRCode);
router.get('/verificar/:codigo', verificarQRCode);

export default router;