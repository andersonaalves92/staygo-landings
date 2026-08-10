# StayGoBot Install Kit - Laura para sites de clientes

Este kit instala a Laura em uma página já existente, sem exigir refazer a landing page.

O objetivo é simples:

1. O visitante clica no WhatsApp, em um botão de intenção ou no botão flutuante.
2. A Laura abre uma triagem curta no próprio site.
3. O StayGoBot registra o lead, origem, campanha e intenção.
4. A Laura pode continuar pelo WhatsApp informado.
5. O advogado recebe o lead organizado no sistema.

## Arquivos do kit

- `staygo-laura.css`: aparência do widget da Laura.
- `staygo-laura.js`: lógica de abertura, rastreio e envio para o StayGo.
- `exemplo-instalacao.html`: exemplo completo para o dev copiar.

## Instalação rápida

### 1. Suba os arquivos no site do cliente

Coloque estes dois arquivos no site:

```text
/css/staygo-laura.css
/js/staygo-laura.js
```

Se o site usar outra estrutura, ajuste os caminhos no HTML.

### 2. Adicione o CSS no `<head>`

```html
<link rel="stylesheet" href="/css/staygo-laura.css">
```

### 3. Adicione a configuração antes de fechar o `<body>`

Troque os valores abaixo para a empresa correta.

```html
<script>
  window.STAYGO_LAURA_CONFIG = {
    slug: 'slug-da-empresa-no-staygo',
    company: 'Nome da Empresa',
    assistantName: 'Laura',
    whatsappNumber: '5561999999999',
    defaultArea: 'Criminal',
    defaultCity: 'Brasília/DF',
    capturedFrom: 'site_cliente',
    leadEndpoint: 'https://app.staygobot.com/api/public/capture/slug-da-empresa-no-staygo/leads',
    eventEndpoint: 'https://app.staygobot.com/api/public/capture/slug-da-empresa-no-staygo/events',
    openWhatsappAfterLead: true,
    interceptWhatsappButtons: true
  };
</script>
<script src="/js/staygo-laura.js" defer></script>
```

## Como ligar aos botões existentes

### Botões de WhatsApp

Adicione `class="js-whatsapp"` aos botões existentes.

```html
<a class="js-whatsapp" href="https://wa.me/5561999999999">Falar no WhatsApp</a>
```

Com `interceptWhatsappButtons: true`, esse clique abre a Laura antes do WhatsApp.

### Botões de ligação

Adicione `class="js-phone"` aos links de telefone.

```html
<a class="js-phone" href="tel:+5561999999999">Ligar agora</a>
```

O clique será rastreado no StayGoBot.

### Botões por intenção

Use `class="js-staygo-chat"` e informe a intenção em `data-intent`.

```html
<button class="js-staygo-chat" data-intent="habeas corpus urgente">
  Habeas corpus
</button>
```

## Formulário tradicional

Não é obrigatório.

Para páginas já existentes, a recomendação é usar a Laura como formulário conversacional. Ela coleta:

- nome;
- WhatsApp;
- cidade;
- tipo do caso;
- relato curto.

Se o cliente já tiver formulário, ele pode continuar existindo. O ideal é que o formulário também envie para:

```text
https://app.staygobot.com/api/public/capture/{slug}/leads
```

## Eventos rastreados

O kit registra eventos no StayGo:

- `mini_chat_open`
- `smart_whatsapp_click`
- `call_click`
- `intent_click`
- `lead_magnet_open`
- `mini_chat_lead_submit`

## Observações para advocacia

- Não prometer resultado.
- Não dizer que há garantia de soltura, absolvição ou êxito.
- Usar linguagem de triagem: "entender o caso", "organizar as informações", "encaminhar para análise".
- Em emergência com risco à vida, orientar a pessoa a acionar autoridade competente.

## Teste após instalação

1. Abrir a página em aba anônima.
2. Clicar no botão WhatsApp.
3. Confirmar que a Laura abriu.
4. Enviar um teste com nome e telefone.
5. Verificar se o lead apareceu no StayGoBot.
6. Clicar em telefone e conferir o evento em monitoramento.

## Exemplo de configuração real

```html
<script>
  window.STAYGO_LAURA_CONFIG = {
    slug: 'kelven-criminalista',
    company: 'Kelven Criminalista',
    assistantName: 'Laura',
    whatsappNumber: '556192059571',
    defaultArea: 'Criminal',
    defaultCity: 'Brasília/DF',
    capturedFrom: 'landing_google_ads',
    leadEndpoint: 'https://app.staygobot.com/api/public/capture/kelven-criminalista/leads',
    eventEndpoint: 'https://app.staygobot.com/api/public/capture/kelven-criminalista/events',
    openWhatsappAfterLead: true,
    interceptWhatsappButtons: true
  };
</script>
```
