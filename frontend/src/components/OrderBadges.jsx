// Two small coloured labels for an order: where it is, and whether it is paid.
// Used by My Orders, the Dashboard and the Payment page.

const statusStyles = {
  processing: "bg-amber-100 text-amber-700",
  shipped: "bg-sky-100 text-sky-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-slate-200 text-slate-600",
};

const paymentStyles = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  refunded: "bg-slate-200 text-slate-600",
};

// The text shown for the payment label
const paymentLabel = (order) => {
  if (order.paymentStatus === "paid") return "Paid";
  if (order.paymentStatus === "refunded") return "Refunded";
  if (order.paymentMethod === "cod") return "Pay on delivery";
  return "Payment pending";
};

const chip = "text-xs font-semibold px-2.5 py-1 rounded-full capitalize";

export default function OrderBadges({ order }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`${chip} ${statusStyles[order.status]}`}>{order.status}</span>
      <span className={`${chip} ${paymentStyles[order.paymentStatus]}`}>
        {paymentLabel(order)}
      </span>
    </div>
  );
}
