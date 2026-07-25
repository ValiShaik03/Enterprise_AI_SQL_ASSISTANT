type Props = {
  status: string;
};

export default function StatusBadge({ status }: Props) {
  const value = status.toLowerCase();

  const styles =
    value === "active"
      ? "bg-green-100 text-green-700"
      : value === "inactive"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${styles}`}
    >
      {status}
    </span>
  );
}