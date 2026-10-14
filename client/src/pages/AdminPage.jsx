import { useState } from "react";
import { LayoutDashboard, ListOrdered, Salad, Users2, CalendarClock, Trash2, Pencil } from "lucide-react";
import { useFetch, useMutation } from "../hooks/useApi";
import * as adminService from "../services/adminService";
import * as menuService from "../services/menuService";
import * as orderService from "../services/orderService";
import * as reservationService from "../services/reservationService";
import { LoadingBlock, ErrorBlock } from "../components/StateBlocks";
import { money, formatDate } from "../utils/format";

const tabs = [
  ["dashboard", "Dashboard", LayoutDashboard],
  ["menu", "Menu", Salad],
  ["orders", "Orders", ListOrdered],
  ["reservations", "Reservations", CalendarClock],
  ["users", "Users", Users2],
];

const orderStatuses = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];
const reservationStatuses = ["Pending", "Confirmed", "Cancelled", "Completed"];

const emptyDish = { name: "", description: "", price: "", category: "Indian", image: "", isVegetarian: false };

export default function AdminPage() {
  const [tab, setTab] = useState("dashboard");

  return (
    <div className="admin-shell">
      <div className="container" style={{ paddingTop: 64, paddingBottom: 80 }}>
        <div className="admin-header">
          <div>
            <p className="eyebrow">Behind the pass</p>
            <h1 className="font-display">Admin dashboard</h1>
          </div>
        </div>
        <div className="admin-tabs">
          {tabs.map(([value, label, Icon]) => (
            <button
              key={value}
              onClick={() => setTab(value)}
              className={`admin-tab${tab === value ? " active" : ""}`}
              data-testid={`tab-${value}`}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Icon size={15} /> {label}
              </span>
            </button>
          ))}
        </div>

        {tab === "dashboard" && <DashboardTab />}
        {tab === "menu" && <MenuTab />}
        {tab === "orders" && <OrdersTab />}
        {tab === "reservations" && <ReservationsTab />}
        {tab === "users" && <UsersTab />}
      </div>
    </div>
  );
}

function DashboardTab() {
  const query = useFetch(() => adminService.getAdminSummary(), []);

  if (query.isLoading) return <LoadingBlock label="Pulling numbers…" />;
  if (query.isError || !query.data) return <ErrorBlock onRetry={() => query.refetch()} />;

  const summary = query.data;
  const stats = [
    ["Total users", summary.totalUsers],
    ["Total orders", summary.totalOrders],
    ["Total revenue", money(summary.totalRevenue)],
    ["Pending orders", summary.pendingOrders],
    ["Reservations", summary.totalReservations],
  ];

  return (
    <div>
      <div className="admin-stats">
        {stats.map(([label, value]) => (
          <div key={label} className="admin-stat-card" data-testid={`stat-${label.toLowerCase().replaceAll(" ", "-")}`}>
            <p className="admin-stat-label">{label}</p>
            <p className="admin-stat-value font-display">{value}</p>
          </div>
        ))}
      </div>
      <div className="admin-panels">
        <div className="admin-panel">
          <p className="admin-panel-title">Popular dishes</p>
          {summary.popularDishes?.length ? (
            summary.popularDishes.map((dish) => (
              <div key={dish.name} className="dish-row">
                <span>{dish.name}</span>
                <span>{dish.orders} orders</span>
              </div>
            ))
          ) : (
            <p className="admin-empty">No orders yet.</p>
          )}
        </div>
        <div className="admin-panel">
          <p className="admin-panel-title">Quick actions</p>
          <p className="admin-empty">Use the Menu, Orders and Reservations tabs above to manage the restaurant.</p>
        </div>
      </div>
    </div>
  );
}

