import "./style.css";

const appContainer = document.createElement("div");
appContainer.className = "app-container";
document.body.appendChild(appContainer);

const header = document.createElement("div");
header.className = "header";
appContainer.appendChild(header);
//watermark

const watermark = document.createElement("div");
watermark.className = "watermark";
watermark.innerHTML = `
  <h1>Irfan Emre Utkan</h1>
  <br />
  <h2>QR Code generator</h2>
`;
header.appendChild(watermark);

// ECC toolbar (top-right)
const eccToolbar = document.createElement("div");
eccToolbar.className = "ecc-toolbar";
header.appendChild(eccToolbar);
// Create main container
const outerDiv = document.createElement("div");
appContainer.appendChild(outerDiv);
outerDiv.className = "container";

// Content area with left sidebar (20%), center inputs (40%), right preview (40%)
const content = document.createElement("div");
content.className = "content";

outerDiv.appendChild(content);

const sidebar = document.createElement("aside");
sidebar.className = "sidebar";
content.appendChild(sidebar);

const sidebarHeader = document.createElement("div");
sidebarHeader.className = "sidebar-header";
const sidebarTitle = document.createElement("span");
sidebarTitle.textContent = "Types";
const collapseBtn = document.createElement("button");
collapseBtn.className = "sidebar-collapse";
collapseBtn.setAttribute("aria-label", "Collapse sidebar");
collapseBtn.textContent = "⟨";
sidebarHeader.appendChild(sidebarTitle);
sidebarHeader.appendChild(collapseBtn);
sidebar.appendChild(sidebarHeader);

const centerCol = document.createElement("div");
centerCol.className = "center";
content.appendChild(centerCol);

const previewCol = document.createElement("div");
previewCol.className = "preview";
content.appendChild(previewCol);

// Create input container (center column)
const inputContainer = document.createElement("div");
inputContainer.className = "link-input-container";
centerCol.appendChild(inputContainer);

// Create input switcher
const inputSwitcher = document.createElement("div");
inputSwitcher.className = "input-switcher";
sidebar.appendChild(inputSwitcher);

// Create QR code display area (right column)
const qrDisplay = document.createElement("div");
qrDisplay.className = "qr-display";
previewCol.appendChild(qrDisplay);

const qrImage = document.createElement("img");
qrImage.className = "qr-code";
qrDisplay.appendChild(qrImage);

const qrText = document.createElement("p");
qrText.className = "qr-text";
qrText.textContent =
  "Select a type and enter your content to generate a QR code";
qrDisplay.appendChild(qrText);

// Add download button
const downloadBtn = document.createElement("button");
downloadBtn.className = "download-btn";
downloadBtn.textContent = "Download QR Code";
downloadBtn.style.display = "none";
downloadBtn.addEventListener("click", () => {
  if (qrImage.src && qrImage.src !== "") {
    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = qrImage.src;
    link.click();
  }
});
qrDisplay.appendChild(downloadBtn);

// Meta info container
const qrMeta = document.createElement("div");
qrMeta.className = "qr-meta";
qrDisplay.appendChild(qrMeta);

// ECC toolbar buttons
type ECCLevel = "L" | "M" | "Q" | "H";
const eccLevels: ECCLevel[] = ["L", "M", "Q", "H"];
let currentECC: ECCLevel = "H";
let lastPayloadText = "";
let lastDescription = "";
const eccInfo: Record<ECCLevel, string> = {
  L: "L: Low error correction (~7% recovery). Highest capacity, lowest resilience.",
  M: "M: Medium error correction (~15% recovery). Balanced for most cases.",
  Q: "Q: Quartile error correction (~25% recovery). Higher resilience, lower capacity.",
  H: "H: High error correction (~30% recovery). Most resilient, lowest capacity.",
};
const eccButtons: Record<ECCLevel, HTMLButtonElement> = {
  L: document.createElement("button"),
  M: document.createElement("button"),
  Q: document.createElement("button"),
  H: document.createElement("button"),
};
for (const lvl of eccLevels) {
  const btn = eccButtons[lvl];
  btn.className = "ecc-btn";
  btn.textContent = lvl;
  btn.setAttribute("data-level", lvl);
  btn.title = eccInfo[lvl];
  if (lvl === currentECC) btn.classList.add("active");
  btn.addEventListener("click", () => {
    if (btn.disabled) return;
    currentECC = lvl;
    for (const l of eccLevels) eccButtons[l].classList.remove("active");
    btn.classList.add("active");
    if (lastPayloadText) {
      const url = buildQRUrl(lastPayloadText, currentECC);
      qrImage.src = url;
      qrText.textContent = lastDescription;
      downloadBtn.style.display = "inline-block";
    }
  });
  eccToolbar.appendChild(btn);
}

// Create the input toggle buttons
const urlInput = document.createElement("button");
urlInput.className = "input-toggle";
urlInput.innerHTML = `<span class="btn-ic"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 3h7v7h-2V6.41l-7.29 7.3-1.42-1.42 7.3-7.29H14V3zM3 14h2v3.59l7.29-7.3 1.42 1.42-7.3 7.29H10v2H3v-7z"/></svg></span><span>URL</span>`;
inputSwitcher.appendChild(urlInput);

const textInput = document.createElement("button");
textInput.innerHTML = `<span class="btn-ic"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3V4zm0 6h12v2H3v-2zm0 6h18v2H3v-2z"/></svg></span><span>Text</span>`;
textInput.className = "input-toggle";
inputSwitcher.appendChild(textInput);

const phoneInput = document.createElement("button");
phoneInput.className = "input-toggle";
phoneInput.innerHTML = `<span class="btn-ic"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.05-.24c1.12.37 2.33.57 3.54.57a1 1 0 011 1V21a1 1 0 01-1 1C10.07 22 2 13.93 2 3a1 1 0 011-1h3.5a1 1 0 011 1c0 1.21.2 2.42.57 3.54a1 1 0 01-.24 1.05l-2.2 2.2z"/></svg></span><span>Phone Number</span>`;
inputSwitcher.appendChild(phoneInput);

