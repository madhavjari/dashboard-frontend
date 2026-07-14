export default function Card({ children }) {
  return (
    <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-xl">
      {children}
    </div>
  );
}
