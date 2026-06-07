"use client";
import { InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function InputField({ label, ...props }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1 text-sm w-full">
      <label className="text-white/80 font-medium">{label}</label>
      <input
        {...props}
        className="rounded-md bg-white/10 text-white px-3 py-2 border border-border-subtle focus:border-signal-yellow focus:outline-none"
      />
    </div>
  );
}

