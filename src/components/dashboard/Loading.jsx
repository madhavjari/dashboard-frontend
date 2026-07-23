export default function Loading({ header, message }) {
  <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
    <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
      <h1 className="text-2xl font-bold text-gray-900">{header}</h1>
      <div className="mt-6">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
        <p className="text-blue-600">{message}</p>
      </div>
    </div>
  </div>;
}
