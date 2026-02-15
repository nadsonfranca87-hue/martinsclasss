interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  type?: string;
}

const AdminField = ({ label, value, onChange, multiline, type }: FieldProps) => {
  return (
    <div>
      <label className="font-body text-[10px] letter-wide uppercase text-muted-foreground mb-2 block">{label}</label>
      {multiline ? (
        <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-secondary border border-border py-3 px-4 font-body text-foreground focus:outline-none focus:border-primary transition-colors duration-300 resize-none" />
      ) : (
        <input type={type || "text"} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-secondary border border-border py-3 px-4 font-body text-foreground focus:outline-none focus:border-primary transition-colors duration-300" />
      )}
    </div>
  );
};

export default AdminField;
