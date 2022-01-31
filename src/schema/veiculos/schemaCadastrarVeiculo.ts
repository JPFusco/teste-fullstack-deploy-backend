import yup from '../config';

const schemaCadastrarVeiculo = yup.object().shape({
  veiculo: yup.string().required(),
  marca: yup.string().required(),
  ano: yup.number().required(),
  descricao: yup.string().required(),
  vendido: yup.bool().required(),
});

export default schemaCadastrarVeiculo;
