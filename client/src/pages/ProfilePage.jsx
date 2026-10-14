import { Link } from "react-router-dom";
import { ClipboardList, LogOut, MapPin, ShieldCheck, User as UserIcon } from "lucide-react";
import PageFrame from "../components/PageFrame";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/format";

export default function ProfilePage() {
  const { user, logout, isAdmin } = useAuth();

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <PageFrame eyebrow="Your account" title="The table remembers you.">
      <div className="profile-grid">
        <aside className="profile-side">
          <div className="profile-avatar font-display">{initials}</div>
          <h2 className="font-display">{user.name}</h2>
          <p>{user.email}</p>
          <nav className="profile-nav">
            <Link to="/orders" data-testid="link-profile-orders">
              Order history <ClipboardList size={16} />
            </Link>
            <Link to="/reservations" data-testid="link-profile-reservations">
              Reservations <MapPin size={16} />
            </Link>
            {isAdmin && (
              <Link to="/admin" data-testid="link-profile-admin">
                Admin dashboard <ShieldCheck size={16} />
              </Link>
            )}
            <button onClick={logout} data-testid="button-logout">
              Log out <LogOut size={16} />
            </button>
          </nav>
        </aside>

        <div className="profile-main">
          <div className="profile-main-head">
            <div>
              <p className="eyebrow">Profile details</p>
              <h2 className="font-display">Account information</h2>
            </div>
            <UserIcon size={22} color="var(--color-rust)" />
          </div>
          <div className="profile-fields">
            <div>
              <p className="field-label">Full name</p>
              <p style={{ marginTop: 8, fontSize: 16 }}>{user.name}</p>
            </div>
            <div>
              <p className="field-label">Email</p>
              <p style={{ marginTop: 8, fontSize: 16 }}>{user.email}</p>
            </div>
            <div>
              <p className="field-label">Phone</p>
              <p style={{ marginTop: 8, fontSize: 16 }}>{user.phone || "—"}</p>
            </div>
            <div>
              <p className="field-label">Address</p>
              <p style={{ marginTop: 8, fontSize: 16 }}>{user.address || "—"}</p>
            </div>
            <div>
              <p className="field-label">Role</p>
              <p style={{ marginTop: 8, fontSize: 16, textTransform: "capitalize" }}>{user.role}</p>
            </div>
            <div>
              <p className="field-label">Member since</p>
              <p style={{ marginTop: 8, fontSize: 16 }}>{formatDate(user.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </PageFrame>
  );
}
