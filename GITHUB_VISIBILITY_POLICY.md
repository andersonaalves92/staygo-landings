# Politica de visibilidade dos repositorios StayGo

## Repositorios que devem ficar privados

- `staygo-api`: contem backend, regras de negocio, integracoes, rotas, modelos de dados e pontos sensiveis do sistema.
- `staygo-web`: contem painel interno da SaaS, fluxos administrativos, telas de clientes e logica do produto.
- `staygo-infra`: contem documentacao e scripts de infraestrutura, deploy, backups, Nginx, PM2 e operacao da VPS.

## Repositorios que podem ficar publicos

- `staygo-landings`: pode ficar publico somente enquanto guardar templates, paginas estaticas, install-kit e exemplos sem credenciais.
- Repositorios de landing de clientes podem ser publicos apenas se forem sites estaticos sem segredos, sem dados pessoais e sem arquivos de ambiente.

## Regra principal

Codigo do produto, infraestrutura, API, banco, credenciais e configuracoes reais ficam privados. Materiais publicos devem conter somente HTML, CSS, JS estatico, imagens comerciais e documentacao segura para instalacao.

