export default function Input({
  label,
  id,
  inputClassName = "",
  trailingElement,
  ...props
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          className={`min-h-11 w-full rounded-lg border border-slate-300
               bg-white px-4 py-2.5 text-sm text-slate-900
                outline-none transition placeholder:text-slate-400
                 focus:border-teal-600 focus:ring-3 focus:ring-teal-100 ${inputClassName}`}
          {...props}
        />
        {trailingElement ? (
          <div className="absolute right-0 top-0 flex h-full items-center px-3">
            {trailingElement}
          </div>
        ) : null}
      </div>
    </div>
  );
}
