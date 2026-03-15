'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { BLOOD_GROUPS, DISTRICTS } from '@/lib/geodata';
import {
  AlertTriangle,
  Eye,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle,
  XCircle,
  Filter,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

interface BloodRequest {
  id: number;
  patient_name: string;
  blood_group: string;
  units: number;
  hospital_name: string;
  district: string;
  contact_number: string;
  urgency: 'critical' | 'moderate' | 'normal';
  additional_note: string | null;
  image_url: string | null;
  status: 'pending' | 'fulfilled' | 'rejected';
  created_at: string;
}

interface ApiResponse {
  requests: BloodRequest[];
  total: number;
  page: number;
  pages: number;
}

interface Filters {
  bloodGroup: string;
  district: string;
  urgency: string;
  status: string;
}

// ── Badge helpers ──────────────────────────────────────────────────────────────

function UrgencyBadge({ urgency }: { urgency: BloodRequest['urgency'] }) {
  const classes: Record<string, string> = {
    critical: 'bg-red-600 text-white font-bold',
    moderate: 'bg-orange-100 text-orange-800',
    normal: 'bg-gray-100 text-gray-700',
  };
  const labels: Record<string, string> = {
    critical: 'Critical',
    moderate: 'Moderate',
    normal: 'Normal',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${classes[urgency]}`}>
      {labels[urgency]}
    </span>
  );
}

function StatusBadge({ status }: { status: BloodRequest['status'] }) {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    fulfilled: 'bg-blue-100 text-blue-800',
    rejected: 'bg-red-100 text-red-800',
  };
  const labels: Record<string, string> = {
    pending: 'Pending',
    fulfilled: 'Fulfilled',
    rejected: 'Rejected',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${classes[status]}`}>
      {labels[status]}
    </span>
  );
}

