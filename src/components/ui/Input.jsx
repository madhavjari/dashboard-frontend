export default function Input({
  label,
  id,
  wrapperClassName = "",
  inputClassName = "",
  ...props
}) {
  return (
    <div className={wrapperClassName}>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      <input
        id={id}
        className={`w-full rounded-lg border border-gray-300
             bg-white px-4 py-2.5 text-sm text-gray-900
              outline-none transition placeholder:text-gray-400
               focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${inputClassName}`}
        {...props}
      />
    </div>
  );
}
