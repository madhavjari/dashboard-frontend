export default function DashboardHeader(props) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">{props.title3}</h1>
      <p className="mt-1 text-sm text-gray-500">
        {props.title1} {props.textArray[0]} · {props.title2}{" "}
        {props.textArray[1]}
      </p>
    </div>
  );
}