const wifiInput = document.createElement("button");
wifiInput.className = "input-toggle";
wifiInput.innerHTML = `<span class="btn-ic"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 18c.83 0 1.5.67 1.5 1.5S12.83 21 12 21s-1.5-.67-1.5-1.5S11.17 18 12 18zm-7-5l1.41 1.41A7.96 7.96 0 0112 13c2.21 0 4.21.9 5.66 2.34L19.07 13A10.97 10.97 0 0012 10c-3.03 0-5.78 1.23-7.74 3zM2 8l1.41 1.41A13.93 13.93 0 0112 6c3.87 0 7.39 1.57 9.93 4.11L23 9a15.91 15.91 0 00-11-5C7.03 4 2.53 5.64 0 8.59L2 8z"/></svg></span><span>Wifi</span>`;
inputSwitcher.appendChild(wifiInput);

const smsInput = document.createElement("button");
smsInput.className = "input-toggle";
smsInput.innerHTML = `<span class="btn-ic"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z"/></svg></span><span>SMS</span>`;
inputSwitcher.appendChild(smsInput);

const emailInput = document.createElement("button");
emailInput.className = "input-toggle";
emailInput.innerHTML = `<span class="btn-ic"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg></span><span>Email</span>`;
inputSwitcher.appendChild(emailInput);

const vcardInput = document.createElement("button");
vcardInput.className = "input-toggle";
vcardInput.innerHTML = `<span class="btn-ic"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm-9 9a9 9 0 1118 0H3z"/></svg></span><span>vCard</span>`;
inputSwitcher.appendChild(vcardInput);

const eventInput = document.createElement("button");
eventInput.className = "input-toggle";
eventInput.innerHTML = `<span class="btn-ic"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v13a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 15H5V10h14v9z"/></svg></span><span>Event</span>`;
inputSwitcher.appendChild(eventInput);

const socialInput = document.createElement("button");
socialInput.className = "input-toggle";
socialInput.innerHTML = `<span class="btn-ic"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5z"/></svg></span><span>Social</span>`;
inputSwitcher.appendChild(socialInput);

// Deep link types as separate buttons
const whatsappInput = document.createElement("button");
whatsappInput.className = "input-toggle";
whatsappInput.innerHTML = `<span class=\"btn-ic\"><svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M16.2 13.6c-.2-.1-1.2-.6-1.3-.7-.2-.1-.3-.1-.5.1s-.6.7-.8.8c-.1.1-.3.1-.5 0-.2-.1-.8-.3-1.5-.9-.6-.5-1-1.2-1.1-1.4-.1-.2 0-.3.1-.4.1-.1.2-.3.3-.4.1-.1.1-.2.2-.3.1-.1.1-.2 0-.4s-.5-1.1-.7-1.5c-.2-.4-.3-.3-.5-.3h-.4c-.1 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.4c.1.2 1.6 2.6 3.9 3.6.5.2.9.3 1.2.4.5.2 1 .2 1.3.1.4-.1 1.2-.5 1.4-1 .2-.5.2-.9.1-1 0-.1-.2-.1-.4-.2zM12 2a10 10 0 00-8.94 14.56L2 22l5.63-1.48A10 10 0 1012 2z\"/></svg></span><span>WhatsApp</span>`;
inputSwitcher.appendChild(whatsappInput);

const spotifyInput = document.createElement("button");
spotifyInput.className = "input-toggle";
spotifyInput.innerHTML = `<span class=\"btn-ic\"><svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M12 2a10 10 0 100 20 10 10 0 000-20zm4.29 14.29a.75.75 0 01-1.03.2c-2.83-1.73-6.4-2.12-10.6-1.17a.75.75 0 01-.33-1.45c4.57-1.05 8.49-.6 11.62 1.33.35.22.46.68.2 1.09zm1.48-3.06a.9.9 0 01-1.24.24c-3.24-1.98-8.18-2.56-12.01-1.42a.9.9 0 01-.52-1.72c4.3-1.29 9.74-.64 13.5 1.65.42.26.56.82.27 1.25zm.13-3.11c-3.77-2.24-10.04-2.45-13.64-1.35a1.05 1.05 0 11-.62-2.02c4.13-1.27 11.07-1 15.38 1.58a1.05 1.05 0 11-1.12 1.79z\"/></svg></span><span>Spotify</span>`;
inputSwitcher.appendChild(spotifyInput);

const uberInput = document.createElement("button");
uberInput.className = "input-toggle";
uberInput.innerHTML = `<span class=\"btn-ic\"><svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M18 11H6V7H4v10h2v-4h12v4h2V7h-2z\"/></svg></span><span>Uber</span>`;
inputSwitcher.appendChild(uberInput);

const telegramInput = document.createElement("button");
telegramInput.className = "input-toggle";
telegramInput.innerHTML = `<span class=\"btn-ic\"><svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M9.04 15.81l-.38 5.33c.54 0 .77-.23 1.05-.5l2.53-2.43 5.24 3.84c.96.53 1.65.25 1.9-.9l3.45-16.18.01-.01c.31-1.45-.52-2.02-1.46-1.67L1.7 9.77C.28 10.33.29 11.18 1.44 11.54l5.3 1.65 12.3-7.75c.58-.35 1.1-.16.67.22L9.04 15.81z\"/></svg></span><span>Telegram</span>`;
inputSwitcher.appendChild(telegramInput);

const messengerInput = document.createElement("button");
messengerInput.className = "input-toggle";
messengerInput.innerHTML = `<span class=\"btn-ic\"><svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M12 2C6.48 2 2 6.01 2 10.96c0 2.73 1.35 5.18 3.52 6.84V22l3.21-1.76c1.01.28 2.07.44 3.27.44 5.52 0 10-4.01 10-8.96S17.52 2 12 2zm1.04 11.79l-2.24-2.4-4.3 2.4 4.77-5.2 2.2 2.4 4.36-2.4-4.79 5.2z\"/></svg></span><span>Messenger</span>`;
inputSwitcher.appendChild(messengerInput);

