import { useEffect, useState } from 'react'
import { getProfile, updateProfile, changePassword } from '../api/userApi'
import { getErrorMessage } from '../api/apiClient'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Spinner from '../components/Spinner'

const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition'
const btnCls = 'bg-sky-500 hover:bg-sky-600 disabled:opacity-60 text-white font-medium px-5 py-2.5 rounded-lg transition shadow-md shadow-sky-100'

const ADDRESS_FIELDS = [
  ['fullName', 'Full name'], ['phone', 'Phone'], ['street', 'Street address'],
  ['city', 'City'], ['state', 'State'], ['postalCode', 'Postal code'],
]

function Settings() {
  const { updateUser } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [pwSaving, setPwSaving] = useState(false)

  useEffect(() => {
    getProfile()
      .then((p) => setProfile({ ...p, address: p.address || {} }))
      .catch((e) => toast(getErrorMessage(e), 'error'))
  }, [toast])

  if (!profile) return <Spinner />

  const saveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const saved = await updateProfile({ name: profile.name, phone: profile.phone, address: profile.address })
      updateUser({ name: saved.name })
      toast('Profile saved')
    } catch (err) {
      toast(getErrorMessage(err), 'error')
    } finally {
      setSaving(false)
    }
  }

  const savePassword = async (e) => {
    e.preventDefault()
    if (pw.newPassword !== pw.confirm) return toast('New passwords do not match', 'error')
    setPwSaving(true)
    try {
      await changePassword({ currentPassword: pw.currentPassword, newPassword: pw.newPassword })
      setPw({ currentPassword: '', newPassword: '', confirm: '' })
      toast('Password updated')
    } catch (err) {
      toast(getErrorMessage(err), 'error')
    } finally {
      setPwSaving(false)
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Settings</h1>

      <form onSubmit={saveProfile} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <h2 className="font-semibold text-slate-800">Profile & default shipping address</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Name</span>
            <input required className={inputCls} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Email</span>
            <input disabled className={`${inputCls} bg-gray-50 text-gray-500`} value={profile.email} />
          </label>
          {ADDRESS_FIELDS.map(([key, label]) => (
            <label key={key} className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
              <input
                className={inputCls}
                value={profile.address[key] || ''}
                onChange={(e) => setProfile({ ...profile, address: { ...profile.address, [key]: e.target.value } })}
              />
            </label>
          ))}
        </div>
        <button className={btnCls} disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button>
      </form>

      <form onSubmit={savePassword} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <h2 className="font-semibold text-slate-800">Change password</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[['currentPassword', 'Current password'], ['newPassword', 'New password'], ['confirm', 'Confirm new password']].map(([key, label]) => (
            <label key={key} className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
              <input required type="password" className={inputCls} value={pw[key]} onChange={(e) => setPw({ ...pw, [key]: e.target.value })} />
            </label>
          ))}
        </div>
        <button className={btnCls} disabled={pwSaving}>{pwSaving ? 'Updating...' : 'Update password'}</button>
      </form>
    </div>
  )
}

export default Settings
