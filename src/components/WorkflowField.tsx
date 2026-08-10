import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

type FieldExtras = {
  label: string;
  icon?: ReactNode;
};

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <span>
      {label}
      {required && <span className="text-rose-500"> *</span>}
    </span>
  );
}

function LeadingIcon({ children, multiline = false }: { children: ReactNode; multiline?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute left-4 z-10 text-[#087fbe] [&>svg]:size-[18px] ${
        multiline ? "top-6" : "top-1/2 -translate-y-1/2"
      }`}
    >
      {children}
    </span>
  );
}

export function Field({
  label,
  icon,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & FieldExtras) {
  return (
    <label className={`block text-sm font-semibold text-[#173852] ${className}`}>
      <FieldLabel label={label} required={props.required} />
      <span className="relative mt-2 block">
        {icon && <LeadingIcon>{icon}</LeadingIcon>}
        <input
          {...props}
          className={`h-12 w-full rounded-xl border border-slate-200 bg-white pr-4 font-normal outline-none transition focus:border-[#0786c5] focus:ring-4 focus:ring-sky-100 ${icon ? "pl-11" : "pl-4"}`}
        />
      </span>
    </label>
  );
}

export function SelectField({
  label,
  icon,
  children,
  className = "",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & FieldExtras) {
  return (
    <label className={`block text-sm font-semibold text-[#173852] ${className}`}>
      <FieldLabel label={label} required={props.required} />
      <span className="relative mt-2 block">
        {icon && <LeadingIcon>{icon}</LeadingIcon>}
        <select
          {...props}
          className={`h-12 w-full rounded-xl border border-slate-200 bg-white pr-10 font-normal outline-none transition focus:border-[#0786c5] focus:ring-4 focus:ring-sky-100 ${icon ? "pl-11" : "pl-4"}`}
        >
          {children}
        </select>
      </span>
    </label>
  );
}

export function TextArea({
  label,
  icon,
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & FieldExtras) {
  return (
    <label className={`block text-sm font-semibold text-[#173852] ${className}`}>
      <FieldLabel label={label} required={props.required} />
      <span className="relative mt-2 block">
        {icon && <LeadingIcon multiline>{icon}</LeadingIcon>}
        <textarea
          {...props}
          className={`min-h-32 w-full resize-y rounded-xl border border-slate-200 bg-white py-4 pr-4 font-normal outline-none transition focus:border-[#0786c5] focus:ring-4 focus:ring-sky-100 ${icon ? "pl-11" : "pl-4"}`}
        />
      </span>
    </label>
  );
}

export function FormNotice({ error, success }: { error: string; success: string }) {
  if (!error && !success) return null;
  return (
    <div
      role="alert"
      className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
        error
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-700"
      }`}
    >
      {error || success}
    </div>
  );
}