const facetimeInput = document.createElement("button");
facetimeInput.className = "input-toggle";
facetimeInput.innerHTML = `<span class=\"btn-ic\"><svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M17 10.5V7a2 2 0 00-2-2H5C3.9 5 3 5.9 3 7v10a2 2 0 002 2h10a2 2 0 002-2v-3.5l4 4v-11l-4 4z\"/></svg></span><span>FaceTime</span>`;
inputSwitcher.appendChild(facetimeInput);

const imessageInput = document.createElement("button");
imessageInput.className = "input-toggle";
imessageInput.innerHTML = `<span class=\"btn-ic\"><svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z\"/></svg></span><span>iMessage</span>`;
inputSwitcher.appendChild(imessageInput);

const youtubeInput = document.createElement("button");
youtubeInput.className = "input-toggle";
youtubeInput.innerHTML = `<span class=\"btn-ic\"><svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M10 15l5.19-3L10 9v6z\"/><path d=\"M21.58 7.19a2.78 2.78 0 00-1.95-1.96C17.88 4.75 12 4.75 12 4.75s-5.88 0-7.63.48a2.78 2.78 0 00-1.95 1.96C2 8.94 2 12 2 12s0 3.06.42 4.81c.26.95 1.02 1.69 1.95 1.95C6.12 19.25 12 19.25 12 19.25s5.88 0 7.63-.48a2.78 2.78 0 001.95-1.95C22 15.06 22 12 22 12s0-3.06-.42-4.81z\"/></svg></span><span>YouTube</span>`;
inputSwitcher.appendChild(youtubeInput);

// Additional new types (Payments removed per request)

const mecardInput = document.createElement("button");
mecardInput.className = "input-toggle";
mecardInput.innerHTML = `<span class=\"btn-ic\"><svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M12 12a5 5 0 100-10 5 5 0 000 10zm-9 9a9 9 0 1118 0H3z\"/></svg></span><span>MeCard</span>`;
inputSwitcher.appendChild(mecardInput);

const directionsInput = document.createElement("button");
directionsInput.className = "input-toggle";
directionsInput.innerHTML = `<span class=\"btn-ic\"><svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M21.71 11.29l-9-9a1 1 0 00-1.42 0l-9 9a1 1 0 000 1.42l9 9a1 1 0 001.42 0l9-9a1 1 0 000-1.42zM12 20l-8-8 8-8 8 8-8 8z\"/></svg></span><span>Directions</span>`;
inputSwitcher.appendChild(directionsInput);

// Reorder buttons alphabetically by label
const orderedButtons: HTMLButtonElement[] = [
  directionsInput,
  emailInput,
  eventInput,
  facetimeInput,
  imessageInput,
  mecardInput,
  messengerInput,
  phoneInput,
  smsInput,
  socialInput,
  spotifyInput,
  telegramInput,
  textInput,
  uberInput,
  urlInput,
  whatsappInput,
  wifiInput,
  youtubeInput,
  vcardInput,
];
inputSwitcher.innerHTML = "";
for (const btn of orderedButtons) inputSwitcher.appendChild(btn);

// Add active state management for input toggles
const inputToggles = document.querySelectorAll(".input-toggle");
inputToggles.forEach((button) => {
  button.addEventListener("click", () => {
    inputToggles.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  });
});

// Helpers
const clearAndStack = (stack: boolean) => {
  inputContainer.innerHTML = "";
  if (stack) {
    inputContainer.classList.add("stacked");
  } else {
    inputContainer.classList.remove("stacked");
  }
};

const createConfirmButton = (label = "Generate QR") => {
  const confirmButton = document.createElement("button");
  confirmButton.textContent = label;
  confirmButton.className = "generate-btn";
  return confirmButton;
};

const createField = (
  labelText: string,
  options:
    | { kind: "input"; type?: string; placeholder?: string }
    | { kind: "select"; options: Array<{ label: string; value: string }> }
) => {
  const wrapper = document.createElement("div");
  wrapper.className = "field-group";

  const label = document.createElement("label");
  label.textContent = labelText;
  wrapper.appendChild(label);

  if (options.kind === "input") {
    const input = document.createElement("input");
    input.type = options.type ?? "text";
    if (options.placeholder) input.placeholder = options.placeholder;
    wrapper.appendChild(input);
  } else {
    const select = document.createElement("select");
    for (const opt of options.options) {
      const option = document.createElement("option");
      option.value = opt.value;
      option.textContent = opt.label;
      select.appendChild(option);
    }
    wrapper.appendChild(select);
  }
  return wrapper;
};

// Validation helpers
const getInputEl = (wrapper: HTMLElement) =>
  wrapper.querySelector("input") as HTMLInputElement;
const getSelectEl = (wrapper: HTMLElement) =>
  wrapper.querySelector("select") as HTMLSelectElement;
const clearFieldError = (wrapper: HTMLElement) => {
  wrapper.classList.remove("invalid");
  const err = wrapper.querySelector(".field-error");
  if (err) err.remove();
};
const showFieldError = (wrapper: HTMLElement, message: string) => {
  clearFieldError(wrapper);
  wrapper.classList.add("invalid");
  const div = document.createElement("div");
  div.className = "field-error";
  div.textContent = message;
  wrapper.appendChild(div);
};
const isValidURL = (value: string) => {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};
const isValidEmail = (value: string) => /.+@.+\..+/.test(value);
const isValidPhone = (value: string) =>
  /^[+]?\d[\d\s-]{5,}$/.test(value.replace(/\(|\)/g, ""));
const isValidLat = (n: number) => Number.isFinite(n) && n >= -90 && n <= 90;
const isValidLon = (n: number) => Number.isFinite(n) && n >= -180 && n <= 180;
const isValidYouTubeId = (v: string) => /^[a-zA-Z0-9_-]{11}$/.test(v);
const isValidSpotifyId = (v: string) => /^[a-zA-Z0-9]{22}$/.test(v);

