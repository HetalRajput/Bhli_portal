"use client";

type OtpInputsProps = {
  value: string[];
  onChange: (value: string[]) => void;
  idPrefix: string;
};

export default function OtpInputs({ value, onChange, idPrefix }: OtpInputsProps) {
  const focus = (index: number) => {
    document.getElementById(`${idPrefix}-${index}`)?.focus();
  };

  return (
    <div
      className="auth-otp"
      onPaste={(event) => {
        const digits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (!digits) return;
        event.preventDefault();
        const next = Array.from({ length: 6 }, (_, index) => digits[index] || "");
        onChange(next);
        requestAnimationFrame(() => focus(Math.min(digits.length, 6) - 1));
      }}
    >
      {value.map((digit, index) => (
        <input
          key={index}
          id={`${idPrefix}-${index}`}
          value={digit}
          type="text"
          required
          pattern="[0-9]"
          inputMode="numeric"
          autoFocus={index === 0}
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          aria-label={`OTP digit ${index + 1}`}
          onFocus={(event) => event.currentTarget.select()}
          onChange={(event) => {
            const digits = event.target.value.replace(/\D/g, "");
            if (!digits) {
              const next = [...value];
              next[index] = "";
              onChange(next);
              return;
            }
            const next = [...value];
            next[index] = digits.at(-1) || "";
            onChange(next);
            if (index < 5) requestAnimationFrame(() => focus(index + 1));
          }}
          onKeyDown={(event) => {
            if (event.key === "Backspace") {
              if (!value[index] && index > 0) {
                event.preventDefault();
                const next = [...value];
                next[index - 1] = "";
                onChange(next);
                requestAnimationFrame(() => focus(index - 1));
              }
            } else if (event.key === "ArrowLeft" && index > 0) {
              event.preventDefault();
              focus(index - 1);
            } else if (event.key === "ArrowRight" && index < 5) {
              event.preventDefault();
              focus(index + 1);
            }
          }}
        />
      ))}
    </div>
  );
}
