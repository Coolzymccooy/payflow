import React, { useState } from 'react';
import { PageHeader } from './PageHeader';
import { User, Role } from '../types';
import { Users, Plus, Shield, Mail, MoreHorizontal, Check, X, Search, Lock, Code } from 'lucide-react';

export const Team: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 'USR-01', name: 'John Doe', email: 'john@payflow.app', role: 'ADMIN', status: 'ACTIVE', lastLogin: 'Just now', mfaEnabled: true },
    { id: 'USR-02', name: 'Sarah Smith', email: 'sarah@payflow.app', role: 'FINANCE', status: 'ACTIVE', lastLogin: '2h ago', mfaEnabled: true },
    { id: 'USR-03', name: 'Mike Johnson', email: 'mike@payflow.app', role: 'DEVELOPER', status: 'ACTIVE', lastLogin: '1d ago', mfaEnabled: false },
    { id: 'USR-04', name: 'Emily Chen', email: 'emily@payflow.app', role: 'HR', status: 'INVITED', lastLogin: '-', mfaEnabled: false },
  ]);

  const [isInviting, setIsInviting] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<Role>('VIEWER');

  const handleInvite = () => {
    if (!newEmail) return;
    const newUser: User = {
      id: `USR-${Math.floor(Math.random() * 1000)}`,
      name: 'Pending User',
      email: newEmail,
      role: newRole,
      status: 'INVITED',
      lastLogin: '-',
      mfaEnabled: false
    };
    setUsers([...users, newUser]);
    setIsInviting(false);
    setNewEmail('');
  };

  const getRoleColor = (role: Role) => {
    switch (role) {
      case 'ADMIN': return 'bg-brand-900 text-white border-brand-800';
      case 'FINANCE': return 'bg-emerald-50 text-data-emerald border-emerald-100';
      case 'HR': return 'bg-blue-50 text-data-blue border-blue-100';
      case 'DEVELOPER': return 'bg-violet-50 text-data-violet border-violet-100';
      default: return 'bg-brand-50 text-brand-500 border-brand-200';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Team & Access Control" 
        subtitle="Manage users, roles, and security permissions."
        breadcrumbs={['Workspace', 'Admin', 'Team']}
        actions={
            <button 
              onClick={() => setIsInviting(true)}
              className="mt-4 md:mt-0 bg-brand-900 hover:bg-brand-800 text-white px-4 py-2 rounded-sm text-sm font-bold flex items-center gap-2 transition-colors uppercase tracking-wide shadow-sm"
            >
              <Plus className="w-4 h-4" /> Invite Member
            </button>
        }
      />

      {isInviting && (
        <div className="bg-brand-50 p-6 rounded-sm border border-brand-200 mb-6 animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-sm font-bold uppercase tracking-wider text-brand-900">Invite New User</h3>
             <button onClick={() => setIsInviting(false)}><X className="w-4 h-4 text-brand-400 hover:text-brand-900" /></button>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-end">
             <div className="flex-1 w-full">
                <label className="block text-xs font-mono font-bold text-brand-500 mb-1 uppercase">Email Address</label>
                <input 
                   type="email" 
                   value={newEmail}
                   onChange={(e) => setNewEmail(e.target.value)}
                   className="w-full px-3 py-2 border border-brand-200 rounded-sm text-sm outline-none focus:border-action-500"
                   placeholder="colleague@company.com"
                />
             </div>
             <div className="w-full md:w-48">
                <label className="block text-xs font-mono font-bold text-brand-500 mb-1 uppercase">Role</label>
                <select 
                   value={newRole}
                   onChange={(e) => setNewRole(e.target.value as Role)}
                   className="w-full px-3 py-2 border border-brand-200 rounded-sm text-sm outline-none focus:border-action-500 bg-white"
                >
                   <option value="ADMIN">Admin</option>
                   <option value="FINANCE">Finance</option>
                   <option value="HR">HR Manager</option>
                   <option value="DEVELOPER">Developer</option>
                   <option value="VIEWER">Viewer</option>
                </select>
             </div>
             <button onClick={handleInvite} className="w-full md:w-auto px-6 py-2 bg-action-500 text-white font-bold uppercase text-xs rounded-sm hover:bg-action-600">
                Send Invite
             </button>
          </div>
        </div>
      )}

      {/* Role Definitions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
         <div className="p-3 border border-brand-100 rounded-sm bg-white">
            <div className="flex items-center gap-2 mb-1">
               <Shield className="w-3 h-3 text-brand-900" />
               <span className="text-xs font-bold uppercase text-brand-900">Admin</span>
            </div>
            <p className="text-[10px] text-brand-500">Full access to Treasury, Team, and Settings.</p>
         </div>
         <div className="p-3 border border-brand-100 rounded-sm bg-white">
            <div className="flex items-center gap-2 mb-1">
               <Users className="w-3 h-3 text-data-blue" />
               <span className="text-xs font-bold uppercase text-brand-900">HR Manager</span>
            </div>
            <p className="text-[10px] text-brand-500">Can view Payroll and Employee data.</p>
         </div>
         <div className="p-3 border border-brand-100 rounded-sm bg-white">
            <div className="flex items-center gap-2 mb-1">
               <Lock className="w-3 h-3 text-data-emerald" />
               <span className="text-xs font-bold uppercase text-brand-900">Finance</span>
            </div>
            <p className="text-[10px] text-brand-500">Can view Transactions and Treasury.</p>
         </div>
         <div className="p-3 border border-brand-100 rounded-sm bg-white">
            <div className="flex items-center gap-2 mb-1">
               <Code className="w-3 h-3 text-data-violet" />
               <span className="text-xs font-bold uppercase text-brand-900">Developer</span>
            </div>
            <p className="text-[10px] text-brand-500">API Keys and Webhooks access only.</p>
         </div>
      </div>

      <div className="bg-white border border-brand-100 rounded-sm overflow-hidden shadow-sm">
        <div className="p-3 border-b border-brand-100 flex justify-between items-center bg-brand-50">
            <div className="relative max-w-sm w-full">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-400" />
               <input 
                 type="text" 
                 placeholder="Search team members..." 
                 className="w-full pl-8 pr-3 py-1.5 border border-brand-200 rounded-sm text-xs outline-none focus:border-action-500 bg-white"
               />
            </div>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-white text-brand-500 font-medium border-b border-brand-100">
            <tr>
              <th className="px-6 py-3 text-xs uppercase tracking-wider font-mono font-bold">User</th>
              <th className="px-6 py-3 text-xs uppercase tracking-wider font-mono font-bold">Role</th>
              <th className="px-6 py-3 text-xs uppercase tracking-wider font-mono font-bold">Status</th>
              <th className="px-6 py-3 text-xs uppercase tracking-wider font-mono font-bold">MFA</th>
              <th className="px-6 py-3 text-xs uppercase tracking-wider font-mono font-bold">Last Active</th>
              <th className="px-6 py-3 text-right text-xs uppercase tracking-wider font-mono font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-100 bg-white">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-brand-50 transition-colors">
                <td className="px-6 py-4">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-600">
                         {user.name.charAt(0)}
                      </div>
                      <div>
                         <p className="font-bold text-brand-900 text-sm">{user.name}</p>
                         <p className="text-xs text-brand-500 font-mono">{user.email}</p>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-4">
                   <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase border ${getRoleColor(user.role)}`}>
                      {user.role}
                   </span>
                </td>
                <td className="px-6 py-4">
                   {user.status === 'ACTIVE' && <span className="flex items-center gap-1.5 text-xs font-bold text-data-emerald"><Check className="w-3 h-3" /> Active</span>}
                   {user.status === 'INVITED' && <span className="flex items-center gap-1.5 text-xs font-bold text-brand-400"><Mail className="w-3 h-3" /> Invited</span>}
                </td>
                <td className="px-6 py-4">
                   {user.mfaEnabled 
                     ? <span className="text-data-emerald bg-emerald-50 px-1.5 py-0.5 rounded-sm border border-emerald-100 text-[10px] font-bold">ENABLED</span>
                     : <span className="text-brand-400 bg-brand-50 px-1.5 py-0.5 rounded-sm border border-brand-100 text-[10px] font-bold">DISABLED</span>
                   }
                </td>
                <td className="px-6 py-4 text-xs font-mono text-brand-500">
                   {user.lastLogin}
                </td>
                <td className="px-6 py-4 text-right">
                   <button className="text-brand-400 hover:text-brand-900 p-1">
                      <MoreHorizontal className="w-4 h-4" />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};