// Function to show QR code and download button
const showQRCode = (qrUrl: string, description: string) => {
  qrImage.src = qrUrl;
  qrText.textContent = description;
  downloadBtn.style.display = "inline-block";
};

const showQRCodeWithECC = async (text: string, description: string) => {
  lastPayloadText = text;
  lastDescription = description;
  const ecc = await chooseBestECC(text);
  const url = buildQRUrl(text, ecc);
  qrImage.src = url;
  qrText.textContent = description;
  downloadBtn.style.display = "inline-block";
  // Update meta info
  const sizeBytes = new TextEncoder().encode(text).length;
  qrMeta.innerHTML = "";
  const rows: Array<[string, string]> = [
    ["ECC", ecc],
    ["Payload", `${sizeBytes} bytes`],
    ["Preview URL", url],
  ];
  for (const [k, v] of rows) {
    const kEl = document.createElement("div");
    kEl.className = "label";
    kEl.textContent = k;
    const vEl = document.createElement("div");
    vEl.textContent = v;
    qrMeta.appendChild(kEl);
    qrMeta.appendChild(vEl);
  }
};

// Utilities specific to certain types
const getQRCodeLib = () => (window as any).QRCode as any;
const canEncodeWithECC = async (
  text: string,
  level: ECCLevel
): Promise<boolean> => {
  try {
    const QRCode = getQRCodeLib();
    if (!QRCode) return true; // if lib missing, don't block
    await QRCode.toString(text, { errorCorrectionLevel: level, type: "svg" });
    return true;
  } catch {
    return false;
  }
};

const chooseBestECC = async (text: string): Promise<ECCLevel> => {
  const availability: Partial<Record<ECCLevel, boolean>> = {};
  for (const lvl of eccLevels)
    availability[lvl] = await canEncodeWithECC(text, lvl);
  for (const lvl of eccLevels) {
    const btn = eccButtons[lvl];
    btn.disabled = !availability[lvl];
  }
  const priority: ECCLevel[] = ["H", "Q", "M", "L"];
  if (availability[currentECC]) {
    for (const l of eccLevels) eccButtons[l].classList.remove("active");
    eccButtons[currentECC].classList.add("active");
    return currentECC;
  }
  const fallback = priority.find((lvl) => availability[lvl]);
  const chosen = fallback ?? "L";
  currentECC = chosen;
  for (const l of eccLevels) eccButtons[l].classList.remove("active");
  eccButtons[currentECC].classList.add("active");
  return chosen;
};

