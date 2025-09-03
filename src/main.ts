import "./style.css";

// QR Code generation using qrserver.com (reliable, CORS-friendly)
const generateQRCode = (text: string): string => {
  const encodedText = encodeURIComponent(text);
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedText}`;
};


// Create main container
const outerDiv = document.createElement("div");
document.body.appendChild(outerDiv);
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

// Create the input toggle buttons
const urlInput = document.createElement("button");
urlInput.className = "input-toggle";
urlInput.textContent = "URL";
inputSwitcher.appendChild(urlInput);

const textInput = document.createElement("button");
textInput.textContent = "Text";
textInput.className = "input-toggle";
inputSwitcher.appendChild(textInput);

const phoneInput = document.createElement("button");
phoneInput.className = "input-toggle";
phoneInput.textContent = "Phone Number";
inputSwitcher.appendChild(phoneInput);

const wifiInput = document.createElement("button");
wifiInput.className = "input-toggle";
wifiInput.textContent = "Wifi";
inputSwitcher.appendChild(wifiInput);

const smsInput = document.createElement("button");
smsInput.className = "input-toggle";
smsInput.textContent = "SMS";
inputSwitcher.appendChild(smsInput);

const emailInput = document.createElement("button");
emailInput.className = "input-toggle";
emailInput.textContent = "Email";
inputSwitcher.appendChild(emailInput);

const vcardInput = document.createElement("button");
vcardInput.className = "input-toggle";
vcardInput.textContent = "vCard";
inputSwitcher.appendChild(vcardInput);

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

// Function to show QR code and download button
const showQRCode = (qrUrl: string, description: string) => {
  qrImage.src = qrUrl;
  qrText.textContent = description;
  downloadBtn.style.display = "inline-block";
};

// Renderers with QR generation
const renderURL = () => {
  clearAndStack(false);
  const linkInput = document.createElement("input");
  linkInput.type = "text";
  linkInput.placeholder = "Enter the URL (e.g., https://example.com)";
  inputContainer.appendChild(linkInput);

  const confirmBtn = createConfirmButton();
  confirmBtn.addEventListener("click", () => {
    const url = linkInput.value.trim();
    if (url) {
      const qrUrl = generateQRCode(url);
      showQRCode(qrUrl, `QR Code for: ${url}`);
    }
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
      const qrUrl = generateQRCode(text);
      showQRCode(qrUrl, `QR Code for: ${text}`);
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
    const phoneNumber = (
      number.querySelector("input") as HTMLInputElement
    ).value.trim();
    if (phoneNumber) {
      const phoneText = `tel:${countryCode}${phoneNumber.replace(/\s/g, "")}`;
      const qrUrl = generateQRCode(phoneText);
      showQRCode(qrUrl, `QR Code for phone: ${countryCode} ${phoneNumber}`);
    }
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

  inputContainer.appendChild(encryption);
  inputContainer.appendChild(ssid);
  inputContainer.appendChild(password);

  const confirmBtn = createConfirmButton();
  confirmBtn.addEventListener("click", () => {
    const enc = (encryption.querySelector("select") as HTMLSelectElement).value;
    const networkName = (
      ssid.querySelector("input") as HTMLInputElement
    ).value.trim();
    const pwd = (
      password.querySelector("input") as HTMLInputElement
    ).value.trim();

    if (networkName) {
      let wifiString = `WIFI:S:${networkName};T:${enc}`;
      if (enc !== "nopass" && pwd) {
        wifiString += `;P:${pwd}`;
      }
      wifiString += ";;";

      const qrUrl = generateQRCode(wifiString);
      showQRCode(qrUrl, `QR Code for Wi-Fi: ${networkName}`);
    }
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
    const recipient = (
      to.querySelector("input") as HTMLInputElement
    ).value.trim();
    const message = (
      body.querySelector("input") as HTMLInputElement
    ).value.trim();
    if (recipient) {
      const smsString = `sms:${recipient}${message ? `:${message}` : ""}`;
      const qrUrl = generateQRCode(smsString);
      showQRCode(qrUrl, `QR Code for SMS to: ${recipient}`);
    }
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
    const recipient = (
      to.querySelector("input") as HTMLInputElement
    ).value.trim();
    const subj = (
      subject.querySelector("input") as HTMLInputElement
    ).value.trim();
    const msg = (body.querySelector("input") as HTMLInputElement).value.trim();

    if (recipient) {
      let emailString = `mailto:${recipient}`;
      const params = [];
      if (subj) params.push(`subject=${encodeURIComponent(subj)}`);
      if (msg) params.push(`body=${encodeURIComponent(msg)}`);
      if (params.length > 0) {
        emailString += `?${params.join("&")}`;
      }

      const qrUrl = generateQRCode(emailString);
      showQRCode(qrUrl, `QR Code for email to: ${recipient}`);
    }
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
    const phoneNumber = (
      phone.querySelector("input") as HTMLInputElement
    ).value.trim();
    const emailAddress = (
      email.querySelector("input") as HTMLInputElement
    ).value.trim();

    if (fullName) {
      let vcard = "BEGIN:VCARD\nVERSION:3.0\n";
      vcard += `FN:${fullName}\n`;
      if (organization) vcard += `ORG:${organization}\n`;
      if (phoneNumber) vcard += `TEL:${phoneNumber}\n`;
      if (emailAddress) vcard += `EMAIL:${emailAddress}\n`;
      vcard += "END:VCARD";

      const qrUrl = generateQRCode(vcard);
      showQRCode(qrUrl, `QR Code for vCard: ${fullName}`);
    }
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

// Sidebar collapse behavior
collapseBtn.addEventListener("click", () => {
  const isCollapsed = sidebar.classList.toggle("collapsed");
  collapseBtn.textContent = isCollapsed ? "⟩" : "⟨";
  content.classList.toggle("sidebar-collapsed", isCollapsed);
});