function MenuTab() {
  const query = useFetch(() => menuService.getMenu(), []);
  const createMutation = useMutation((data) => menuService.createMenuItem(data));
  const updateMutation = useMutation(({ id, data }) => menuService.updateMenuItem(id, data));
  const deleteMutation = useMutation((id) => menuService.deleteMenuItem(id));
  const [form, setForm] = useState(emptyDish);
  const [editingId, setEditingId] = useState(null);

  const items = query.data ?? [];

  const resetForm = () => {
    setForm(emptyDish);
    setEditingId(null);
  };

  const submit = (event) => {
    event.preventDefault();
    const payload = { ...form, price: Number(form.price) };
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload }, { onSuccess: () => { resetForm(); query.refetch(); } });
    } else {
      createMutation.mutate(payload, { onSuccess: () => { resetForm(); query.refetch(); } });
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      isVegetarian: item.isVegetarian,
    });
  };

  const toggleAvailability = (item) => {
    updateMutation.mutate({ id: item.id, data: { available: !item.available } }, { onSuccess: () => query.refetch() });
  };

  const remove = (id) => {
    deleteMutation.mutate(id, { onSuccess: () => query.refetch() });
  };

  return (
    <div className="admin-panel" style={{ marginTop: 32 }}>
      <div className="admin-menu-head">
        <div>
          <p className="admin-panel-title">Manage menu</p>
          <h2 className="font-display">{items.length} dishes on the menu</h2>
        </div>
      </div>

      <form onSubmit={submit} className="admin-input-row" style={{ marginTop: 24 }}>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Dish name"
          required
          className="admin-input"
          data-testid="input-dish-name"
        />
        <input
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          placeholder="Price"
          type="number"
          min="0"
          required
          className="admin-input"
          style={{ width: 100 }}
          data-testid="input-dish-price"
        />
        <input
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          placeholder="Category"
          required
          className="admin-input"
          style={{ width: 140 }}
          data-testid="input-dish-category"
        />
        <input
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="admin-input"
          style={{ flex: 1, minWidth: 180 }}
          data-testid="input-dish-description"
        />
        <input
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          placeholder="Image URL"
          className="admin-input"
          style={{ flex: 1, minWidth: 180 }}
          data-testid="input-dish-image"
        />
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--color-text-light-2)" }}>
          <input
            type="checkbox"
            checked={form.isVegetarian}
            onChange={(e) => setForm({ ...form, isVegetarian: e.target.checked })}
          />
          Veg
        </label>
        <button className="admin-btn-small" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-save-dish">
          {editingId ? "Update dish" : "Add dish"}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm} className="admin-btn-small" style={{ background: "transparent", color: "var(--color-cream-text)", border: "1px solid var(--color-brown-line-2)" }}>
            Cancel
          </button>
        )}
      </form>

      {query.isLoading ? (
        <LoadingBlock label="Loading the menu…" />
      ) : (
        <div className="admin-menu-list">
          {items.map((item) => (
            <div key={item.id} className="admin-menu-row" data-testid={`row-admin-dish-${item.id}`}>
              <div>
                <p style={{ fontWeight: 700 }}>{item.name}</p>
                <p className="admin-menu-row-meta">
                  {item.category} · {money(item.price)} · {item.available ? "Available" : "Unavailable"}
                </p>
              </div>
              <div className="admin-menu-row-actions">
                <button onClick={() => toggleAvailability(item)} data-testid={`button-toggle-${item.id}`}>
                  {item.available ? "Mark unavailable" : "Mark available"}
                </button>
                <button onClick={() => startEdit(item)} data-testid={`button-edit-${item.id}`}>
                  <Pencil size={14} />
                </button>
                <button onClick={() => remove(item.id)} data-testid={`button-delete-${item.id}`}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OrdersTab() {
  const query = useFetch(() => orderService.getOrders(), []);
  const updateMutation = useMutation(({ id, status }) => orderService.updateOrderStatus(id, status));
  const orders = query.data ?? [];

  if (query.isLoading) return <LoadingBlock label="Loading orders…" />;
  if (query.isError) return <ErrorBlock onRetry={() => query.refetch()} />;

  return (
    <div style={{ marginTop: 32 }}>
      {orders.length === 0 ? (
        <p className="admin-empty">No orders yet.</p>
      ) : (
        <div className="admin-list">
          {orders.map((order) => (
            <div key={order.id} className="admin-list-row" data-testid={`row-admin-order-${order.id}`}>
              <div>
                <p style={{ fontWeight: 700 }}>Order {order.id.slice(-8).toUpperCase()}</p>
                <p className="admin-list-row-meta">
                  {order.items.length} items · {money(order.totalAmount)} · {formatDate(order.createdAt)}
                </p>
              </div>
              <select
                value={order.orderStatus}
                onChange={(e) => updateMutation.mutate({ id: order.id, status: e.target.value }, { onSuccess: () => query.refetch() })}
                className="admin-select"
                data-testid={`select-order-status-${order.id}`}
              >
                {orderStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ReservationsTab() {
  const query = useFetch(() => reservationService.getReservations(), []);
  const updateMutation = useMutation(({ id, status }) => reservationService.updateReservation(id, { status }));
  const reservations = query.data ?? [];

  if (query.isLoading) return <LoadingBlock label="Loading reservations…" />;
  if (query.isError) return <ErrorBlock onRetry={() => query.refetch()} />;

  return (
    <div style={{ marginTop: 32 }}>
      {reservations.length === 0 ? (
        <p className="admin-empty">No reservations yet.</p>
      ) : (
        <div className="admin-list">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="admin-list-row" data-testid={`row-admin-reservation-${reservation.id}`}>
              <div>
                <p style={{ fontWeight: 700 }}>
                  {reservation.name} · {reservation.guests} guests
                </p>
                <p className="admin-list-row-meta">
                  {reservation.date} at {reservation.time} · {reservation.phone}
                </p>
              </div>
              <select
                value={reservation.status}
                onChange={(e) => updateMutation.mutate({ id: reservation.id, status: e.target.value }, { onSuccess: () => query.refetch() })}
                className="admin-select"
                data-testid={`select-reservation-status-${reservation.id}`}
              >
                {reservationStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UsersTab() {
  const query = useFetch(() => adminService.getAdminUsers(), []);
  const users = query.data ?? [];

  if (query.isLoading) return <LoadingBlock label="Loading users…" />;
  if (query.isError) return <ErrorBlock onRetry={() => query.refetch()} />;

  return (
    <div className="admin-table-wrap" style={{ marginTop: 32 }}>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} data-testid={`row-user-${user.id}`}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td style={{ textTransform: "capitalize" }}>{user.role}</td>
              <td>{formatDate(user.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
