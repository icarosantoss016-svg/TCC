# Sistema de Controle de Acesso por EPI (Multitenant)

> Trabalho de Conclusão de Curso — Desenvolvimento de Sistemas, SENAI Bahia.

Sistema de controle de acesso a setores industriais/laboratoriais com base na detecção automática de Equipamentos de Proteção Individual (EPI), usando visão computacional (YOLO). O projeto é **multitenant**: cada empresa cliente define seu próprio ramo de atuação, seus próprios setores e quais EPIs são obrigatórios em cada um, permitindo que, por exemplo, uma indústria exija capacete e luvas, enquanto um laboratório exija máscara e touca, tudo na mesma plataforma.

## Como funciona

1. Uma câmera instalada num setor captura uma imagem quando acionada.
2. Um modelo YOLO treinado (`best.pt`) identifica quais EPIs estão presentes na imagem.
3. O resultado é enviado para a API, que compara os itens detectados com as regras de EPI cadastradas para aquele setor.
4. O acesso é registrado como **PERMITIDO** ou **NEGADO**, com o log de quais itens foram esquecidos.
5. Relatórios agregados (ranking de EPIs mais esquecidos, setores com mais infrações, relatórios por período) ficam disponíveis via API para consulta administrativa.

## Arquitetura

```
┌─────────────────┐      POST /api/acesso      ┌──────────────────┐
│  reconhecimento  │ ─────────────────────────► │                  │
│  .py (câmera)    │   {id_setor, id_empresa,   │   API (Node.js)  │
│  YOLO + OpenCV   │    itens_detectados}       │   Express +      │
└─────────────────┘                             │   Sequelize      │
                                                 │                  │
┌─────────────────┐      login + provisiona     │                  │
│ instaladorCamera │ ─────────────────────────► │                  │
│ .py              │   empresa/setor via CNPJ   └────────┬─────────┘
└─────────────────┘                                      │
                                                           ▼
                                                    ┌──────────────┐
                                                    │   SQLite     │
                                                    │  (dev/local) │
                                                    └──────────────┘
```

## Tecnologias

**Backend**
- Node.js + Express
- Sequelize (ORM) + SQLite
- JWT (`jsonwebtoken`) para autenticação
- `bcrypt` para hash de senha

**Detecção (câmeras)**
- Python
- Ultralytics YOLO
- OpenCV
- `requests` (comunicação HTTP com a API)

## Estrutura do projeto

```
├── config/
│   └── database.js          # conexão Sequelize com o SQLite
├── models/                  # Empresa, Setor, Usuario, RegraEpi, LogAcesso
│   └── index.js              # associações entre os models
├── controllers/              # regras de negócio de cada entidade
├── routers/                  # definição das rotas da API
├── middleware/
│   └── authMiddleware.js     # validação de token JWT
├── reconhecimento.py         # script que roda na câmera (loop de detecção)
├── instaladorCamera.py       # script de provisionamento (roda uma vez por câmera nova)
├── best.pt                   # modelo YOLO treinado (capacete, colete, luva)
└── server.js                 # ponto de entrada da aplicação
```

## Modelo de dados (resumo)

- **Empresa**: `nome`, `cnpj`, `ramo`
- **Setor**: pertence a uma Empresa; agrupa as câmeras/áreas de acesso
- **RegraEpi**: define, por setor, quais EPIs são obrigatórios (`nome_Epi`: nome técnico usado na comparação com a detecção, e `nome_exibicao`: nome amigável para relatórios)
- **Usuario**: possui `perfil` (`ADMIN`, `ADM_EMPRESA`, `USUARIO`) e pertence a uma Empresa
- **LogAcesso**: histórico de cada verificação de acesso, com status (`PERMITIDO`/`NEGADO`) e itens esquecidos

## Como rodar

### Backend

```bash
npm install
node server.js
```

O servidor sobe em `http://localhost:3000` e sincroniza automaticamente o banco SQLite na primeira execução, criando uma empresa e um usuário administrador padrão.

### Provisionar uma câmera nova

```bash
python instaladorCamera.py
```

Solicita login de administrador, o CNPJ da empresa cliente e o nome do novo setor, e devolve (ou já inicia) o comando para ligar a câmera daquele setor.

### Rodar o reconhecimento numa câmera já provisionada

```bash
python reconhecimento.py --setor <id_setor> --empresa <id_empresa>
```

## Endpoints da API

Todas as rotas abaixo, exceto `/login` e `/api/acesso`, exigem o cabeçalho `Authorization: Bearer <token>`.

### Autenticação e acesso

| Método | Rota | Descrição |
|---|---|---|
| POST | `/login` | Autenticação, retorna token JWT |
| POST | `/api/acesso` | Recebe detecção da câmera e verifica o acesso |

### Empresas

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/criarEmpresa` | Cadastra uma empresa |
| GET | `/api/listaEmpresa` | Lista todas as empresas |
| GET | `/api/buscarEmpresa/:id` | Busca uma empresa pelo ID |
| GET | `/api/empresa/cnpj/:cnpj` | Busca uma empresa pelo CNPJ |
| PUT | `/api/atualizarEmpresa/:id` | Atualiza uma empresa |
| DELETE | `/api/deletarEmpresa/:id` | Remove uma empresa |

### Setores

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/criarSetor` | Cadastra um setor vinculado a uma empresa |
| GET | `/api/listarSetor` | Lista todos os setores |
| GET | `/api/buscarSetor/:id` | Busca um setor pelo ID |
| PUT | `/api/atualizarSetor/:id` | Atualiza o nome de um setor |
| DELETE | `/api/deletarSetor/:id` | Remove um setor |

### Regras de EPI

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/criarRegra` | Cadastra uma regra de EPI para um setor |
| GET | `/api/listarRegra` | Lista todas as regras de EPI |
| GET | `/api/buscarRegra/:id` | Busca uma regra pelo ID |
| PUT | `/api/atulaizarRegra/:id` | Atualiza uma regra de EPI |
| DELETE | `/api/deletarRegra/:id` | Remove uma regra de EPI |

### Usuários

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/criarusuario` | Cadastra um usuário |
| GET | `/api/listaUsuario` | Lista todos os usuários |
| GET | `/api/buscarUsuario/:id` | Busca um usuário pelo ID |
| PUT | `/api/atualizarSenha/:id` | Atualiza a senha de um usuário |
| DELETE | `/api/deletarUsuario/:id` | Remove um usuário |

### Relatórios

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/relatorios/geral` | Logs de acesso (aceita `?status=PERMITIDO` ou `?status=NEGADO`) |
| GET | `/api/relatorios/ranking-epis` | EPIs mais esquecidos |
| GET | `/api/relatorios/ranking-setores` | Setores com mais infrações |
| GET | `/api/relatorios/ciclo` | Relatório por período (`?inicio=&fim=`), com ranking de EPIs e setores no intervalo |
