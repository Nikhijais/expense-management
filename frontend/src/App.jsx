const API_BASE = "http://localhost:5000/api";
import { useState, useEffect, createContext, useContext } from "react";

// ─── API CONFIG ────────────────────────────────────────────────────────────────
// const API_BASE = "http://localhost:5000/api";

const api = {
  register: (data) =>
    fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  login: (data) =>
    fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  dashboard: (token) =>
    fetch(`${API_BASE}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json()),

  updatePassword: (data, token) =>
    fetch(`${API_BASE}/update-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  updateCourse: (data, token) =>
    fetch(`${API_BASE}/update-course`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
};

// ─── COURSES LIST ──────────────────────────────────────────────────────────────
const COURSES = [
  "Computer Science",
  "Information Technology",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Data Science",
  "Artificial Intelligence",
  "Cybersecurity",
  "Business Administration",
  "Mathematics",
];

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = {
  User: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Mail: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  Lock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  BookOpen: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  LogOut: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Shield: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  X: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: "fixed", top: "24px", right: "24px", zIndex: 9999,
      display: "flex", alignItems: "center", gap: "10px",
      padding: "14px 20px", borderRadius: "12px",
      background: type === "success"
        ? "linear-gradient(135deg, #0d9488, #065f46)"
        : "linear-gradient(135deg, #dc2626, #7f1d1d)",
      color: "#fff", boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      animation: "slideIn 0.3s ease", fontSize: "14px", fontWeight: "500",
      maxWidth: "340px",
    }}>
      {type === "success" ? <Icon.Check /> : <Icon.X />}
      <span>{message}</span>
      <button onClick={onClose} style={{
        background: "none", border: "none", color: "#fff",
        cursor: "pointer", marginLeft: "8px", opacity: 0.7,
      }}>✕</button>
    </div>
  );
}

// ─── INPUT FIELD ──────────────────────────────────────────────────────────────
function InputField({ icon, type = "text", placeholder, value, onChange, name }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "12px",
      background: focused ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.04)",
      border: `1.5px solid ${focused ? "#6366f1" : "rgba(255,255,255,0.1)"}`,
      borderRadius: "12px", padding: "14px 16px", transition: "all 0.2s ease",
    }}>
      <span style={{ color: focused ? "#6366f1" : "#64748b", flexShrink: 0 }}>{icon}</span>
      <input
        type={type} name={name} placeholder={placeholder} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          background: "none", border: "none", outline: "none",
          color: "#e2e8f0", fontSize: "15px", width: "100%", fontFamily: "inherit",
        }}
      />
    </div>
  );
}

// ─── SELECT FIELD ─────────────────────────────────────────────────────────────
function SelectField({ icon, value, onChange, name, options, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "12px",
      background: focused ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.04)",
      border: `1.5px solid ${focused ? "#6366f1" : "rgba(255,255,255,0.1)"}`,
      borderRadius: "12px", padding: "14px 16px", transition: "all 0.2s ease",
    }}>
      <span style={{ color: focused ? "#6366f1" : "#64748b", flexShrink: 0 }}>{icon}</span>
      <select
        name={name} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          background: "none", border: "none", outline: "none",
          color: value ? "#e2e8f0" : "#64748b",
          fontSize: "15px", width: "100%", fontFamily: "inherit", cursor: "pointer",
        }}
      >
        <option value="" disabled style={{ background: "#1e293b" }}>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt} style={{ background: "#1e293b" }}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

