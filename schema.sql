drop table if exists veiculos;

drop table if exists usuarios;

create table usuarios (
	id serial primary key,
  	email text not null unique,
  	senha text not null,
    created timestamp default now()
);

create table veiculos (
	id serial primary key,
  usuario_id integer not null references usuarios (id),
  	veiculo text not null,
  	marca text not null,
  	ano integer not null,
  	descricao text not null,
  	vendido bool not null,
  	created timestamp default now(),
  	updated timestamp
);