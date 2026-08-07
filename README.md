# CQE, Consultorio em Ordem

Sistema multi tenant de gestao para consultorios e clinicas, com
controle de permissoes por perfil e por equipe de paciente.

## Contexto

O projeto nasceu no Lovable. O codigo e o banco continuam
aproveitaveis, mas a construcao daqui para frente passa a ser fora
do Lovable, para manter o custo previsivel e o controle total sobre
o codigo, especialmente sobre as politicas de seguranca, que sao
sensiveis e merecem revisao manual.

## Stack

Codigo versionado no GitHub. Publicacao automatica via Vercel a
cada commit. Banco de dados, autenticacao e regras de acesso no
Supabase, o mesmo projeto que ja estava em uso no Lovable.
Frontend em Vite, React e TypeScript.

## Como o acesso e organizado

O sistema tem dois niveis de gestao, que nao podem se misturar na
mesma tela.

Super administrador, uso exclusivo de quem opera a plataforma.
Enxerga so o necessario para administrar contrato e ativacao de
cada clinica: nome, codigo de acesso, status ativo, quantidade de
pessoas na equipe. Nenhuma informacao pessoal da equipe interna de
cada cliente aparece aqui.

Administrador do consultorio, o dono de cada clinica cliente.
Gerencia a propria equipe dentro do proprio painel: nome, e-mail,
perfil e funcao interna de cada pessoa. Cria os acessos de
profissional de saude, financeiro, contabilidade, recepcao e
secretaria virtual.

Dentro de cada clinica, o acesso ao prontuario segue a regra de
equipe por paciente. Diretor tecnico e responsavel tecnico tem
acesso irrestrito ao prontuario, por responsabilidade legal sobre a
unidade. Os demais profissionais de saude so acessam o prontuario
dos pacientes em que estao vinculados como equipe do caso, a nao
ser que o consultorio opte por visibilidade compartilhada entre
todos os profissionais, o que e configuravel por clinica.

## Perfis

admin, secretaria, profissional_saude e super_admin ja existem no
banco. diretor_tecnico, financeiro, contabilidade e
secretaria_virtual ainda serao criados, fazem parte do desenho mas
nao foram aplicados no Supabase ate agora.

## Plano de pastas

A construcao segue uma ordem fixa, uma pasta so comeca depois que a
anterior esta fechada.

1. Fechar a lacuna de schema, comparando o banco real com o codigo
   herdado do Lovable. Em andamento.
2. Autenticacao e perfis, isolados de qualquer tela. Primeira
   versao criada.
3. Painel do super administrador, minimo, sem dado pessoal de
   equipe. Pendente.
4. Painel do administrador do consultorio, com a gestao completa de
   usuarios, incluindo convite de pessoa nova por e-mail. Pendente.
5. Modulo clinico, prontuario, anamnese e equipe por paciente.
   Pendente.
6. Modulos administrativos, financeiro, contabilidade, e por
   ultimo a integracao de secretaria virtual. Pendente.

## Como rodar localmente

Copie `.env.example` para `.env` e preencha a chave anon do
Supabase. Rode `npm install` e depois `npm run dev`.

## Variaveis de ambiente

VITE_SUPABASE_URL, a URL do projeto Supabase.
VITE_SUPABASE_ANON_KEY, a chave publica anon do Supabase, nunca a
chave de servico.
