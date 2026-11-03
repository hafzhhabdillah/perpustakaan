import { useState, useEffect } from 'react';
import { userService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Users, Search, Shield, User, Trash2 } from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';

export default function UserManager({ onNotify }) {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.getAll({
        search: search || undefined,
        role: roleFilter || undefined,
      });
      if (res.data?.success) {
        setUsers(res.data.data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRole = async (targetUser) => {
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    try {
      const res = await userService.updateRole(targetUser.id, newRole);
      if (res.data?.success) {
        onNotify({ type: 'success', message: res.data.message });
        fetchUsers();
      }
    } catch (err) {
      onNotify({
        type: 'error',
        message: err.response?.data?.message || 'Gagal mengubah role user.',
      });
    }
  };

  const handleOpenDelete = (targetUser) => {
    setUserToDelete(targetUser);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setDeleteLoading(true);

    try {
      const res = await userService.delete(userToDelete.id);
      if (res.data?.success) {
        onNotify({ type: 'success', message: res.data.message });
        setDeleteModalOpen(false);
        fetchUsers();
      }
    } catch (err) {
      onNotify({
        type: 'error',
        message: err.response?.data?.message || 'Gagal menghapus user.',
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-600" /> Manajemen Akun Pengguna
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Kelola hak akses dan peran pengguna terdaftar perpustakaan
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari nama/email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            <option value="">Semua Role</option>
            <option value="admin">Admin</option>
            <option value="user">User (Member)</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3.5 px-6">Pengguna</th>
                <th className="py-3.5 px-6">Role</th>
                <th className="py-3.5 px-6 text-center">Buku Favorit</th>
                <th className="py-3.5 px-6 text-center">Tanggal Daftar</th>
                <th className="py-3.5 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Memuat data pengguna...
                  </td>
                </tr>
              ) : users.map((u) => {
                const isSelf = u.id === currentUser?.id;
                return (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 flex items-center gap-2">
                            {u.name}
                            {isSelf && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                                Anda
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {u.role === 'admin' ? (
                          <Shield className="w-3 h-3" />
                        ) : (
                          <User className="w-3 h-3" />
                        )}
                        <span className="capitalize">{u.role}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-slate-700">
                      {u.favorites_count ?? 0}
                    </td>
                    <td className="py-4 px-6 text-center text-xs text-slate-500">
                      {new Date(u.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {!isSelf ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleRole(u)}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold hover:bg-slate-100 transition"
                          >
                            Ubah ke {u.role === 'admin' ? 'User' : 'Admin'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(u)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Akun Anda</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete User Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Hapus Akun Pengguna"
        message={`Apakah Anda yakin ingin menghapus akun "${userToDelete?.name}" (${userToDelete?.email})?`}
        confirmText="Ya, Hapus Akun"
        isDanger={true}
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}

