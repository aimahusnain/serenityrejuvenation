"use client";

import { useState, ChangeEvent, FormEvent } from "react";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  receiveComm: boolean;
  giveConsent: boolean;
};

const INITIAL_FORM: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  message: "",
  receiveComm: false,
  giveConsent: false,
};

type ContactField = {
  title: string;
  lines: string[];
  icon: React.ReactNode;
};

type SocialLink = {
  label: string;
  color: string;
  path: string;
};

const CONTACT_FIELDS: ContactField[] = [
  {
    title: "Quick Contact",
    lines: ["aimahusnain@gmail.com"],
    icon: (
      <svg
        className="h-4.5 w-4.5"
        style={{ stroke: "#271024" }}
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 6-10 7L2 6" />
      </svg>
    ),
  },
  {
    title: "Phone Number",
    lines: ["+1 (817) 487-7378"],
    icon: (
      <svg
        className="h-4.5 w-4.5"
        style={{ stroke: "#271024" }}
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11 19.79 19.79 0 01.01 2.38 2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.04a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
  },
  {
    title: "Business Hours",
    lines: ["Daily: 8:00 AM - 5:00 PM"],
    icon: (
      <svg
        className="h-4.5 w-4.5"
        style={{ stroke: "#271024" }}
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    title: "Headquarters",
    lines: [
      "1870 The Exchange SE, Ste 220",
      "PMB 213900",
      "Atlanta, Georgia 30339",
    ],
    icon: (
      <svg
        className="h-4.5 w-4.5"
        style={{ stroke: "#271024" }}
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

const SOCIALS: SocialLink[] = [
  {
    label: "Facebook",
    color: "#1877F2",
    path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
  },
  {
    label: "Twitter",
    color: "#1DA1F2",
    path: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z",
  },
  {
    label: "Pinterest",
    color: "#E60023",
    path: "M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.22-5.16 1.22-5.16s-.31-.63-.31-1.56c0-1.46.85-2.55 1.9-2.55.9 0 1.33.67 1.33 1.48 0 .9-.57 2.25-.87 3.5-.25 1.04.52 1.89 1.54 1.89 1.85 0 3.1-2.37 3.1-5.18 0-2.14-1.44-3.74-4.04-3.74-2.94 0-4.77 2.2-4.77 4.65 0 .84.24 1.43.62 1.89.17.2.19.28.13.51-.04.17-.14.57-.18.73-.06.23-.24.31-.45.23-1.24-.51-1.82-1.88-1.82-3.41 0-2.53 2.14-5.57 6.39-5.57 3.43 0 5.68 2.49 5.68 5.16 0 3.55-1.96 6.19-4.86 6.19-.97 0-1.88-.52-2.19-1.11l-.62 2.35c-.21.79-.76 1.79-1.15 2.41.87.27 1.78.41 2.73.41 5.52 0 10-4.48 10-10S17.52 2 12 2z",
  },
  {
    label: "LinkedIn",
    color: "#0A66C2",
    path: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z",
  },
  {
    label: "YouTube",
    color: "#FF0000",
    path: "M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z M9.75 15.02l5.75-3.02-5.75-3.02v6.04z",
  },
];

function CheckboxField({
  name,
  label,
  checked,
  onChange,
}: {
  name: string;
  label: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <div className="relative mt-0.5 shrink-0">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="peer h-4 w-4 cursor-pointer appearance-none rounded border-2 border-[#271024]/30 transition
            checked:border-[#271024] checked:bg-[#271024]
            focus:outline-none focus:ring-2 focus:ring-[#271024]/20
            dark:border-[#e3ae72]/30 dark:checked:border-[#e3ae72] dark:checked:bg-[#e3ae72]
            dark:focus:ring-[#e3ae72]/20"
        />
        <svg
          className="pointer-events-none absolute inset-0 hidden h-4 w-4 text-white dark:text-[#271024] peer-checked:block"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M3 8l3.5 3.5L13 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="text-xs text-[#271024]/60 dark:text-[#e3ae72]/65">
        {label} <span className="text-red-400">*</span>
      </span>
    </label>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  const handle = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.message) {
      alert("Please fill in name, email, and message.");
      return;
    }
    if (!form.receiveComm || !form.giveConsent) {
      alert("Please accept both consent checkboxes.");
      return;
    }
    alert("Message sent! We'll be in touch soon.");
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#271024]">
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden bg-[#271024]/80 dark:bg-[#e3ae72] px-6 py-14 text-center">
        {/* Ripple rings – right */}
        <div className="pointer-events-none absolute right-12 top-1/2 h-48 w-48 -translate-y-1/2">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="absolute rounded-full border border-[#e3ae72]/20 animate-ping"
              style={{
                inset: `${i * -20}px`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: "2.5s",
              }}
            />
          ))}
        </div>
        {/* Ripple rings – left */}
        <div className="pointer-events-none absolute left-8 top-1/2 h-32 w-32 -translate-y-1/2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="absolute rounded-full border border-[#e3ae72]/15 animate-ping"
              style={{
                inset: `${i * -18}px`,
                animationDelay: `${i * 0.9 + 0.3}s`,
                animationDuration: "2.8s",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <span className="mb-4 inline-block rounded-full border border-[#e3ae72]/30 bg-[#e3ae72]/10 px-5 py-1.5 text-[11px] font-semibold tracking-widest dark:text-black text-[#e3ae72]/90 uppercase backdrop-blur-sm">
            Write to us
          </span>
          <h1 className="font-serif text-4xl font-bold dark:text-black text-[#e3ae72]/90 md:text-5xl leading-[1.1] tracking-tight">
            Get In Touch
          </h1>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* ── LEFT: Form ── */}
          <div>
            <h2 className="mb-1 font-serif text-3xl font-bold text-[#271024] dark:text-[#e3ae72] leading-[1.1] tracking-tight">
              Let&apos;s Talk!
            </h2>
            <p className="mb-8 text-[15px] text-[#271024]/60 dark:text-[#e3ae72]/65">
              Get in touch with us using the enquiry form or contact details
              below.
            </p>

            <form onSubmit={submit} className="space-y-5">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-4">
                {(
                  [
                    {
                      name: "firstName",
                      label: "First Name",
                      placeholder: "Shahzaib",
                    },
                    {
                      name: "lastName",
                      label: "Last Name",
                      placeholder: "Dab",
                    },
                  ] as const
                ).map(({ name, label, placeholder }) => (
                  <div key={name}>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-[#271024]/50 dark:text-[#e3ae72]/50">
                      {label}
                    </label>
                    <input
                      name={name}
                      value={form[name]}
                      onChange={handle}
                      placeholder={placeholder}
                      className="w-full rounded-xl border border-[#271024]/15 bg-white px-4 py-2.5 text-sm text-[#271024] placeholder-[#271024]/25 shadow-sm transition
                        focus:border-[#271024] focus:outline-none focus:ring-2 focus:ring-[#271024]/10
                        dark:border-[#e3ae72]/20 dark:bg-[#271024]/60 dark:text-[#e3ae72] dark:placeholder-[#e3ae72]/25
                        dark:focus:border-[#e3ae72] dark:focus:ring-[#e3ae72]/10"
                    />
                  </div>
                ))}
              </div>

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-[#271024]/50 dark:text-[#e3ae72]/50">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handle}
                  placeholder="hello@example.com"
                  className="w-full rounded-xl border border-[#271024]/15 bg-white px-4 py-2.5 text-sm text-[#271024] placeholder-[#271024]/25 shadow-sm transition
                    focus:border-[#271024] focus:outline-none focus:ring-2 focus:ring-[#271024]/10
                    dark:border-[#e3ae72]/20 dark:bg-[#271024]/60 dark:text-[#e3ae72] dark:placeholder-[#e3ae72]/25
                    dark:focus:border-[#e3ae72] dark:focus:ring-[#e3ae72]/10"
                />
              </div>

              {/* Message */}
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-[#271024]/50 dark:text-[#e3ae72]/50">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handle}
                  rows={4}
                  placeholder="Type something..."
                  className="w-full resize-none rounded-xl border border-[#271024]/15 bg-white px-4 py-2.5 text-sm text-[#271024] placeholder-[#271024]/25 shadow-sm transition
                    focus:border-[#271024] focus:outline-none focus:ring-2 focus:ring-[#271024]/10
                    dark:border-[#e3ae72]/20 dark:bg-[#271024]/60 dark:text-[#e3ae72] dark:placeholder-[#e3ae72]/25
                    dark:focus:border-[#e3ae72] dark:focus:ring-[#e3ae72]/10"
                />
              </div>
              {/* Submit */}
              <button
                type="submit"
                className="mt-1 inline-flex items-center gap-2 rounded-full
                  bg-[#271024] dark:bg-[#e3ae72]
                  text-white dark:text-[#271024]
                  px-10 py-4 text-sm font-medium tracking-wide shadow-md
                  transition-all duration-200
                  hover:bg-[#271024]/80 dark:hover:bg-[#d49e5e]
                  active:scale-95
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-[#271024] dark:focus-visible:ring-[#e3ae72]"
              >
                SEND A MESSAGE
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
          </div>

          {/* ── RIGHT: Illustration + Info ── */}
          <div className="flex flex-col gap-8">
            {/* Contact detail blocks */}
            <div className="space-y-5 rounded-2xl border border-[#271024]/10 dark:border-[#e3ae72]/10 bg-white dark:bg-[#271024]/60 p-6 shadow-sm">
              {CONTACT_FIELDS.map(({ title, lines, icon }, idx) => (
                <div key={title}>
                  {idx > 0 && (
                    <div className="mb-5 h-px bg-[#271024]/8 dark:bg-[#e3ae72]/10" />
                  )}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#271024]/8 dark:bg-[#e3ae72]">
                      {icon}
                    </div>
                    <div>
                      <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-[#271024]/40 dark:text-[#e3ae72]/45">
                        {title}
                      </p>
                      {lines.map((line) => (
                        <p
                          key={line}
                          className="text-sm text-[#271024] dark:text-[#e3ae72]/80"
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div>
              <p className="mb-3 font-serif text-xl font-bold text-[#271024] dark:text-[#e3ae72]">
                Follow us
              </p>
              <div className="flex flex-wrap gap-2">
                {SOCIALS.map(({ label, color, path }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition-all duration-200 hover:scale-110 hover:shadow-lg"
                    style={{ backgroundColor: color }}
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d={path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
