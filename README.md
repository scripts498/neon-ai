# NEON AI — pronto para Vercel

O site usa `index.html` como interface e uma função serverless em `api/chat.js` para chamar a Kafox. **Não coloque a chave da API dentro do HTML**: qualquer visitante poderia vê-la.

## Publicar

1. Extraia este ZIP.
2. Envie os arquivos para um repositório GitHub.
3. Importe o repositório na Vercel e faça o Deploy.
4. No projeto da Vercel, abra **Settings → Environment Variables**.
5. Crie a variável `KAFOX_API_KEY` com sua chave Kafox.
6. Salve e faça um novo Deploy.

Não é necessário colocar chave no `index.html`, nem criar arquivo `.env` no navegador.

## Modelos

O seletor lista somente os 23 modelos marcados como gratuitos na tabela fornecida. A função no servidor também valida essa lista e usa `kafox-free` como padrão.

A gratuidade, disponibilidade, limites e eventuais cotas são definidos pelo provedor e podem mudar.