const buildQRUrl = (text: string, ecc: ECCLevel): string => {
  const encodedText = encodeURIComponent(text);
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&ecc=${ecc}&data=${encodedText}`;
};
const toIcsDateTimeLocal = (value: string): string => {
  // value expected like "YYYY-MM-DDTHH:MM" or "YYYY-MM-DDTHH:MM:SS"
  if (!value) return "";
  const [datePart, timePart = "00:00"] = value.split("T");
  const date = datePart.replaceAll("-", "");
  const time = timePart.replaceAll(":", "");
  const padded = time.length === 4 ? `${time}00` : time.padEnd(6, "0");
  return `${date}T${padded}`;
};

const toIcsTimestampUTC = (): string => {
  const d = new Date();
  const YYYY = d.getUTCFullYear().toString().padStart(4, "0");
  const MM = (d.getUTCMonth() + 1).toString().padStart(2, "0");
  const DD = d.getUTCDate().toString().padStart(2, "0");
  const hh = d.getUTCHours().toString().padStart(2, "0");
  const mm = d.getUTCMinutes().toString().padStart(2, "0");
  const ss = d.getUTCSeconds().toString().padStart(2, "0");
  return `${YYYY}${MM}${DD}T${hh}${mm}${ss}Z`;
};

const foldIcsLine = (line: string): string => {
  // Simple folding at 70 chars as per RFC 5545
  const limit = 70;
  if (line.length <= limit) return line;
  const chunks: string[] = [];
  let idx = 0;
  while (idx < line.length) {
    const end = Math.min(idx + limit, line.length);
    const chunk = line.slice(idx, end);
    chunks.push(idx === 0 ? chunk : ` ${chunk}`);
    idx = end;
  }
  return chunks.join("\n");
};

// ETH helper removed with Payments

// Renderers with QR generation
const renderURL = () => {
  clearAndStack(false);
  const urlField = createField("URL", {
    kind: "input",
    type: "text",
    placeholder: "https://example.com",
  });
  inputContainer.appendChild(urlField);

  const confirmBtn = createConfirmButton();
  confirmBtn.addEventListener("click", () => {
    const url = getInputEl(urlField).value.trim();
    clearFieldError(urlField);
    if (!isValidURL(url)) {
      showFieldError(urlField, "Enter a valid http(s) URL");
      return;
    }
    showQRCodeWithECC(url, `QR Code for: ${url}`);
  });
  inputContainer.appendChild(confirmBtn);
};

const renderText = () => {
  clearAndStack(false);
  const t = document.createElement("input");
  t.type = "text";
  t.placeholder = "Enter the text to encode";
  t.className = "text-input";
  inputContainer.appendChild(t);

  const confirmBtn = createConfirmButton();
  confirmBtn.addEventListener("click", () => {
    const text = t.value.trim();
    if (text) {
      showQRCodeWithECC(text, `QR Code for: ${text}`);
    }
  });
  inputContainer.appendChild(confirmBtn);
};

const renderPhone = () => {
  clearAndStack(true);
  const country = createField("Country", {
    kind: "select",
    options: [
      { label: "Turkey (+90)", value: "+90" },
      { label: "United States (+1)", value: "+1" },
      { label: "United Kingdom (+44)", value: "+44" },
      { label: "Germany (+49)", value: "+49" },
    ],
  });
  const number = createField("Phone number", {
    kind: "input",
    type: "tel",
    placeholder: "### ### ####",
  });
  inputContainer.appendChild(country);
  inputContainer.appendChild(number);

  const confirmBtn = createConfirmButton();
  confirmBtn.addEventListener("click", () => {
    const countryCode = (country.querySelector("select") as HTMLSelectElement)
      .value;
    const phoneNumber = getInputEl(number).value.trim();
    clearFieldError(number);
    if (!isValidPhone(phoneNumber)) {
      showFieldError(number, "Enter a valid phone number");
      return;
    }
    const phoneText = `tel:${countryCode}${phoneNumber.replace(/\s/g, "")}`;
    showQRCodeWithECC(
      phoneText,
      `QR Code for phone: ${countryCode} ${phoneNumber}`
    );
  });
  inputContainer.appendChild(confirmBtn);
};

const renderWifi = () => {
  clearAndStack(true);
  const encryption = createField("Encryption", {
    kind: "select",
    options: [
      { label: "WPA/WPA2", value: "WPA" },
      { label: "WEP", value: "WEP" },
      { label: "None", value: "nopass" },
    ],
  });
  const ssid = createField("Wi‑Fi SSID", {
    kind: "input",
    type: "text",
    placeholder: "Network name",
  });
  const password = createField("Password", {
    kind: "input",
    type: "password",
    placeholder: "••••••••",
  });
  const hidden = createField("Hidden SSID", {
    kind: "select",
    options: [
      { label: "No", value: "false" },
      { label: "Yes", value: "true" },
    ],
  });

  inputContainer.appendChild(encryption);
  inputContainer.appendChild(ssid);
  inputContainer.appendChild(password);
  inputContainer.appendChild(hidden);

  const confirmBtn = createConfirmButton();
  confirmBtn.addEventListener("click", () => {
    const enc = getSelectEl(encryption).value;
    const networkName = getInputEl(ssid).value.trim();
    const pwd = getInputEl(password).value.trim();
    clearFieldError(ssid);
    clearFieldError(password);
    if (!networkName) {
      showFieldError(ssid, "SSID is required");
      return;
    }
    if (enc !== "nopass" && pwd.length === 0) {
      showFieldError(password, "Password required for WPA/WEP");
      return;
    }
    let wifiString = `WIFI:S:${networkName};T:${enc}`;
    if (enc !== "nopass" && pwd) {
      wifiString += `;P:${pwd}`;
    }
    const isHidden = getSelectEl(hidden).value === "true";
    if (isHidden) wifiString += `;H:true`;
    wifiString += ";";
    showQRCodeWithECC(wifiString, `QR Code for Wi-Fi: ${networkName}`);
  });
  inputContainer.appendChild(confirmBtn);

  // Hide password when encryption is none
  const encryptionSelect = encryption.querySelector("select");
  const passwordInputWrapper = password as HTMLDivElement;
  const togglePasswordVisibility = () => {
    if ((encryptionSelect as HTMLSelectElement).value === "nopass") {
      passwordInputWrapper.style.display = "none";
    } else {
      passwordInputWrapper.style.display = "flex";
    }
  };
  encryptionSelect?.addEventListener("change", togglePasswordVisibility);
  togglePasswordVisibility();
};

const renderSMS = () => {
  clearAndStack(true);
  const to = createField("Recipient", {
    kind: "input",
    type: "tel",
    placeholder: "+90 ### ### ####",
  });
  const body = createField("Message", {
    kind: "input",
    type: "text",
    placeholder: "Type your message",
  });
  inputContainer.appendChild(to);
  inputContainer.appendChild(body);

  const confirmBtn = createConfirmButton();
  confirmBtn.addEventListener("click", () => {
    const recipient = getInputEl(to).value.trim();
    const message = getInputEl(body).value.trim();
    clearFieldError(to);
    if (!isValidPhone(recipient)) {
      showFieldError(to, "Enter a valid phone");
      return;
    }
    const smsString = `sms:${recipient}${message ? `:${message}` : ""}`;
    showQRCodeWithECC(smsString, `QR Code for SMS to: ${recipient}`);
  });
  inputContainer.appendChild(confirmBtn);
};

const renderEmail = () => {
  clearAndStack(true);
  const to = createField("To", {
    kind: "input",
    type: "email",
    placeholder: "name@example.com",
  });
  const subject = createField("Subject", {
    kind: "input",
    type: "text",
    placeholder: "Subject",
  });
  const body = createField("Body", {
    kind: "input",
    type: "text",
    placeholder: "Message",
  });
  inputContainer.appendChild(to);
  inputContainer.appendChild(subject);
  inputContainer.appendChild(body);

  const confirmBtn = createConfirmButton();
  confirmBtn.addEventListener("click", () => {
    const recipient = getInputEl(to).value.trim();
    const subj = getInputEl(subject).value.trim();
    const msg = getInputEl(body).value.trim();
    clearFieldError(to);
    if (!isValidEmail(recipient)) {
      showFieldError(to, "Enter a valid email");
      return;
    }
    let emailString = `mailto:${recipient}`;
    const params = [] as string[];
    if (subj) params.push(`subject=${encodeURIComponent(subj)}`);
    if (msg) params.push(`body=${encodeURIComponent(msg)}`);
    if (params.length > 0) emailString += `?${params.join("&")}`;
    showQRCodeWithECC(emailString, `QR Code for email to: ${recipient}`);
  });
  inputContainer.appendChild(confirmBtn);
};

const renderVCard = () => {
  clearAndStack(true);
  const name = createField("Full name", {
    kind: "input",
    type: "text",
    placeholder: "First Last",
  });
  const org = createField("Organization", {
    kind: "input",
    type: "text",
    placeholder: "Company",
  });
  const phone = createField("Phone", {
    kind: "input",
    type: "tel",
    placeholder: "+90 ### ### ####",
  });
  const email = createField("Email", {
    kind: "input",
    type: "email",
    placeholder: "name@example.com",
  });
  inputContainer.appendChild(name);
  inputContainer.appendChild(org);
  inputContainer.appendChild(phone);
  inputContainer.appendChild(email);

  const confirmBtn = createConfirmButton();
  confirmBtn.addEventListener("click", () => {
    const fullName = (
      name.querySelector("input") as HTMLInputElement
    ).value.trim();
    const organization = (
      org.querySelector("input") as HTMLInputElement
    ).value.trim();
    const phoneNumber = getInputEl(phone).value.trim();
    const emailAddress = getInputEl(email).value.trim();
    clearFieldError(name);
    clearFieldError(phone);
    clearFieldError(email);

    if (fullName) {
      if (phoneNumber && !isValidPhone(phoneNumber)) {
        showFieldError(phone, "Invalid phone");
        return;
      }
      if (emailAddress && !isValidEmail(emailAddress)) {
        showFieldError(email, "Invalid email");
        return;
      }
      let vcard = "BEGIN:VCARD\nVERSION:3.0\n";
      vcard += `FN:${fullName}\n`;
      if (organization) vcard += `ORG:${organization}\n`;
      if (phoneNumber) vcard += `TEL:${phoneNumber}\n`;
      if (emailAddress) vcard += `EMAIL:${emailAddress}\n`;
      vcard += "END:VCARD";

      showQRCodeWithECC(vcard, `QR Code for vCard: ${fullName}`);
    }
  });
  inputContainer.appendChild(confirmBtn);
};

// Geo removed (use Directions)

const renderEvent = () => {
  clearAndStack(true);
  const title = createField("Title", {
    kind: "input",
    type: "text",
    placeholder: "Event title",
  });
  const start = createField("Start", {
    kind: "input",
    type: "datetime-local",
    placeholder: "",
  });
  const end = createField("End", {
    kind: "input",
    type: "datetime-local",
    placeholder: "",
  });
  const place = createField("Location (optional)", {
    kind: "input",
    type: "text",
    placeholder: "Where",
  });
  const desc = createField("Description (optional)", {
    kind: "input",
    type: "text",
    placeholder: "Details",
  });
  const rrule = createField("Recurrence (RRULE, optional)", {
    kind: "input",
    type: "text",
    placeholder: "FREQ=WEEKLY;COUNT=6",
  });
  const alarm = createField("Alarm minutes before (optional)", {
    kind: "input",
    type: "number",
    placeholder: "15",
  });
  inputContainer.appendChild(title);
  inputContainer.appendChild(start);
  inputContainer.appendChild(end);
  inputContainer.appendChild(place);
  inputContainer.appendChild(desc);
  inputContainer.appendChild(rrule);
  inputContainer.appendChild(alarm);

  const confirmBtn = createConfirmButton();
  confirmBtn.addEventListener("click", () => {
    const t = (title.querySelector("input") as HTMLInputElement).value.trim();
    const s = (start.querySelector("input") as HTMLInputElement).value.trim();
    const e = (end.querySelector("input") as HTMLInputElement).value.trim();
    const l = (place.querySelector("input") as HTMLInputElement).value.trim();
    const d = (desc.querySelector("input") as HTMLInputElement).value.trim();
    const r = (rrule.querySelector("input") as HTMLInputElement).value.trim();
    const a = (alarm.querySelector("input") as HTMLInputElement).value.trim();

    if (t && s) {
      const dtStart = toIcsDateTimeLocal(s);
      const dtEnd = e ? toIcsDateTimeLocal(e) : "";
      const uid = `vqr-${Date.now()}@local`;
      const dtStamp = toIcsTimestampUTC();
      const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//vqr//EN",
        "BEGIN:VEVENT",
        foldIcsLine(`UID:${uid}`),
        `DTSTAMP:${dtStamp}`,
        `SUMMARY:${t}`,
        `DTSTART:${dtStart}`,
        ...(dtEnd ? [`DTEND:${dtEnd}`] : []),
        ...(l ? [foldIcsLine(`LOCATION:${l}`)] : []),
        ...(d ? [foldIcsLine(`DESCRIPTION:${d}`)] : []),
        ...(r ? [foldIcsLine(`RRULE:${r}`)] : []),
        "END:VEVENT",
        ...(a
          ? [
              "BEGIN:VALARM",
              `TRIGGER:-PT${parseInt(a, 10)}M`,
              "ACTION:DISPLAY",
              "DESCRIPTION:Reminder",
              "END:VALARM",
            ]
          : []),
        "END:VCALENDAR",
      ];
      const ics = lines.join("\n");
      showQRCodeWithECC(ics, `QR for event: ${t}`);
    }
  });
  inputContainer.appendChild(confirmBtn);
};

type SocialPlatform = "instagram" | "twitter" | "facebook" | "tiktok";
const socialUrl = (
  platform: SocialPlatform,
  username: string,
  action: "profile" | "follow"
): string => {
  switch (platform) {
    case "instagram":
      return `https://instagram.com/${username}`;
    case "twitter":
      return action === "follow"
        ? `https://twitter.com/intent/follow?screen_name=${username}`
        : `https://twitter.com/${username}`;
    case "facebook":
      return `https://facebook.com/${username}`;
    case "tiktok":
      return `https://www.tiktok.com/@${username}`;
    default:
      return "";
  }
};

