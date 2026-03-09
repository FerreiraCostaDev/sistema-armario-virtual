import { Router } from 'express';
import {
  listar,
  buscarPorCodigo,
  cadastrar,
  atualizarEstoque,
  verificarDisponibilidade,
} from '../controllers/produtoController';
import { autenticar } from '../middlewares/auth';

const router = Router();

router.get('/', autenticar, listar);
router.get('/buscar/:codigo', buscarPorCodigo);
router.get('/disponibilidade/:codigo/:tamanho', verificarDisponibilidade);
router.post('/cadastrar', autenticar, cadastrar);
router.post('/estoque', autenticar, atualizarEstoque);

export default router;