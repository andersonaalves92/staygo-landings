# Template Jurídico Criminal StayGo

Use este template para criar novas landing pages de advogados criminalistas.

## Como usar

1. Copie a pasta para `../nome-do-cliente`.
2. Substitua os placeholders no `index.html`:
   - `{{ADVOGADO_NOME}}`
   - `{{ADVOGADO_PRIMEIRO_NOME}}`
   - `{{OAB}}`
   - `{{PUBLIC_SLUG}}`
   - `{{WHATSAPP_DIGITS}}`
   - `{{WHATSAPP_FORMATADO}}`
   - `{{EMAIL}}`
   - `{{INSTAGRAM}}`
3. Troque as imagens em `img/`.
4. Confira se `data-staygo-slug` é igual ao slug cadastrado no StayGo.
5. Publique com o script de deploy de landings.

## Fluxo pronto

Landing page -> formulário StayGo -> Laura -> CRM -> repasse ao advogado -> relatório.

O formulário também mantém fallback para WhatsApp caso a API pública não responda.