const renderSocial = () => {
  clearAndStack(true);
  const platform = createField("Platform", {
    kind: "select",
    options: [
      { label: "Instagram", value: "instagram" },
      { label: "Twitter/X", value: "twitter" },
      { label: "Facebook", value: "facebook" },
      { label: "TikTok", value: "tiktok" },
    ],
  });
  const username = createField("Username", {
    kind: "input",
    type: "text",
    placeholder: "e.g., emre",
  });
  const action = createField("Action", {
    kind: "select",
    options: [
      { label: "Open profile", value: "profile" },
      { label: "Follow (Twitter only)", value: "follow" },
    ],
  });
  inputContainer.appendChild(platform);
  inputContainer.appendChild(username);
  inputContainer.appendChild(action);

  const confirmBtn = createConfirmButton();
  confirmBtn.addEventListener("click", () => {
    const p = (platform.querySelector("select") as HTMLSelectElement)
      .value as SocialPlatform;
    const u = (username.querySelector("input") as HTMLInputElement).value
      .trim()
      .replace(/^@+/, "");
    const a = (action.querySelector("select") as HTMLSelectElement).value as
      | "profile"
      | "follow";
    if (u) {
      const url = socialUrl(p, u, a);
      if (url) {
        showQRCodeWithECC(
          url,
          `QR for ${p} ${a === "follow" ? "follow" : "profile"}: ${u}`
        );
      }
    }
  });
  inputContainer.appendChild(confirmBtn);
};

