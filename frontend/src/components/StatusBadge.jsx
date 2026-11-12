import { STATUS_STYLES } from "../utils/format";

export default function StatusBadge({ value }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[value] || "bg-gray-100 text-gray-600"}`}>
      {value}
    </span>
  );
}
