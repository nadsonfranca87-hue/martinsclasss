# Martins Class - Loja Online

## Sobre o Projeto

Sistema completo de e-commerce para a loja Martins Class, especializada em moda elegante e atemporal.

## Como executar localmente

Requisitos: Node.js & npm instalados - [instalar com nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Passos:

```sh
# 1. Clone o repositório
git clone <YOUR_GIT_URL>

# 2. Entre no diretório do projeto
cd <YOUR_PROJECT_NAME>

# 3. Instale as dependências
npm i

# 4. Configure as variáveis de ambiente
# Crie um arquivo .env com as credenciais do Supabase

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

## Tecnologias Utilizadas

- Vite
- TypeScript
- React
- Supabase (Backend)
- shadcn-ui
- Tailwind CSS
- Stripe (Pagamentos)

## Painel Administrativo

Para acessar o painel admin:

1. Acesse `/painel/setup` para criar a primeira conta admin
2. Faça login em `/painel` com suas credenciais
3. Gerencie produtos, pedidos, categorias e configurações

## Funcionalidades

- Catálogo de produtos com imagens e filtros
- Carrinho de compras
- Cálculo de frete por CEP
- Checkout via WhatsApp ou pagamento online (Stripe)
- Painel administrativo completo
- Gerenciamento de categorias, estilos e marcas
- Sistema de depoimentos
- Configurações personalizáveis do site

## Build para Produção

```sh
npm run build
```

## Deploy

O projeto pode ser hospedado em qualquer plataforma que suporte aplicações React/Vite, como:

- Vercel
- Netlify
- AWS Amplify
- GitHub Pages

Certifique-se de configurar as variáveis de ambiente do Supabase na plataforma escolhida.
