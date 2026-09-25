/* Propriedade do Victor Hub AI.
   Este arquivo é a fonte que o agente do VS Code deve ler antes de apontar domínio ou banco.
   Não coloque segredo aqui. Chave de API não entra neste arquivo. */
(function () {
  const config = {
    version: "1.1.0",
    storageKey: "victor-hub-os-v1",
    dataMode: "local",
    apiBase: "",
    publicOrigin: "",
    brand: "Victor Hub AI",
    owner: "Victor",
    city: "Franca, SP",
    timezone: "America/Sao_Paulo",
    whatsapp: "5516982141822",
    messages: {
      orcamento: "Olá Victor! Quero um orçamento — Victor Hub AI",
      escala: "Olá Victor! Quero o plano Escala Digital — Victor Hub AI",
    },
  };

  function wa(key) {
    const text = (config.messages && config.messages[key]) || config.messages.orcamento;
    return "https://wa.me/" + String(config.whatsapp || "").replace(/\D/g, "") + "?text=" + encodeURIComponent(text);
  }

  config.wa = wa;
  window.VHConfig = config;
})();
