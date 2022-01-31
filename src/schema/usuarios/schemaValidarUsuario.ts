import yup from '../config';

const schemaValidarUsuario = yup.object().shape({
  email: yup.string().required().email(),
  senha: yup.string().required().min(8),
});

export default schemaValidarUsuario;
