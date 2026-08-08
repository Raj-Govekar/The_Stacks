const styles = {
  Available: "bg-[#EAF3EB] text-[#2C4C3B]",
  Borrowed: "bg-[#FFF4E5] text-[#8C5A15]",
  "Not Available": "bg-[#FBEBEA] text-[#9A2B2B]"
};

export default function StatusBadge({ status, count }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${styles[status] || styles["Not Available"]}`}>
      {status}{typeof count === "number" ? ` · ${count}` : ""}
    </span>
  );
}
