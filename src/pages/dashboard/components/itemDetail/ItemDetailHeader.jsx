export default function ItemDetailHeader({ item }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{item}</h1>
      <p className="text-sm text-gray-500">Item Ledger</p>
    </div>
  );
}
