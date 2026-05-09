import { ordersStyles as styles } from "../../../styles/tailwindStyles";

const PROMISES = [
  { value: "100%", label: "Genuine medicines" },
  { value: "24/7", label: "Pharmacist help" },
  { value: "Secure", label: "Prescription checked" },
];

export default function PromiseGrid() {
  return (
    <div
      className={`${styles.promiseGrid} max-[520px]:![grid-template-columns:repeat(3,minmax(0,1fr))] max-[520px]:gap-1.5 max-[520px]:[&_div]:px-1.5 max-[520px]:[&_div]:py-2 max-[520px]:[&_span]:text-[12px]`}
    >
      {PROMISES.map((item) => (
        <div className="min-w-0 break-words" key={item.label}>
          <span>{item.value}</span>
          {item.label}
        </div>
      ))}
    </div>
  );
}
