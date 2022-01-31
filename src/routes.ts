import { Router } from 'express';
import veiculos from './controllers/veiculos';
import usuarios from './controllers/usuarios';
import ensureAuthenticated from './middlewares/ensureAuthenticated';

const routes = Router();

routes.post('/sign-up', usuarios.cadastrarUsuario);
routes.post('/sign-in', usuarios.logarUsuario);

routes.use(ensureAuthenticated);

routes.get('/veiculos', veiculos.obterVeiculos);
routes.get('/veiculos/:id', veiculos.obterVeiculo);
routes.post('/veiculos', veiculos.cadastrarVeiculo);
routes.put('/veiculos/:id', veiculos.atualizarVeiculoCompleto);
routes.patch('/veiculos/:id', veiculos.atualizarVeiculoParcial);
routes.delete('/veiculos/:id', veiculos.excluirVeiculo);

export default routes;
