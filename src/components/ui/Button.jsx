export default function Button({
  children,
  loading,
  className = "",
  ...props
}) {
  return (
    <button
      className={`w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
