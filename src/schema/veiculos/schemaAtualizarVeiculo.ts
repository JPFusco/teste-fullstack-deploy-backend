import yup from '../config';

const schemaCadastrarVeiculo = yup.object().shape({
  veiculo: yup.string(),
  marca: yup.string(),
  ano: yup.number(),
  descricao: yup.string(),
  vendido: yup.bool(),
});

export default schemaCadastrarVeiculo;
