import { ORDER_STATUS_LABELS, ORDER_STATUS_SEQUENCE, type OrderStatus } from "../types";

export function StatusTimeline({ status }: { status: OrderStatus }) {
  const currentIndex = ORDER_STATUS_SEQUENCE.indexOf(status);

  return (
    <ol className="status-timeline">
      {ORDER_STATUS_SEQUENCE.map((step, index) => {
        const state =
          index < currentIndex ? "done" : index === currentIndex ? "current" : "upcoming";
        return (
          <li key={step} className={`status-timeline__step status-timeline__step--${state}`}>
            <span className="status-timeline__dot" aria-hidden="true" />
            <span>{ORDER_STATUS_LABELS[step]}</span>
          </li>
        );
      })}
    </ol>
  );
}
