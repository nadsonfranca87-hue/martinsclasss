interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  type?: string;
  placeholder?: string;
}

const AdminField = ({ label, value, onChange, multiline, type, placeholder }: FieldProps) => {
  const baseClass =
    "w-full bg-secondary/50 border border-border py-2.5 px-3 font-body text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200 rounded-sm placeholder:text-muted-foreground/50";

  return (
    <div className="space-y-1.5">
      <label className="font-body text-[10px] letter-wide uppercase text-muted-foreground block">
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
};

export default AdminField;
