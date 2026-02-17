"use client";

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  type?: string;
  placeholder?: string;
}

export default function AdminField({ label, value, onChange, multiline, type, placeholder }: FieldProps) {
  const baseClass =
    "w-full bg-[hsl(var(--secondary))]/50 border border-[hsl(var(--border))] py-2.5 px-3 font-sans text-sm text-[hsl(var(--foreground))] focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))]/20 transition-all duration-200 rounded-sm placeholder:text-[hsl(var(--muted-foreground))]/50";

  return (
    <div className="space-y-1.5">
      <label className="font-sans text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))] block">
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${baseClass} resize-none`}
        />
      ) : (
        <input
          type={type || "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={baseClass}
        />
      )}
    </div>
  );
}
