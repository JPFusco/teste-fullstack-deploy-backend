interface IVeiculo {
  id: string,
  usuario_id: string,
  veiculo: string,
  marca: string,
  ano: number,
  descricao: string,
  vendido: boolean,
  created: Date,
  updated?: Date
}

export default IVeiculo;