// Individual deep link renderers
const renderWhatsApp = () => {
  clearAndStack(true);
  const phone = createField("Phone", {
    kind: "input",
    type: "tel",
    placeholder: "+90##########",
  });
  const message = createField("Message (optional)", {
    kind: "input",
    type: "text",
    placeholder: "Hi!",
  });
  inputContainer.appendChild(phone);
  inputContainer.appendChild(message);

  const confirmBtn = createConfirmButton();
  confirmBtn.addEventListener("click", () => {
    const p = (phone.querySelector("input") as HTMLInputElement).value.trim();
    const m = (message.querySelector("input") as HTMLInputElement).value.trim();
    if (p) {
      const url = `https://wa.me/${p}${
        m ? `?text=${encodeURIComponent(m)}` : ""
      }`;
      showQRCodeWithECC(url, `QR for WhatsApp chat: ${p}`);
    }
  });
  inputContainer.appendChild(confirmBtn);
};

const renderSpotify = () => {
  clearAndStack(true);
  const track = createField("Track URL or ID", {
    kind: "input",
    type: "text",
    placeholder: "https://open.spotify.com/track/... or ID",
  });
  inputContainer.appendChild(track);
  const confirmBtn = createConfirmButton();
  confirmBtn.addEventListener("click", () => {
    const raw = (track.querySelector("input") as HTMLInputElement).value.trim();
    if (raw) {
      const idMatch = raw.match(/([a-zA-Z0-9]{22})/);
      const id = idMatch ? idMatch[1] : "";
      const url = id ? `https://open.spotify.com/track/${id}` : raw;
      showQRCodeWithECC(url, `QR for Spotify track`);
    }
  });
  inputContainer.appendChild(confirmBtn);
};

const renderUber = () => {
  clearAndStack(true);
  const dlat = createField("Dropoff Latitude", {
    kind: "input",
    type: "number",
    placeholder: "41.0082",
  });
  const dlon = createField("Dropoff Longitude", {
    kind: "input",
    type: "number",
    placeholder: "28.9784",
  });
  const name = createField("Dropoff Nickname (optional)", {
    kind: "input",
    type: "text",
    placeholder: "Destination",
  });
  inputContainer.appendChild(dlat);
  inputContainer.appendChild(dlon);
  inputContainer.appendChild(name);
  const confirmBtn = createConfirmButton();
  confirmBtn.addEventListener("click", () => {
    const lat = parseFloat(
      (dlat.querySelector("input") as HTMLInputElement).value.trim()
    );
    const lon = parseFloat(
      (dlon.querySelector("input") as HTMLInputElement).value.trim()
    );
    const nickname = (
      name.querySelector("input") as HTMLInputElement
    ).value.trim();
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      const url = `uber://?action=setPickup&pickup=my_location&dropoff[latitude]=${lat}&dropoff[longitude]=${lon}${
        nickname ? `&dropoff[nickname]=${encodeURIComponent(nickname)}` : ""
      }`;
      showQRCodeWithECC(url, `QR for Uber ride`);
    }
  });
  inputContainer.appendChild(confirmBtn);
};

const renderTelegram = () => {
  clearAndStack(true);
  const username = createField("Username", {
    kind: "input",
    type: "text",
    placeholder: "@username",
  });
  inputContainer.appendChild(username);
  const confirmBtn = createConfirmButton();
  confirmBtn.addEventListener("click", () => {
    const u = (username.querySelector("input") as HTMLInputElement).value
      .trim()
      .replace(/^@+/, "");
    if (u) showQRCodeWithECC(`https://t.me/${u}`, `QR for Telegram: @${u}`);
  });
  inputContainer.appendChild(confirmBtn);
};

const renderMessenger = () => {
  clearAndStack(true);
  const user = createField("Username/Page", {
    kind: "input",
    type: "text",
    placeholder: "username or page",
  });
  inputContainer.appendChild(user);
  const confirmBtn = createConfirmButton();
  confirmBtn.addEventListener("click", () => {
    const u = (user.querySelector("input") as HTMLInputElement).value.trim();
    if (u) showQRCodeWithECC(`https://m.me/${u}`, `QR for Messenger: ${u}`);
  });
  inputContainer.appendChild(confirmBtn);
};

const renderFaceTime = () => {
  clearAndStack(true);
  const contact = createField("Number/Email", {
    kind: "input",
    type: "text",
    placeholder: "+90... or email",
  });
  const mode = createField("Mode", {
    kind: "select",
    options: [
      { label: "Video", value: "video" },
      { label: "Audio", value: "audio" },
    ],
  });
  inputContainer.appendChild(contact);
  inputContainer.appendChild(mode);
  const confirmBtn = createConfirmButton();
  confirmBtn.addEventListener("click", () => {
    const c = (contact.querySelector("input") as HTMLInputElement).value.trim();
    const m = (mode.querySelector("select") as HTMLSelectElement).value;
    if (c)
      showQRCodeWithECC(
        m === "audio" ? `facetime-audio://${c}` : `facetime://${c}`,
        `QR for FaceTime`
      );
  });
  inputContainer.appendChild(confirmBtn);
};

