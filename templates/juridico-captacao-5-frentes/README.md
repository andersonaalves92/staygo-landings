# Template jurídico StayGo - 5 frentes de captação

Base criada a partir da landing do Kelven Criminalista.

## Frentes incluídas

1. Botão WhatsApp inteligente: abre a triagem da Laura antes do WhatsApp direto.
2. Mini chat Laura: coleta nome, WhatsApp, cidade, urgência e relato curto.
3. Páginas por intenção: botões e links separados por tipo de caso.
4. Captura por ligação: cliques em `tel:` são enviados para o StayGo.
5. Lead magnet simples: checklist abre a Laura com intenção pré-preenchida.

## Como usar em um cliente novo

1. Copie os arquivos `staygo-capture.css` e `staygo-capture.js` para a landing.
2. Inclua o CSS no `<head>`.
3. Configure `window.STAYGO_CAPTURE` antes de carregar o JS.
4. Use a classe `js-whatsapp` nos botões que devem abrir a Laura.
5. Use a classe `js-phone` nos links de ligação.
6. Use a classe `js-staygo-chat` com `data-intent` nos botões de intenção.

## Configuração mínima

```html
<link rel="stylesheet" href="/css/staygo-capture.css">

<script>
  window.STAYGO_CAPTURE = {
    slug: 'slug-da-empresa',
    company: 'Nome da empresa',
    assistantName: 'Laura',
    whatsappNumber: '5561999999999',
    defaultArea: 'Criminal',
    defaultCity: 'Brasília/DF',
    capturedFrom: 'landing_ads',
    leadEndpoint: 'https://app.staygobot.com/api/public/capture/slug-da-empresa/leads',
    eventEndpoint: 'https://app.staygobot.com/api/public/capture/slug-da-empresa/events'
  };
</script>
<script src="/js/staygo-capture.js" defer></script>
```

## Observação comercial

Para advocacia, a landing não deve prometer resultado. A função da Laura é acolher, entender urgência, organizar o caso e encaminhar o lead com contexto para o advogado.
