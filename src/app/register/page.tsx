"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Mail, Smartphone, UserRound } from "lucide-react";
import Link from "next/link";
import AuthVisualPanel from "@/components/AuthVisualPanel";
import { authService } from "@/lib/api/auth";
import { baseService } from "@/lib/api/base";
import { getErrorMessage } from "@/lib/api/client";
import "../auth.css";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE = /^[6-9]\d{9}$/;

type LookupItem = { id: number; name: string; is_active?: boolean };
type FormState = { firstName: string; lastName: string; email: string; mobile: string; serviceNum: string; rank: string; employeeId: string; department: string };

export default function Register() {
  const [form, setForm] = useState<FormState>({ firstName: "", lastName: "", email: "", mobile: "", serviceNum: "", rank: "", employeeId: "", department: "" });
  const [ranks, setRanks] = useState<LookupItem[]>([]);
  const [departments, setDepartments] = useState<LookupItem[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [successMessage, setSuccessMessage] = useState("Account created successfully. Please login to continue.");
  const [error, setError] = useState("");
  const update = (key: keyof FormState, value: string) => setForm((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    let active = true;
    Promise.all([baseService.getOfficerRanks(), baseService.getDepartments()])
      .then(([rankResponse, departmentResponse]) => {
        if (!active) return;
        setRanks(Array.isArray(rankResponse?.data) ? rankResponse.data.filter((item: LookupItem) => item.is_active !== false) : []);
        setDepartments(Array.isArray(departmentResponse?.data) ? departmentResponse.data.filter((item: LookupItem) => item.is_active !== false) : []);
      })
      .catch((requestError) => { if (active) setError(getErrorMessage(requestError)); })
      .finally(() => { if (active) setLoadingOptions(false); });
    return () => { active = false; };
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (form.firstName.trim().length < 2 || form.lastName.trim().length < 2) return setError("First and last name must contain at least 2 characters.");
    if (!EMAIL.test(form.email)) return setError("Please enter a valid email address.");
    if (!MOBILE.test(form.mobile)) return setError("Enter a valid 10-digit Indian mobile number.");
    if (!form.rank) return setError("Please select the officer's rank.");
    if (ranks.length === 0) return setError("Officer ranks are not configured yet. Please contact the administrator.");
    const selectedRank = ranks.find((rank) => String(rank.id) === form.rank);
    if (!selectedRank) return setError("Please select a valid officer rank.");
    if (form.employeeId && !/^\d{4}$/.test(form.employeeId)) return setError("Employee ID must contain exactly the last 4 digits.");
    if (!form.department) return setError("Please select the defence sector or department.");

    setError("");
    setLoading(true);
    try {
      const response = await authService.signup({
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        mobile_number: form.mobile,
        service_number: form.serviceNum.trim(),
        officer_rank: selectedRank.id,
        employee_id: form.employeeId,
        department: Number(form.department),
      });
      if (!response?.success) throw response;
      if (response.message) setSuccessMessage(response.message);
      if (response.data) localStorage.setItem("bhli-profile-details", JSON.stringify({ name: `${response.data.first_name} ${response.data.last_name}`, email: response.data.email, mobile: response.data.mobile_number, serviceNum: response.data.service_number, rank: response.data.officer_rank_name, employeeId: response.data.employee_id, department: response.data.department_name }));
      setDone(true);
      window.setTimeout(() => window.location.assign("/login"), 1000);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  return <div className="auth-screen auth-login-theme auth-register-screen"><div className="auth-frame"><section className="auth-form-panel"><div className="auth-top"><Link href="/" className="auth-back"><ArrowLeft size={17} /></Link><span>Already member? <Link href="/login" className="auth-link">Sign in</Link></span></div><div className="auth-content">{done ? <div className="text-center"><CheckCircle2 size={58} color="#26bd82" className="mx-auto mb-6" /><h1>Account Created</h1><p className="auth-subtitle">{successMessage}</p></div> : <><h1>Sign Up</h1><p className="auth-subtitle">Secure your travel experience with Booking Hospitality</p>{error && <div className="auth-alert" role="alert">{error}</div>}<form id="signup-form" className="auth-form" onSubmit={submit}><div className="auth-row"><Input label="First name" icon={<UserRound />} value={form.firstName} change={(value) => update("firstName", value)} placeholder="Amit" /><Input label="Last name" icon={<UserRound />} value={form.lastName} change={(value) => update("lastName", value)} placeholder="Kumar" /></div><Input label="Email address" icon={<Mail />} value={form.email} change={(value) => update("email", value)} placeholder="amit@example.com" valid={EMAIL.test(form.email)} /><Input label="Mobile number" icon={<Smartphone />} value={form.mobile} change={(value) => update("mobile", value.replace(/\D/g, "").slice(0, 10))} placeholder="9999999999" valid={MOBILE.test(form.mobile)} /><Input label="Service number" hint="Optional" value={form.serviceNum} change={(value) => update("serviceNum", value)} placeholder="e.g. IC-XXXXX" /><SelectField label="Officer's rank *" value={form.rank} change={(value) => update("rank", value)} placeholder={loadingOptions ? "Loading ranks..." : "Select rank"} options={ranks} disabled={loadingOptions} /><Input label="Employee ID - last 4 digits" hint="Optional" value={form.employeeId} change={(value) => update("employeeId", value.replace(/\D/g, "").slice(0, 4))} placeholder="Last 4 digits" /><SelectField label="Defence sector / department *" value={form.department} change={(value) => update("department", value)} placeholder={loadingOptions ? "Loading departments..." : "Select department"} options={departments} disabled={loadingOptions} /></form></>}</div>{!done && <button type="submit" form="signup-form" disabled={loading || loadingOptions} className="auth-primary auth-register-submit">{loading ? "Creating account..." : "Sign Up"}<span><ArrowRight size={16} /></span></button>}<div className="auth-footer">🇮🇳 &nbsp; ENG</div></section><AuthVisualPanel /></div></div>;
}

function Input({ label, hint, icon, value, change, placeholder, valid }: { label: string; hint?: string; icon?: React.ReactNode; value: string; change: (value: string) => void; placeholder: string; valid?: boolean }) {
  const email = label === "Email address", mobile = label === "Mobile number", name = label.includes("name");
  return <label className="auth-field"><span className="auth-label">{label}{hint && <small>{hint}</small>}</span><span className="auth-control">{icon && <i>{icon}</i>}<input required={hint !== "Optional"} type={email ? "email" : mobile ? "tel" : "text"} minLength={name ? 2 : undefined} pattern={mobile ? "[6-9][0-9]{9}" : undefined} maxLength={mobile ? 10 : undefined} autoComplete={email ? "email" : mobile ? "tel" : "off"} value={value} onChange={(event) => change(event.target.value)} placeholder={placeholder} />{valid && <Check size={17} color="#25bf82" />}</span></label>;
}

function SelectField({ label, value, change, placeholder, options, disabled }: { label: string; value: string; change: (value: string) => void; placeholder: string; options: LookupItem[]; disabled?: boolean }) {
  return <label className="auth-field"><span className="auth-label">{label}</span><span className="auth-control"><select required disabled={disabled} value={value} onChange={(event) => change(event.target.value)}><option value="">{placeholder}</option>{options.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}</select></span></label>;
}