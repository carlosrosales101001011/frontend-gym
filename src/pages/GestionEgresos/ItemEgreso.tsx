
export interface EstimateItem {
  id: string | number;
  name: string;
  amount: number;
}

export interface EstimateCardProps {
  estimateNumber: string;
  customer: string;
  project: string;
  status?: "ACCEPTED" | "PENDING" | "REJECTED";
  estimateTotal: number;
  totalEstimate: number;
  totalInvoiced: number;
  estimateId: string;
  date: string;
  items: EstimateItem[];
}

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

export const ItemEgreso = ({
  estimateNumber,
  customer,
  project,
  status = "ACCEPTED",
  estimateTotal,
  totalEstimate,
  totalInvoiced,
  estimateId,
  date,
  items,
}: EstimateCardProps) => {
  return (
    <div className="estimate-card">
      {/* Header */}
      <div className="estimate-header">
        <div>
          <h3>Estimate {estimateNumber}</h3>
          <span className="subtitle">
            {customer} - {project}
          </span>
        </div>

        <span className={`status ${status.toLowerCase()}`}>
          {status}
        </span>
      </div>

      {/* Total */}
      <div className="estimate-total">
        <span>Estimate Total</span>
        <h1>{formatMoney(estimateTotal)}</h1>
      </div>

      {/* Resumen */}
      <div className="summary">
        <div>
          <small>Estimate Total</small>
          <strong>{formatMoney(totalEstimate)}</strong>
        </div>

        <div>
          <small>Total Invoiced</small>
          <strong>{formatMoney(totalInvoiced)}</strong>
        </div>
      </div>

      {/* Información */}
      <div className="estimate-info">
        <div>
          <small>Estimate</small>
          <strong>{estimateId}</strong>
        </div>

        <div className="right">
          <strong>{estimateNumber}</strong>
          <small>{date}</small>
        </div>
      </div>

      {/* Detalles */}
      <div className="estimate-list">
        {items.map((item) => (
          <div className="estimate-row" key={item.id}>
            <span>{item.name}</span>
            <strong>{formatMoney(item.amount)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};