// ─── BUTTON ───────────────────────────────────────────────────────────────────
function Button({ children, onClick, variant = "primary", loading }) {
  const [hovered, setHovered] = useState(false);
  const styles = {
    primary: {
      background: hovered
        ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
        : "linear-gradient(135deg, #6366f1, #8b5cf6)",
      color: "#fff", border: "none",
    },
    danger: {
      background: hovered
        ? "linear-gradient(135deg, #b91c1c, #7f1d1d)"
        : "linear-gradient(135deg, #dc2626, #991b1b)",
      color: "#fff", border: "none",
    },
  };
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={loading}
      style={{
        ...styles[variant],
        padding: "14px 24px", borderRadius: "12px", fontSize: "15px",
        fontWeight: "600", cursor: loading ? "not-allowed" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
        transition: "all 0.2s ease", width: "100%",
        transform: hovered && !loading ? "translateY(-1px)" : "none",
        boxShadow: hovered && !loading ? "0 8px 20px rgba(99,102,241,0.3)" : "none",
        opacity: loading ? 0.7 : 1,
        fontFamily: "inherit",
      }}
    >
      {loading ? (
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            width: "16px", height: "16px",
            border: "2px solid rgba(255,255,255,0.3)",
            borderTopColor: "#fff", borderRadius: "50%",
            animation: "spin 0.8s linear infinite", display: "inline-block",
          }} />
          Loading...
        </span>
      ) : children}
    </button>
  );
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
function Card({ children, style: extra = {} }) {
  return (
    <div style={{
      background: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px",
      padding: "32px", boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
      ...extra,
    }}>
      {children}
    </div>
  );
}

