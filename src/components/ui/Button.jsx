export default function Button({
  children,
  loading,
  className = "",
  ...props
}) {
  return (
    <button
      className={`min-h-11 w-full cursor-pointer rounded-lg bg-teal-700 px-4 py-3 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
