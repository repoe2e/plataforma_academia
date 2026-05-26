# FitFlow — Gestão de Treinos

Sistema web frontend para administração de treinos, evolução física e frequência de alunos, conforme documentação do projeto.

## Funcionalidades

### Profissional
- Login e recuperação de senha
- Dashboard com métricas
- CRUD de alunos (criar, editar, inativar, consultar detalhes)
- Biblioteca de treinos (criar, editar, excluir, associar ao aluno)
- Registro e visualização de evolução física (gráficos)
- Controle de frequência / check-ins
- Agenda de aulas
- Relatórios com gráficos
- Envio de notificações
- Perfil editável

### Aluno
- Login
- Dashboard pessoal
- Visualizar treino atribuído
- Check-in (1 por dia)
- Evolução com gráficos
- Agenda pessoal
- Histórico de treinos
- Notificações
- Perfil editável

## Tecnologias

- React 19 + TypeScript
- Vite
- React Router
- Recharts (gráficos)
- Lucide React (ícones)
- LocalStorage (persistência mock)

## Paleta de cores

- **Midnight** `#0B1026` — fundo
- **Electric Cyan** `#00F5D4` — primária
- **Hot Magenta** `#FF006E` — secundária
- **Soft Lavender** `#B388FF` — destaque
- **Gold** `#FFD60A` — acentos

## Como executar

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`

## Contas de demonstração

| Perfil       | E-mail                      | Senha |
|-------------|-----------------------------|-------|
| Profissional | profissional@fitflow.com   | qualquer |
| Aluno        | aluno@fitflow.com          | qualquer |

## Build

```bash
npm run build
npm run preview
```