// ─── REGISTER PAGE ────────────────────────────────────────────────────────────
function RegisterPage({ onSwitch }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", course: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password || !form.course) {
      setToast({ message: "Please fill in all fields", type: "error" });
      return;
    }
    setLoading(true);
    try {
      const res = await api.register(form);
      if (res.message?.includes("successful")) {
        setToast({ message: "Registration successful! Please login.", type: "success" });
        setTimeout(() => onSwitch("login"), 1500);
      } else {
        setToast({ message: res.message || "Registration failed", type: "error" });
      }
    } catch {
      setToast({ message: "Server error. Please try again.", type: "error" });
    }
    setLoading(false);
  };

  return (
    <>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <div style={{
          width: "56px", height: "56px", borderRadius: "16px",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px", boxShadow: "0 8px 20px rgba(99,102,241,0.4)",
        }}>
          <Icon.User />
        </div>
        <h1 style={{ color: "#f1f5f9", fontSize: "26px", fontWeight: "700", marginBottom: "6px" }}>
          Create Account
        </h1>
        <p style={{ color: "#64748b", fontSize: "14px" }}>Join the student portal today</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <InputField icon={<Icon.User />} name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
        <InputField icon={<Icon.Mail />} name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} />
        <InputField icon={<Icon.Lock />} name="password" type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={handleChange} />
        <SelectField icon={<Icon.BookOpen />} name="course" placeholder="Select Course" value={form.course} onChange={handleChange} options={COURSES} />
        <div style={{ marginTop: "8px" }}>
          <Button loading={loading} onClick={handleSubmit}>Register</Button>
        </div>
      </div>

      <p style={{ textAlign: "center", color: "#64748b", fontSize: "14px", marginTop: "20px" }}>
        Already have an account?{" "}
        <button onClick={() => onSwitch("login")} style={{
          background: "none", border: "none", color: "#6366f1",
          cursor: "pointer", fontSize: "14px", fontWeight: "600",
        }}>Sign In</button>
      </p>
    </>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ onSwitch, onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setToast({ message: "Please fill in all fields", type: "error" });
      return;
    }
    setLoading(true);
    try {
      const res = await api.login(form);
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("student", JSON.stringify(res.student));
        setToast({ message: "Login successful! Redirecting...", type: "success" });
        setTimeout(() => onLogin(res.token, res.student), 800);
      } else {
        setToast({ message: res.message || "Login failed", type: "error" });
      }
    } catch {
      setToast({ message: "Server error. Please try again.", type: "error" });
    }
    setLoading(false);
  };

  return (
    <>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <div style={{
          width: "56px", height: "56px", borderRadius: "16px",
          background: "linear-gradient(135deg, #0d9488, #065f46)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px", boxShadow: "0 8px 20px rgba(13,148,136,0.4)",
        }}>
          <Icon.Shield />
        </div>
        <h1 style={{ color: "#f1f5f9", fontSize: "26px", fontWeight: "700", marginBottom: "6px" }}>
          Welcome Back
        </h1>
        <p style={{ color: "#64748b", fontSize: "14px" }}>Sign in to your student portal</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <InputField icon={<Icon.Mail />} name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} />
        <InputField icon={<Icon.Lock />} name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <div style={{ marginTop: "8px" }}>
          <Button loading={loading} onClick={handleSubmit}>Sign In</Button>
        </div>
      </div>

      <p style={{ textAlign: "center", color: "#64748b", fontSize: "14px", marginTop: "20px" }}>
        Don't have an account?{" "}
        <button onClick={() => onSwitch("register")} style={{
          background: "none", border: "none", color: "#6366f1",
          cursor: "pointer", fontSize: "14px", fontWeight: "600",
        }}>Register</button>
      </p>
    </>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage({ token, student: initialStudent, onLogout }) {
  const [student, setStudent] = useState(initialStudent);
  const [activeTab, setActiveTab] = useState("profile");
  const [pwForm, setPwForm] = useState({ oldPassword: "", newPassword: "" });
  const [newCourse, setNewCourse] = useState(initialStudent?.course || "");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    api.dashboard(token).then((res) => {
      if (res.student) {
        setStudent(res.student);
        setNewCourse(res.student.course);
        localStorage.setItem("student", JSON.stringify(res.student));
      }
    });
  }, [token]);

  const handleUpdatePassword = async () => {
    if (!pwForm.oldPassword || !pwForm.newPassword) {
      setToast({ message: "Please fill in both password fields", type: "error" });
      return;
    }
    setLoading(true);
    const res = await api.updatePassword(pwForm, token);
    setToast({
      message: res.message,
      type: res.message?.includes("success") ? "success" : "error",
    });
    if (res.message?.includes("success")) setPwForm({ oldPassword: "", newPassword: "" });
    setLoading(false);
  };

  const handleUpdateCourse = async () => {
    if (!newCourse) {
      setToast({ message: "Please select a course", type: "error" });
      return;
    }
    setLoading(true);
    const res = await api.updateCourse({ course: newCourse }, token);
    if (res.student) {
      setStudent(res.student);
      localStorage.setItem("student", JSON.stringify(res.student));
    }
    setToast({
      message: res.message,
      type: res.message?.includes("success") ? "success" : "error",
    });
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("student");
    onLogout();
  };

  const getInitials = (name) =>
    name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "ST";

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "password", label: "Change Password" },
    { id: "course", label: "Change Course" },
  ];

  return (
    <>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 24px",
        background: "rgba(15,23,42,0.9)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon.Shield />
          </div>
          <span style={{ color: "#f1f5f9", fontWeight: "700", fontSize: "18px" }}>
            Student Portal
          </span>
        </div>
        <button
          onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "10px", padding: "8px 16px", color: "#ef4444",
            cursor: "pointer", fontSize: "14px", fontWeight: "500", fontFamily: "inherit",
          }}
        >
          <Icon.LogOut /> Logout
        </button>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 24px" }}>

        {/* Welcome Banner */}
        <div style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))",
          border: "1px solid rgba(99,102,241,0.2)", borderRadius: "20px",
          padding: "28px", marginBottom: "28px",
          display: "flex", alignItems: "center", gap: "20px",
        }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "22px", fontWeight: "700", color: "#fff", flexShrink: 0,
          }}>
            {getInitials(student?.name)}
          </div>
          <div>
            <h2 style={{ color: "#f1f5f9", fontSize: "22px", fontWeight: "700", margin: "0 0 4px" }}>
              Welcome, {student?.name?.split(" ")[0]}! 👋
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
              {student?.course} · {student?.email}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: "8px", marginBottom: "24px",
          background: "rgba(255,255,255,0.04)", padding: "6px",
          borderRadius: "14px", border: "1px solid rgba(255,255,255,0.08)",
        }}>
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flex: 1, padding: "10px", borderRadius: "10px", cursor: "pointer",
              fontFamily: "inherit", fontSize: "14px", fontWeight: "500",
              border: "none", transition: "all 0.2s",
              background: activeTab === tab.id
                ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "transparent",
              color: activeTab === tab.id ? "#fff" : "#64748b",
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <Card>
            <h3 style={{ color: "#f1f5f9", fontSize: "18px", fontWeight: "600", marginBottom: "20px" }}>
              Student Details
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { label: "Full Name", value: student?.name, icon: <Icon.User /> },
                { label: "Email Address", value: student?.email, icon: <Icon.Mail /> },
                { label: "Course Enrolled", value: student?.course, icon: <Icon.BookOpen /> },
                {
                  label: "Member Since",
                  value: student?.createdAt
                    ? new Date(student.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "long", year: "numeric",
                      })
                    : "—",
                  icon: <Icon.Shield />,
                },
              ].map(({ label, value, icon }) => (
                <div key={label} style={{
                  display: "flex", alignItems: "center", gap: "14px",
                  padding: "14px 16px", background: "rgba(255,255,255,0.04)",
                  borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)",
                }}>
                  <span style={{ color: "#6366f1" }}>{icon}</span>
                  <div>
                    <div style={{ color: "#64748b", fontSize: "12px", marginBottom: "2px" }}>{label}</div>
                    <div style={{ color: "#e2e8f0", fontSize: "15px", fontWeight: "500" }}>{value || "—"}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <Card>
            <h3 style={{ color: "#f1f5f9", fontSize: "18px", fontWeight: "600", marginBottom: "20px" }}>
              Change Password
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <InputField
                icon={<Icon.Lock />} name="oldPassword" type="password"
                placeholder="Current Password" value={pwForm.oldPassword}
                onChange={(e) => setPwForm({ ...pwForm, oldPassword: e.target.value })}
              />
              <InputField
                icon={<Icon.Lock />} name="newPassword" type="password"
                placeholder="New Password (min 6 chars)" value={pwForm.newPassword}
                onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
              />
              <div style={{ marginTop: "8px" }}>
                <Button loading={loading} onClick={handleUpdatePassword}>
                  Update Password
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Course Tab */}
        {activeTab === "course" && (
          <Card>
            <h3 style={{ color: "#f1f5f9", fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
              Change Course
            </h3>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>
              Current: <span style={{ color: "#6366f1", fontWeight: "600" }}>{student?.course}</span>
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <SelectField
                icon={<Icon.BookOpen />} name="course"
                placeholder="Select New Course" value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)} options={COURSES}
              />
              <div style={{ marginTop: "8px" }}>
                <Button loading={loading} onClick={handleUpdateCourse}>
                  Update Course
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("login");
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [student, setStudent] = useState(() => {
    try { return JSON.parse(localStorage.getItem("student")); }
    catch { return null; }
  });

  const handleLogin = (tok, stu) => { setToken(tok); setStudent(stu); };
  const handleLogout = () => { setToken(null); setStudent(null); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Sora', sans-serif; background: #030712; min-height: 100vh; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>

      {token && student ? (
        <div style={{ minHeight: "100vh", background: "#030712" }}>
          <div style={{
            position: "fixed", top: "-200px", left: "-200px",
            width: "600px", height: "600px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <DashboardPage token={token} student={student} onLogout={handleLogout} />
        </div>
      ) : (
        <div style={{
          minHeight: "100vh", display: "flex", alignItems: "center",
          justifyContent: "center", background: "#030712",
          padding: "24px", position: "relative", overflow: "hidden",
        }}>
          {/* Background Effects */}
          <div style={{
            position: "absolute", top: "10%", left: "5%",
            width: "500px", height: "500px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: "10%", right: "5%",
            width: "400px", height: "400px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(rgba(99,102,241,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px", pointerEvents: "none",
          }} />

          <div style={{
            width: "100%", maxWidth: "420px",
            animation: "fadeUp 0.5s ease", position: "relative", zIndex: 1,
          }}>
            <Card>
              {page === "login"
                ? <LoginPage onSwitch={setPage} onLogin={handleLogin} />
                : <RegisterPage onSwitch={setPage} />
              }
            </Card>
            <p style={{ textAlign: "center", color: "#334155", fontSize: "12px", marginTop: "20px" }}>
              🔒 Secured with JWT Authentication · MERN Stack
            </p>
          </div>
        </div>
      )}
    </>
  );
}