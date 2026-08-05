# StayGo Landings

Landing pages desenvolvidas para clientes da plataforma StayGo.

## Fluxo de trabalho

1. Cadastrar a empresa no StayGo e definir o `publicSlug`.
2. Copiar um template de `templates/` para uma nova pasta com o slug do cliente.
3. Trocar nome, OAB, telefone, e-mail, imagens, domínio e textos principais.
4. Manter o formulário com `data-staygo-slug` igual ao `publicSlug`.
5. Configurar a campanha no StayGo com a URL final da landing.
6. Publicar com `/opt/staygo/scripts/deploy-landings.sh`.
7. Validar em Monitor se houve visita humana, envio do formulário e lead criado.

## Estrutura

- `dalleadvocacia`: landing real com formulário StayGo integrado.
- `sosbrothers`: landing de serviço local.
- `templates/juridico-criminal-staygo`: template base para novos escritórios criminalistas.

## Formulário StayGo

O formulário deve enviar para:

`https://app.staygobot.com/api/public/capture/{publicSlug}/leads`

Campos aceitos pelo backend:

- `contactName`
- `phone`
- `city`
- `area`
- `urgency`
- `message`
- `source`
- `campaign`
- `keyword`
- `pageUrl`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_term`
- `utm_content`
- `device`

O evento `staygo_lead_submit` é enviado para o `dataLayer` quando o lead é capturado.
