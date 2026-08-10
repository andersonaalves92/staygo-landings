(function () {
  const config = window.STAYGO_CAPTURE || {};
  const leadEndpoint = config.leadEndpoint;
  const eventEndpoint = config.eventEndpoint;
  const whatsappNumber = String(config.whatsappNumber || "").replace(/\D/g, "");

  function campaignParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      source: params.get("utm_source") || "google",
      campaign: params.get("utm_campaign") || "landing_ads",
      keyword: params.get("utm_term") || "",
      content: params.get("utm_content") || "",
      pageUrl: window.location.href,
      device: params.get("device") || "",
      capturedFrom: config.capturedFrom || "landing_page",
    };
  }

  function track(action, extra) {
    if (!eventEndpoint) return;
    fetch(eventEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...campaignParams(), ...(extra || {}) }),
      keepalive: true,
    }).catch(function () {});
  }

  function waUrl(message) {
    const text = message || "Olá, vim pelo site e preciso de atendimento.";
    return "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(text);
  }

  function createWidget() {
    const launcher = document.createElement("button");
    launcher.type = "button";
    launcher.className = "staygo-launcher";
    launcher.innerHTML = "<span>L</span> Triagem rápida com a Laura";

    const chat = document.createElement("aside");
    chat.className = "staygo-chat";
    chat.setAttribute("aria-label", "Triagem rápida com a Laura");
    chat.innerHTML = [
      '<div class="staygo-chat-header">',
      '  <div class="staygo-avatar">L</div>',
      '  <div class="staygo-chat-title"><strong>Laura - primeiro atendimento</strong><small>Responda em poucas palavras. Eu organizo para o advogado.</small></div>',
      '  <button type="button" class="staygo-chat-close" aria-label="Fechar">×</button>',
      '</div>',
      '<div class="staygo-chat-body">',
      '  <div class="staygo-bubble">Olá! Me chamo Laura e vou fazer seu primeiro atendimento. Pode me passar seu caso?</div>',
      '  <form class="staygo-form-grid" id="staygo-chat-form">',
      '    <input type="hidden" name="intent" id="staygo-intent">',
      '    <label>Nome<input name="contactName" autocomplete="name" placeholder="Seu nome" required></label>',
      '    <label>WhatsApp<input name="phone" inputmode="tel" autocomplete="tel" placeholder="(61) 99999-9999" required></label>',
      '    <label>Cidade ou bairro<input name="city" autocomplete="address-level2" placeholder="Ex.: Brasília, Taguatinga"></label>',
      '    <label>Tipo do caso<select name="urgency"><option>Atendimento urgente</option><option>Habeas corpus</option><option>Audiência de custódia</option><option>Prisão em flagrante</option><option>Mandado de prisão</option><option>Intimação policial</option><option>Acompanhamento em delegacia</option></select></label>',
      '    <label>O que aconteceu?<textarea name="message" placeholder="Conte em poucas palavras."></textarea></label>',
      '    <button type="submit" class="staygo-submit">Enviar para a Laura</button>',
      '    <p class="staygo-status" id="staygo-status">A Laura registra no StayGoBot e pode continuar pelo WhatsApp informado.</p>',
      '  </form>',
      '</div>',
    ].join("");

    document.body.appendChild(launcher);
    document.body.appendChild(chat);

    const form = chat.querySelector("#staygo-chat-form");
    const status = chat.querySelector("#staygo-status");
    const intentInput = chat.querySelector("#staygo-intent");
    const messageInput = form.querySelector("[name='message']");

    function open(intent) {
      chat.classList.add("is-open");
      if (intent) {
        intentInput.value = intent;
        if (!messageInput.value) messageInput.value = "Preciso de atendimento sobre " + intent + ".";
      }
      track("mini_chat_open", { intent: intent || "" });
      window.setTimeout(function () {
        const firstInput = form.querySelector("[name='contactName']");
        if (firstInput) firstInput.focus();
      }, 120);
    }

    launcher.addEventListener("click", function () { open(""); });
    chat.querySelector(".staygo-chat-close").addEventListener("click", function () { chat.classList.remove("is-open"); });

    document.querySelectorAll(".js-staygo-chat").forEach(function (button) {
      button.addEventListener("click", function () {
        const intent = button.getAttribute("data-intent") || "";
        if (intent.includes("lead magnet")) track("lead_magnet_open", { intent });
        open(intent);
      });
    });

    document.querySelectorAll(".js-whatsapp").forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        track("smart_whatsapp_click", { href: link.href });
        open("atendimento urgente");
      }, true);
    });

    document.querySelectorAll(".js-phone").forEach(function (link) {
      link.addEventListener("click", function () { track("call_click", { href: link.href }); });
    });

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      if (!leadEndpoint) return;
      const button = form.querySelector("button[type='submit']");
      const originalText = button.textContent;
      button.disabled = true;
      button.textContent = "Enviando...";
      status.className = "staygo-status";
      status.textContent = "Organizando seu atendimento no StayGoBot...";

      const data = new FormData(form);
      const payload = {
        contactName: String(data.get("contactName") || "").trim(),
        phone: String(data.get("phone") || "").trim(),
        city: String(data.get("city") || "").trim() || config.defaultCity || "",
        area: config.defaultArea || "Criminal",
        urgency: String(data.get("urgency") || data.get("intent") || "Atendimento urgente").trim(),
        message: String(data.get("message") || data.get("intent") || "Preciso de atendimento.").trim(),
        ...campaignParams(),
      };

      try {
        const response = await fetch(leadEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await response.json().catch(function () { return {}; });
        if (!response.ok) throw new Error(result.error || "Falha ao registrar atendimento");
        status.className = "staygo-status is-success";
        status.textContent = "Pronto. A Laura recebeu seu caso e vai continuar pelo WhatsApp informado.";
        track("mini_chat_lead_submit", { phone: payload.phone, urgency: payload.urgency });
        if (whatsappNumber) {
          window.setTimeout(function () {
            const text = "Olá, sou " + (payload.contactName || "cliente") + ". Enviei meus dados para a Laura pelo site e preciso de atendimento.";
            window.open(waUrl(text), "_blank", "noopener");
          }, 900);
        }
      } catch (error) {
        status.className = "staygo-status is-error";
        status.textContent = "Não consegui registrar agora. Toque em ligar ou tente novamente.";
        button.disabled = false;
        button.textContent = originalText;
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", createWidget);
  else createWidget();
})();
