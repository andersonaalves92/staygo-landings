(function () {
  const config = window.STAYGO_LAURA_CONFIG || {};
  const leadEndpoint = config.leadEndpoint || "";
  const eventEndpoint = config.eventEndpoint || "";
  const whatsappNumber = String(config.whatsappNumber || "").replace(/\D/g, "");
  const assistantName = config.assistantName || "Laura";
  const interceptWhatsappButtons = config.interceptWhatsappButtons !== false;
  const openWhatsappAfterLead = config.openWhatsappAfterLead !== false;

  function getParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      source: params.get("utm_source") || config.defaultSource || "site",
      campaign: params.get("utm_campaign") || config.defaultCampaign || "",
      keyword: params.get("utm_term") || "",
      content: params.get("utm_content") || "",
      device: params.get("device") || "",
      pageUrl: window.location.href,
      capturedFrom: config.capturedFrom || "site_cliente",
    };
  }

  function track(action, extra) {
    if (!eventEndpoint) return;
    const payload = {
      action,
      slug: config.slug || "",
      company: config.company || "",
      ...getParams(),
      ...(extra || {}),
    };

    fetch(eventEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(function () {});
  }

  function buildWhatsappUrl(name) {
    if (!whatsappNumber) return "";
    const message = config.whatsappMessage || (
      "Olá, sou " + (name || "cliente") + ". Enviei meus dados para a " + assistantName + " pelo site e preciso de atendimento."
    );
    return "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(message);
  }

  function findOption(select, value) {
    const normalized = String(value || "").toLowerCase();
    return Array.from(select.options).find(function (option) {
      return option.value.toLowerCase() === normalized || option.textContent.toLowerCase() === normalized;
    });
  }

  function mountLaura() {
    if (document.querySelector(".staygo-laura-chat")) return;

    const launcher = document.createElement("button");
    launcher.type = "button";
    launcher.className = "staygo-laura-launcher";
    launcher.innerHTML = '<span class="staygo-laura-launcher-icon">L</span><span>Triagem rápida com ' + assistantName + "</span>";

    const chat = document.createElement("aside");
    chat.className = "staygo-laura-chat";
    chat.setAttribute("aria-label", "Triagem rápida com " + assistantName);
    chat.innerHTML = [
      '<div class="staygo-laura-header">',
      '  <div class="staygo-laura-avatar">L</div>',
      '  <div class="staygo-laura-title">',
      '    <strong>' + assistantName + ' - primeiro atendimento</strong>',
      '    <small>Responda em poucas palavras. Eu organizo para o atendimento.</small>',
      '  </div>',
      '  <button type="button" class="staygo-laura-close" aria-label="Fechar">×</button>',
      '</div>',
      '<div class="staygo-laura-body">',
      '  <div class="staygo-laura-bubble">Olá! Me chamo ' + assistantName + ' e vou fazer seu primeiro atendimento. Pode me passar seu caso?</div>',
      '  <div class="staygo-laura-intent-row" aria-label="Atalhos de atendimento">',
      '    <button type="button" class="staygo-laura-intent" data-intent="atendimento urgente">Urgente</button>',
      '    <button type="button" class="staygo-laura-intent" data-intent="quero agendar uma conversa">Agendar</button>',
      '    <button type="button" class="staygo-laura-intent" data-intent="preciso tirar uma dúvida">Dúvida</button>',
      '  </div>',
      '  <form class="staygo-laura-form" id="staygo-laura-form">',
      '    <input type="hidden" name="intent" id="staygo-laura-intent">',
      '    <label>Nome<input name="contactName" autocomplete="name" placeholder="Seu nome" required></label>',
      '    <label>WhatsApp<input name="phone" inputmode="tel" autocomplete="tel" placeholder="(61) 99999-9999" required></label>',
      '    <label>Cidade ou bairro<input name="city" autocomplete="address-level2" placeholder="' + (config.defaultCity || "Cidade") + '"></label>',
      '    <label>Tipo do atendimento<select name="urgency"><option>Atendimento urgente</option><option>Quero agendar uma conversa</option><option>Tenho uma dúvida</option><option>Preciso de retorno</option></select></label>',
      '    <label>O que aconteceu?<textarea name="message" placeholder="Conte em poucas palavras."></textarea></label>',
      '    <button type="submit" class="staygo-laura-submit">Enviar para ' + assistantName + '</button>',
      '    <p class="staygo-laura-status" id="staygo-laura-status">Seu contato será registrado no atendimento da empresa.</p>',
      '  </form>',
      '</div>',
    ].join("");

    document.body.appendChild(launcher);
    document.body.appendChild(chat);

    const form = chat.querySelector("#staygo-laura-form");
    const status = chat.querySelector("#staygo-laura-status");
    const intentInput = chat.querySelector("#staygo-laura-intent");
    const messageInput = form.querySelector("[name='message']");
    const urgencyInput = form.querySelector("[name='urgency']");

    function open(intent, source) {
      chat.classList.add("is-open");
      if (intent) {
        intentInput.value = intent;
        if (!messageInput.value) messageInput.value = "Preciso de atendimento sobre " + intent + ".";
        const option = findOption(urgencyInput, intent);
        if (option) urgencyInput.value = option.value;
      }
      track("mini_chat_open", { intent: intent || "", source: source || "launcher" });
      window.setTimeout(function () {
        const firstInput = form.querySelector("[name='contactName']");
        if (firstInput) firstInput.focus();
      }, 120);
    }

    launcher.addEventListener("click", function () {
      open("", "launcher");
    });

    chat.querySelector(".staygo-laura-close").addEventListener("click", function () {
      chat.classList.remove("is-open");
    });

    chat.querySelectorAll(".staygo-laura-intent").forEach(function (button) {
      button.addEventListener("click", function () {
        const intent = button.getAttribute("data-intent") || "";
        open(intent, "internal_intent");
      });
    });

    document.querySelectorAll(".js-staygo-chat, [data-staygo-intent]").forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        const intent = button.getAttribute("data-intent") || button.getAttribute("data-staygo-intent") || "";
        if (intent.toLowerCase().includes("lead magnet")) track("lead_magnet_open", { intent });
        else track("intent_click", { intent, text: button.textContent.trim() });
        open(intent, "page_intent");
      });
    });

    if (interceptWhatsappButtons) {
      document.querySelectorAll(".js-whatsapp, [data-staygo-whatsapp]").forEach(function (link) {
        link.addEventListener("click", function (event) {
          event.preventDefault();
          event.stopImmediatePropagation();
          track("smart_whatsapp_click", { href: link.href || "", text: link.textContent.trim() });
          open(link.getAttribute("data-intent") || "atendimento urgente", "whatsapp_button");
        }, true);
      });
    } else {
      document.querySelectorAll(".js-whatsapp, [data-staygo-whatsapp]").forEach(function (link) {
        link.addEventListener("click", function () {
          track("whatsapp_click", { href: link.href || "", text: link.textContent.trim() });
        });
      });
    }

    document.querySelectorAll(".js-phone, a[href^='tel:']").forEach(function (link) {
      link.addEventListener("click", function () {
        track("call_click", { href: link.href || "", text: link.textContent.trim() });
      });
    });

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      if (!leadEndpoint) {
        status.className = "staygo-laura-status is-error";
        status.textContent = "Configuração incompleta: leadEndpoint não informado.";
        return;
      }

      const button = form.querySelector("button[type='submit']");
      const originalText = button.textContent;
      button.disabled = true;
      button.textContent = "Enviando...";
      status.className = "staygo-laura-status";
      status.textContent = "Organizando seu atendimento...";

      const data = new FormData(form);
      const payload = {
        contactName: String(data.get("contactName") || "").trim(),
        phone: String(data.get("phone") || "").trim(),
        city: String(data.get("city") || "").trim() || config.defaultCity || "",
        area: config.defaultArea || "",
        urgency: String(data.get("urgency") || data.get("intent") || "Atendimento").trim(),
        message: String(data.get("message") || data.get("intent") || "Preciso de atendimento.").trim(),
        ...getParams(),
      };

      try {
        const response = await fetch(leadEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await response.json().catch(function () { return {}; });
        if (!response.ok) throw new Error(result.error || "Falha ao registrar atendimento");

        status.className = "staygo-laura-status is-success";
        status.textContent = "Pronto. A " + assistantName + " recebeu seu contato e vai organizar o atendimento.";
        track("mini_chat_lead_submit", {
          phone: payload.phone,
          urgency: payload.urgency,
          leadId: result.leadId || "",
        });

        if (openWhatsappAfterLead && whatsappNumber) {
          window.setTimeout(function () {
            window.open(buildWhatsappUrl(payload.contactName), "_blank", "noopener");
          }, 900);
        }
      } catch (error) {
        status.className = "staygo-laura-status is-error";
        status.textContent = "Não consegui registrar agora. Tente novamente ou use o telefone da página.";
        button.disabled = false;
        button.textContent = originalText;
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountLaura);
  } else {
    mountLaura();
  }
})();
