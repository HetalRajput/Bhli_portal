const styleId = "hotel-booking-workspace-design";
const existingStyle = document.getElementById(styleId);
const style = existingStyle instanceof HTMLStyleElement ? existingStyle : document.createElement("style");

style.id = styleId;
style.textContent = `
  body:has(#enhanced-hotel-booking-form) {
    overflow-x: hidden;
    overflow-y: auto;
  }

  body:has(#enhanced-hotel-booking-form) > main {
    flex: 1 0 auto !important;
    height: auto;
    min-height: calc(100dvh - 5rem) !important;
    overflow: visible;
  }

  body:has(#enhanced-hotel-booking-form) > main > div {
    height: auto;
    min-height: calc(100dvh - 5rem);
    overflow: visible;
  }

  body:has(#enhanced-hotel-booking-form) > main > div > section:first-child {
    height: clamp(19rem, 42vh, 27rem);
    min-height: 0;
  }

  body:has(#enhanced-hotel-booking-form) > main > div > main {
    position: relative;
    inset: auto;
    margin-top: clamp(15rem, 32vh, 20rem);
    margin-bottom: 2rem;
    min-height: clamp(52rem, 90vh, 62rem);
  }

  body:has(#enhanced-hotel-booking-form) > main > div > main > div {
    height: auto;
    min-height: inherit;
  }

  #enhanced-hotel-booking-form {
    overflow-y: visible;
  }

  #enhanced-hotel-booking-form::-webkit-scrollbar {
    width: 8px;
  }

  #enhanced-hotel-booking-form::-webkit-scrollbar-track {
    border-radius: 999px;
    background: #edf6fa;
  }

  #enhanced-hotel-booking-form::-webkit-scrollbar-thumb {
    border: 2px solid #edf6fa;
    border-radius: 999px;
    background: #74bddb;
  }
`;

if (!style.isConnected) document.head.appendChild(style);
