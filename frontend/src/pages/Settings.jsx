import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../api/authApi";
import { getErrorMessage } from "../utils/format";
import Alert from "../components/Alert";

const inputStyle =
  "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition";
const buttonStyle =
  "bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition";

function Settings() {
  const { user, updateUser } = useAuth();

  // --- Profile form (name) ---
  const [name, setName] = useState(user?.name || "");
  const [profileMessage, setProfileMessage] = useState(null); // { type, text }
  const [savingProfile, setSavingProfile] = useState(false);

  // --- Password form ---
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState(null); // { type, text }
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMessage(null);
    setSavingProfile(true);

    try {
      const data = await updateProfile({ name });
      updateUser(data.user); // so the sidebar shows the new name straight away
      setProfileMessage({ type: "success", text: "Your name was updated." });
    } catch (err) {
      setProfileMessage({ type: "error", text: getErrorMessage(err) });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "The new passwords do not match." });
      return;
    }

    setSavingPassword(true);
    try {
      await updateProfile({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage({ type: "success", text: "Your password was changed." });
    } catch (err) {
      setPasswordMessage({ type: "error", text: getErrorMessage(err) });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-800">Settings</h1>

      <div className="mt-6 space-y-6">
        {/* Profile */}
        <form onSubmit={handleProfileSubmit} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-slate-800">Profile</h2>

          <Alert type={profileMessage?.type}>{profileMessage?.text}</Alert>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputStyle}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className={`${inputStyle} bg-slate-50 text-slate-500 cursor-not-allowed`}
            />
            <p className="mt-1 text-xs text-slate-400">Your email can not be changed.</p>
          </div>

          <button type="submit" disabled={savingProfile} className={buttonStyle}>
            {savingProfile ? "Saving..." : "Save changes"}
          </button>
        </form>

        {/* Password */}
        <form onSubmit={handlePasswordSubmit} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-slate-800">Change password</h2>

          <Alert type={passwordMessage?.type}>{passwordMessage?.text}</Alert>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputStyle}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputStyle}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm new password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputStyle}
            />
          </div>

          <button type="submit" disabled={savingPassword} className={buttonStyle}>
            {savingPassword ? "Saving..." : "Change password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Settings;
