import { Link } from "react-router-dom";
import { PackageSearch } from "lucide-react";
import PageFrame from "../components/PageFrame";
import { LoadingBlock, ErrorBlock } from "../components/StateBlocks";
import { useFetch } from "../hooks/useApi";
import * as orderService from "../services/orderService";
import { money, formatDate } from "../utils/format";

export default function OrdersPage() {
  const query = useFetch(() => orderService.getOrders(), []);
  const orders = query.data ?? [];

  return (
    <PageFrame eyebrow="Order history" title="Everything you’ve ordered from us.">
      {query.isLoading ? (
        <LoadingBlock label="Pulling up your orders…" />
      ) : query.isError ? (
        <ErrorBlock onRetry={() => query.refetch()} />
      ) : orders.length === 0 ? (
        <div className="dashed-box" data-testid="empty-orders">
          <PackageSearch />
          <h3>No orders yet.</h3>
          <p>Your first plate is one menu away.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <Link key={order.id} to={`/orders/${order.id}`} className="order-row" data-testid={`link-order-${order.id}`}>
              <div className="order-row-inner">
                <div>
                  <p className="order-row-id">Order {order.id.slice(-8).toUpperCase()}</p>
                  <p className="order-row-meta">
                    {order.items.length} item{order.items.length > 1 ? "s" : ""} · {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="order-row-right">
                  <span className="pill pill-green">{order.orderStatus}</span>
                  <span className="order-row-total">{money(order.totalAmount)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageFrame>
  );
}
