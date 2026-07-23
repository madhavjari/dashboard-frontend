export default function Error({ message, header, reload }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
        <h1 className="text-2xl font-bold text-gray-900">{header}</h1>
        <div className="mt-6">
          <p className="text-red-600">{message}</p>
          <button
            onClick={reload}
            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}
