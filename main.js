const menuButton = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
if (menuButton && mainNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
  mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }));
}
const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const ohmMode = document.querySelector("#ohm-mode");
const labelA = document.querySelector("#ohm-a-label");
const labelB = document.querySelector("#ohm-b-label");
const ohmResult = document.querySelector("#ohm-result");
if (ohmMode && labelA && labelB) {
  const labels = {
    voltage: ["Corriente (A)", "Resistencia (Ω)"],
    current: ["Voltaje (V)", "Resistencia (Ω)"],
    resistance: ["Voltaje (V)", "Corriente (A)"]
  };
  ohmMode.addEventListener("change", () => {
    [labelA.textContent, labelB.textContent] = labels[ohmMode.value];
    document.querySelector("#ohm-a").value = "";
    document.querySelector("#ohm-b").value = "";
    ohmResult.textContent = "Introduce los dos valores conocidos.";
    ohmResult.classList.remove("success");
  });
}
const ohmForm = document.querySelector("#ohm-form");
if (ohmForm) {
  ohmForm.addEventListener("submit", event => {
    event.preventDefault();
    const a = Number(document.querySelector("#ohm-a").value);
    const b = Number(document.querySelector("#ohm-b").value);
    if (!Number.isFinite(a) || !Number.isFinite(b) || a < 0 || b < 0) {
      ohmResult.textContent = "Introduce valores numéricos válidos y no negativos.";
      ohmResult.classList.remove("success");
      return;
    }
    const mode = ohmMode.value;
    let result, unit, formula;
    if (mode === "voltage") { result = a * b; unit = "V"; formula = "V = I × R"; }
    else if (mode === "current") {
      if (b === 0) { ohmResult.textContent = "La resistencia debe ser mayor que cero para calcular la corriente."; ohmResult.classList.remove("success"); return; }
      result = a / b; unit = "A"; formula = "I = V / R";
    } else {
      if (b === 0) { ohmResult.textContent = "La corriente debe ser mayor que cero para calcular la resistencia."; ohmResult.classList.remove("success"); return; }
      result = a / b; unit = "Ω"; formula = "R = V / I";
    }
    ohmResult.textContent = `${formula} → Resultado: ${new Intl.NumberFormat("es-EC", {maximumFractionDigits: 4}).format(result)} ${unit}`;
    ohmResult.classList.add("success");
  });
}
const powerForm = document.querySelector("#power-form");
if (powerForm) {
  powerForm.addEventListener("submit", event => {
    event.preventDefault();
    const v = Number(document.querySelector("#power-voltage").value);
    const i = Number(document.querySelector("#power-current").value);
    const out = document.querySelector("#power-result");
    if (!Number.isFinite(v) || !Number.isFinite(i) || v < 0 || i < 0) {
      out.textContent = "Introduce valores numéricos válidos y no negativos.";
      out.classList.remove("success");
      return;
    }
    const p = v * i;
    const fmt = n => new Intl.NumberFormat("es-EC", {maximumFractionDigits: 4}).format(n);
    let message = `P = V × I → Resultado: ${fmt(p)} W`;
    const hoursField = document.querySelector("#power-hours");
    const hoursText = hoursField ? hoursField.value.trim() : "";
    if (hoursText !== "") {
      const hours = Number(hoursText);
      if (!Number.isFinite(hours) || hours < 0 || hours > 24) {
        out.textContent = "Las horas de uso deben estar entre 0 y 24 al día.";
        out.classList.remove("success");
        return;
      }
      const monthly = (p / 1000) * hours * 30;
      message += ` · Consumo aproximado: ${fmt(monthly)} kWh al mes (30 días)`;
    }
    out.textContent = message;
    out.classList.add("success");
  });
}

const seriesForm = document.querySelector("#series-form");
if (seriesForm) {
  seriesForm.addEventListener("submit", event => {
    event.preventDefault();
    const out = document.querySelector("#series-result");
    const raw = document.querySelector("#resistors").value.trim();
    const values = raw.split(",").map(value => Number(value.trim()));
    if (!raw || values.some(value => !Number.isFinite(value) || value <= 0)) {
      out.textContent = "Escribe resistencias mayores que cero, separadas por comas (por ejemplo: 10, 20, 30).";
      out.classList.remove("success");
      return;
    }
    const type = document.querySelector("#connection-type").value;
    const result = type === "series"
      ? values.reduce((sum, value) => sum + value, 0)
      : 1 / values.reduce((sum, value) => sum + (1 / value), 0);
    const fmt = new Intl.NumberFormat("es-EC", {maximumFractionDigits: 4}).format(result);
    out.textContent = `Resistencia equivalente en ${type === "series" ? "serie" : "paralelo"}: ${fmt} Ω`;
    out.classList.add("success");
  });
}