function BloodGroupBadge({ bg }: { bg: string }) {
  const classes: Record<string, string> = {
    'A+': 'bg-red-100 text-red-700',
    'A-': 'bg-red-100 text-red-700',
    'B+': 'bg-blue-100 text-blue-700',
    'B-': 'bg-blue-100 text-blue-700',
    'AB+': 'bg-purple-100 text-purple-700',
    'AB-': 'bg-purple-100 text-purple-700',
    'O+': 'bg-green-100 text-green-700',
    'O-': 'bg-green-100 text-green-700',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${classes[bg] ?? 'bg-gray-100 text-gray-700'}`}>
      {bg}
    </span>
  );
}

// ── Detail Modal ───────────────────────────────────────────────────────────────

function DetailModal({ request, onClose }: { request: BloodRequest; onClose: () => void }) {
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('bn-BD', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Blood Request Details</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-500">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          {[
            ['Patient Name', request.patient_name],
            ['Blood Group', request.blood_group],
            ['Units', `${request.units} bag(s)`],
            ['Hospital', request.hospital_name],
            ['District', request.district],
            ['Contact', request.contact_number],
          ].map(([label, value]) => (
            <div key={label} className="flex gap-3">
              <span className="text-sm text-gray-500 w-36 shrink-0">{label}</span>
              <span className="text-sm text-gray-900 font-medium">{value}</span>
            </div>
          ))}
          <div className="flex gap-3">
            <span className="text-sm text-gray-500 w-36 shrink-0">Urgency</span>
            <UrgencyBadge urgency={request.urgency} />
          </div>
          <div className="flex gap-3">
            <span className="text-sm text-gray-500 w-36 shrink-0">Status</span>
            <StatusBadge status={request.status} />
          </div>
          {request.additional_note && (
            <div className="flex gap-3">
              <span className="text-sm text-gray-500 w-36 shrink-0">Additional Note</span>
              <span className="text-sm text-gray-900">{request.additional_note}</span>
            </div>
          )}
          {request.image_url && (
            <div className="flex gap-3">
              <span className="text-sm text-gray-500 w-36 shrink-0">Document</span>
              <a href={request.image_url} target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={request.image_url} alt="Document" className="h-24 w-24 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition" />
              </a>
            </div>
          )}
          <div className="flex gap-3">
            <span className="text-sm text-gray-500 w-36 shrink-0">Submitted</span>
            <span className="text-sm text-gray-900">{formatDate(request.created_at)}</span>
          </div>
        </div>
        <div className="p-5 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [filters, setFilters] = useState<Filters>({ bloodGroup: '', district: '', urgency: '', status: '' });
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);

  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => setToast(null), 3000);
  };

  const fetchRequests = useCallback(async (currentFilters: Filters, currentPage: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentFilters.bloodGroup) params.set('bloodGroup', currentFilters.bloodGroup);
      if (currentFilters.district) params.set('district', currentFilters.district);
      if (currentFilters.urgency) params.set('urgency', currentFilters.urgency);
      if (currentFilters.status) params.set('status', currentFilters.status);
      params.set('page', String(currentPage));
      params.set('limit', '20');

      const res = await fetch(`/api/requests?${params.toString()}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      const data: ApiResponse = json.data ?? json;
      setRequests(data.requests ?? []);
      setTotalCount(data.total ?? 0);
      setTotalPages(data.pages ?? 1);
    } catch {
      showToast('তথ্য লোড করতে সমস্যা হয়েছে।', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests(filters, page);
  }, [filters, page, fetchRequests]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleAction = async (id: number, action: 'fulfill' | 'reject' | 'delete') => {
    if (action === 'delete') {
      if (!window.confirm('এই অনুরোধটি মুছে ফেলতে চান?')) return;
    }
    setActionLoading(id);
    try {
      if (action === 'delete') {
       const res = await fetch(`/api/requests/${id}`, { method: 'DELETE', credentials: 'include' });
        if (!res.ok) throw new Error();
        showToast('অনুরোধটি মুছে ফেলা হয়েছে।');
      } else {
        const status = action === 'fulfill' ? 'fulfilled' : 'rejected';
        const res = await fetch(`/api/requests/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
          credentials: 'include',
        });
        if (!res.ok) throw new Error();
        showToast(action === 'fulfill' ? 'অনুরোধটি পূর্ণ হিসেবে চিহ্নিত হয়েছে।' : 'অনুরোধটি প্রত্যাখ্যান করা হয়েছে।');
      }
      await fetchRequests(filters, page);
    } catch {
      showToast('কার্যক্রম সম্পন্ন করা যায়নি।', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (filters.bloodGroup) params.set('bloodGroup', filters.bloodGroup);
      if (filters.district) params.set('district', filters.district);
      if (filters.urgency) params.set('urgency', filters.urgency);
      if (filters.status) params.set('status', filters.status);
      params.set('limit', '9999');
      params.set('page', '1');

      const res = await fetch(`/api/requests?${params.toString()}`, { credentials: 'include' });
      if (!res.ok) throw new Error();
      const json = await res.json();
      const data: ApiResponse = json.data ?? json;

      const urgencyLabel: Record<string, string> = { critical: 'জরুরি', moderate: 'মাঝারি', normal: 'সাধারণ' };
      const statusLabel: Record<string, string> = { pending: 'অপেক্ষমাণ', fulfilled: 'পূর্ণ', rejected: 'প্রত্যাখ্যাত' };

      const headers = ['Patient', 'Blood Group', 'Units', 'Hospital', 'District', 'Urgency', 'Contact', 'Status', 'Note', 'Submitted'];
      const rows = data.requests.map(r => [
        r.patient_name,
        r.blood_group,
        String(r.units),
        r.hospital_name,
        r.district,
        urgencyLabel[r.urgency] ?? r.urgency,
        r.contact_number,
        statusLabel[r.status] ?? r.status,
        r.additional_note ?? '',
        new Date(r.created_at).toISOString(),
      ]);

      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');

      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `blood-requests-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      showToast('CSV ডাউনলোড করা যায়নি।', 'error');
    } finally {
      setExporting(false);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blood Requests</h1>
          <p className="text-sm text-gray-500 mt-0.5">{totalCount} total requests</p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={exporting || loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          <Download size={16} />
          {exporting ? 'ডাউনলোড হচ্ছে...' : 'CSV ডাউনলোড'}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700">
          <Filter size={15} />
          Filters
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <select
            value={filters.bloodGroup}
            onChange={e => handleFilterChange('bloodGroup', e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="">All Blood Groups</option>
            {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
          </select>

          <select
            value={filters.urgency}
            onChange={e => handleFilterChange('urgency', e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="">All Urgency</option>
            <option value="critical">Critical</option>
            <option value="moderate">Moderate</option>
            <option value="normal">Normal</option>
          </select>

          <select
            value={filters.district}
            onChange={e => handleFilterChange('district', e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="">All Districts</option>
            {DISTRICTS.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
          </select>

          <select
            value={filters.status}
            onChange={e => handleFilterChange('status', e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Mobile cards — visible only on small screens */}
      <div className="md:hidden space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-2 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/2" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
          ))
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center text-gray-400 text-sm">
            <AlertTriangle size={28} className="mx-auto mb-2 text-gray-300" />
            কোনো অনুরোধ পাওয়া যায়নি।
          </div>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className={`bg-white rounded-xl border shadow-sm p-4 ${req.urgency === 'critical' ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900 text-sm">{req.patient_name}</span>
                  <BloodGroupBadge bg={req.blood_group} />
                </div>
                <UrgencyBadge urgency={req.urgency} />
              </div>
              <div className="text-xs text-gray-500 space-y-1 mb-3">
                <div><span className="font-medium text-gray-700">Hospital:</span> {req.hospital_name}</div>
                <div><span className="font-medium text-gray-700">District:</span> {req.district}</div>
                <div><span className="font-medium text-gray-700">Contact:</span> {req.contact_number}</div>
                <div><span className="font-medium text-gray-700">Bags:</span> {req.units} bag(s)</div>
              </div>
              <div className="flex items-center justify-between">
                <StatusBadge status={req.status} />
                <div className="flex items-center gap-2">
                  {req.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAction(req.id, 'fulfill')}
                        disabled={actionLoading === req.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg hover:bg-blue-100 transition disabled:opacity-40"
                      >
                        <CheckCircle size={12} /> পূর্ণ
                      </button>
                      <button
                        onClick={() => handleAction(req.id, 'reject')}
                        disabled={actionLoading === req.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-orange-50 text-orange-600 text-xs font-medium rounded-lg hover:bg-orange-100 transition disabled:opacity-40"
                      >
                        <XCircle size={12} /> প্রত্যাখ্যান
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setSelectedRequest(req)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-200 transition"
                  >
                    <Eye size={12} /> দেখুন
                  </button>
                  <button
                    onClick={() => handleAction(req.id, 'delete')}
                    disabled={actionLoading === req.id}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-50 text-red-500 text-xs font-medium rounded-lg hover:bg-red-100 transition disabled:opacity-40"
                  >
                    <Trash2 size={12} /> মুছুন
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Table — hidden on mobile, visible md+ */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
            লোড হচ্ছে...
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <AlertTriangle size={32} className="mb-2 text-gray-300" />
            <p className="text-sm">কোনো অনুরোধ পাওয়া যায়নি।</p>
          </div>
        ) : (
          <div className="overflow-x-auto thin-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left">
                  {['Patient', 'Doc', 'Blood Group', 'Bags', 'Hospital', 'District', 'Urgency', 'Contact', 'Status', 'Submitted', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map(req => (
                  <tr
                    key={req.id}
                    className={`hover:bg-gray-50 transition-colors ${req.urgency === 'critical' ? 'bg-red-50 hover:bg-red-100' : ''}`}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap max-w-[140px] truncate">
                      {req.patient_name}
                    </td>
                    <td className="px-4 py-3">
                      {req.image_url ? (
                        <a href={req.image_url} target="_blank" rel="noopener noreferrer">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={req.image_url} alt="Doc" className="h-8 w-8 rounded object-cover border border-gray-200 hover:opacity-80 transition" />
                        </a>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <BloodGroupBadge bg={req.blood_group} />
                    </td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      {req.units} ব্যাগ
                    </td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap max-w-[140px] truncate">
                      {req.hospital_name}
                    </td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      {req.district}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <UrgencyBadge urgency={req.urgency} />
                    </td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      {req.contact_number}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                      {formatDate(req.created_at)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {req.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAction(req.id, 'fulfill')}
                              disabled={actionLoading === req.id}
                              title="পূর্ণ করুন"
                              className="p-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors disabled:opacity-40"
                            >
                              <CheckCircle size={15} />
                            </button>
                            <button
                              onClick={() => handleAction(req.id, 'reject')}
                              disabled={actionLoading === req.id}
                              title="প্রত্যাখ্যান"
                              className="p-1.5 rounded-md bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors disabled:opacity-40"
                            >
                              <XCircle size={15} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setSelectedRequest(req)}
                          title="বিবরণ দেখুন"
                          className="p-1.5 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleAction(req.id, 'delete')}
                          disabled={actionLoading === req.id}
                          title="মুছুন"
                          className="p-1.5 rounded-md bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-40"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{totalCount}টির মধ্যে {Math.min((page - 1) * 20 + 1, totalCount)}–{Math.min(page * 20, totalCount)} দেখাচ্ছে</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 py-1 rounded-lg bg-gray-100 font-medium text-gray-800">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedRequest && (
        <DetailModal request={selectedRequest} onClose={() => setSelectedRequest(null)} />
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}