const renderIMessage = () => {
  clearAndStack(true);
  const phone = createField("Recipient", {
    kind: "input",
    type: "tel",
    placeholder: "+90...",
  });
  const body = createField("Message (optional)", {
    kind: "input",
    type: "text",
    placeholder: "Hello",
  });
  inputContainer.appendChild(phone);
  inputContainer.appendChild(body);
  const confirmBtn = createConfirmButton();
  confirmBtn.addEventListener("click", () => {
    const p = (phone.querySelector("input") as HTMLInputElement).value.trim();
    const b = (body.querySelector("input") as HTMLInputElement).value.trim();
    if (p)
      showQRCodeWithECC(
        `sms:${p}${b ? `&body=${encodeURIComponent(b)}` : ""}`,
        `QR for SMS/iMessage`
      );
  });
  inputContainer.appendChild(confirmBtn);
};

const renderYouTube = () => {
  clearAndStack(true);
  const url = createField("Video URL or ID", {
    kind: "input",
    type: "text",
    placeholder: "https://youtu.be/... or ID",
  });
  inputContainer.appendChild(url);
  const confirmBtn = createConfirmButton();
  confirmBtn.addEventListener("click", () => {
    const raw = (url.querySelector("input") as HTMLInputElement).value.trim();
    if (raw) {
      const idMatch = raw.match(/([a-zA-Z0-9_-]{11})/);
      const id = idMatch ? idMatch[1] : "";
      const target = id ? `https://youtu.be/${id}` : raw;
      showQRCodeWithECC(target, `QR for YouTube`);
    }
  });
  inputContainer.appendChild(confirmBtn);
};

// Payments renderer removed

const renderMeCard = () => {
  clearAndStack(true);
  const name = createField("Name", {
    kind: "input",
    type: "text",
    placeholder: "First Last",
  });
  const phone = createField("Phone", {
    kind: "input",
    type: "tel",
    placeholder: "+90 ### ### ####",
  });
  const email = createField("Email", {
    kind: "input",
    type: "email",
    placeholder: "name@example.com",
  });
  const address = createField("Address (optional)", {
    kind: "input",
    type: "text",
    placeholder: "Street, City",
  });
  const note = createField("Note (optional)", {
    kind: "input",
    type: "text",
    placeholder: "Notes",
  });
  inputContainer.appendChild(name);
  inputContainer.appendChild(phone);
  inputContainer.appendChild(email);
  inputContainer.appendChild(address);
  inputContainer.appendChild(note);

  const confirmBtn = createConfirmButton();
  confirmBtn.addEventListener("click", () => {
    const n = (name.querySelector("input") as HTMLInputElement).value.trim();
    const p = (phone.querySelector("input") as HTMLInputElement).value.trim();
    const e = (email.querySelector("input") as HTMLInputElement).value.trim();
    const a = (address.querySelector("input") as HTMLInputElement).value.trim();
    const no = (note.querySelector("input") as HTMLInputElement).value.trim();
    if (n || p || e) {
      let m = "MECARD:";
      if (n) m += `N:${n};`;
      if (p) m += `TEL:${p};`;
      if (e) m += `EMAIL:${e};`;
      if (a) m += `ADR:${a};`;
      if (no) m += `NOTE:${no};`;
      m += ";";
      showQRCodeWithECC(m, `QR for MeCard: ${n || p || e}`);
    }
  });
  inputContainer.appendChild(confirmBtn);
};

const renderDirections = () => {
  clearAndStack(true);
  const destLat = createField("Destination Latitude", {
    kind: "input",
    type: "number",
    placeholder: "41.0082",
  });
  const destLon = createField("Destination Longitude", {
    kind: "input",
    type: "number",
    placeholder: "28.9784",
  });
  const label = createField("Label (optional)", {
    kind: "input",
    type: "text",
    placeholder: "Place",
  });
  inputContainer.appendChild(destLat);
  inputContainer.appendChild(destLon);
  inputContainer.appendChild(label);

  const confirmBtn = createConfirmButton();
  confirmBtn.addEventListener("click", () => {
    const lat = parseFloat(
      (destLat.querySelector("input") as HTMLInputElement).value.trim()
    );
    const lon = parseFloat(
      (destLon.querySelector("input") as HTMLInputElement).value.trim()
    );
    const q = (label.querySelector("input") as HTMLInputElement).value.trim();
    clearFieldError(destLat);
    clearFieldError(destLon);
    if (!isValidLat(lat)) {
      showFieldError(destLat, "Latitude must be between -90 and 90");
      return;
    }
    if (!isValidLon(lon)) {
      showFieldError(destLon, "Longitude must be between -180 and 180");
      return;
    }
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}${
      q
        ? `&destination_place_id=&destination=${lat},${lon}&query=${encodeURIComponent(
            q
          )}`
        : ""
    }`;
    showQRCodeWithECC(
      url,
      `QR for directions to: ${lat}, ${lon}${q ? " - " + q : ""}`
    );
  });
  inputContainer.appendChild(confirmBtn);
};

// Event listeners
urlInput.addEventListener("click", renderURL);
textInput.addEventListener("click", renderText);
phoneInput.addEventListener("click", renderPhone);
wifiInput.addEventListener("click", renderWifi);
smsInput.addEventListener("click", renderSMS);
emailInput.addEventListener("click", renderEmail);
vcardInput.addEventListener("click", renderVCard);
eventInput.addEventListener("click", renderEvent);
socialInput.addEventListener("click", renderSocial);
whatsappInput.addEventListener("click", renderWhatsApp);
spotifyInput.addEventListener("click", renderSpotify);
uberInput.addEventListener("click", renderUber);
telegramInput.addEventListener("click", renderTelegram);
messengerInput.addEventListener("click", renderMessenger);
facetimeInput.addEventListener("click", renderFaceTime);
imessageInput.addEventListener("click", renderIMessage);
youtubeInput.addEventListener("click", renderYouTube);
mecardInput.addEventListener("click", renderMeCard);
directionsInput.addEventListener("click", renderDirections);

// Sidebar collapse behavior
collapseBtn.addEventListener("click", () => {
  const isCollapsed = sidebar.classList.toggle("collapsed");
  collapseBtn.textContent = isCollapsed ? "⟩" : "⟨";
  content.classList.toggle("sidebar-collapsed", isCollapsed);
});

// Default selection: URL
urlInput.classList.add("active");
renderURL();
