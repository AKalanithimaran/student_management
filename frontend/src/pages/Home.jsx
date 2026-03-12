import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FileDown,
  Filter,
  Search,
  SlidersHorizontal,
  UserCheck,
  UserPlus,
  UserX,
  Users,
  Clock3
} from 'lucide-react';
import StudentTable from '../components/StudentTable.jsx';
import StudentForm from '../components/StudentForm.jsx';
import Pagination from '../components/Pagination.jsx';
import { createStudent, deleteStudent, getStudents, updateStudent } from '../services/api.js';
import socket from '../socket/socket.js';
import { exportStudentsToExcel } from '../utils/exportExcel.js';
import ConfirmModal from '../components/ConfirmModal.jsx';
import Drawer from '../components/Drawer.jsx';
import Skeleton from '../components/Skeleton.jsx';
import StatCard from '../components/StatCard.jsx';
 

const Home = () => {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [ageFilter, setAgeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [enrollmentDate, setEnrollmentDate] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [exportLoading, setExportLoading] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const toInputDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      search,
      ageFilter,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      course: courseFilter !== 'all' ? courseFilter : undefined,
      enrollmentDate: enrollmentDate || undefined
    }),
    [page, limit, search, ageFilter, statusFilter, courseFilter, enrollmentDate]
  );

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getStudents(queryParams);
    setStudents(response.data.data);
    setTotalPages(response.data.pagination?.totalPages || 1);
    setTotalCount(response.data.pagination?.total ?? response.data.data.length);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load students');
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    const refresh = () => fetchStudents();
    socket.on('studentAdded', () => {
      toast.success('Student added');
      refresh();
    });
    socket.on('studentUpdated', () => {
      toast.success('Student updated');
      refresh();
    });
    socket.on('studentDeleted', () => {
      toast.success('Student deleted');
      refresh();
    });

    return () => {
      socket.off('studentAdded');
      socket.off('studentUpdated');
      socket.off('studentDeleted');
    };
  }, [fetchStudents]);

  const filteredStudents = useMemo(() => students, [students]);

  const stats = useMemo(() => {
    const active = filteredStudents.filter((s) => s.status === 'Active').length;
    const pending = filteredStudents.filter((s) => s.status === 'Pending').length;
    const blocked = filteredStudents.filter((s) => s.status === 'Blocked').length;
    return {
      total: totalCount,
      active,
      pending,
      blocked
    };
  }, [filteredStudents, totalCount]);

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (student) => {
    setEditingStudent({
      ...student,
      enrollmentDate: toInputDate(student.enrollmentDate)
    });
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!confirmTarget) return;
    setActionLoading(true);
    setError('');
    try {
      await deleteStudent(confirmTarget._id);
      setConfirmTarget(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete student');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async (payload) => {
    setActionLoading(true);
    setError('');
    try {
      if (editingStudent) {
        await updateStudent(editingStudent._id, payload);
      } else {
        await createStudent(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save student');
    } finally {
      setActionLoading(false);
    }
  };

  const exportCurrent = async (fn) => {
    setExportLoading(true);
    try {
      const response = await getStudents({ page: 1, limit: 0, search, ageFilter });
      fn(response.data.data);
    } catch (err) {
      toast.error('Failed to export current view');
    } finally {
      setExportLoading(false);
    }
  };

  const exportAll = async (fn) => {
    setExportLoading(true);
    try {
      const response = await getStudents({ page: 1, limit: 0 });
      fn(response.data.data);
    } catch (err) {
      toast.error('Failed to export all students');
    } finally {
      setExportLoading(false);
    }
  };

 

  return (
    <div className="flex w-full flex-1 flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-border bg-card/95 p-6 shadow-card backdrop-blur dark:border-[#334155] dark:bg-[#1E293B]">
        <div>
          <p className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            Students Dashboard
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-text dark:text-slate-100">Students Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track enrollment, engagement, and outcomes with real-time updates.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
            Live Metrics
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primaryHover"
          >
            <UserPlus size={16} />
            Add Student
          </button>
          <div className="relative">
            <button
              onClick={() => setShowExportMenu((prev) => !prev)}
              disabled={exportLoading}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-text transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#334155] dark:bg-[#0F172A] dark:text-slate-100"
            >
              <FileDown size={16} />
              Export
            </button>
            {showExportMenu && (
              <div className="absolute right-0 top-11 z-20 w-48 rounded-xl border border-border bg-white p-2 shadow-lg dark:border-[#334155] dark:bg-[#1E293B]">
                <button
                  onClick={() => exportCurrent(exportStudentsToExcel)}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-[#22314a]"
                >
                  Export Excel (current)
                </button>
                <div className="my-2 h-px bg-slate-100 dark:bg-[#22314a]" />
                <button
                  onClick={() => exportAll(exportStudentsToExcel)}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-[#22314a]"
                >
                  Export Excel (all)
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-24" />
          ))
        ) : (
          <>
            <StatCard
              label="Total Students"
              value={stats.total}
              icon={Users}
              accent="bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200"
            />
            <StatCard
              label="Active"
              value={stats.active}
              icon={UserCheck}
              accent="bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200"
            />
            <StatCard
              label="Pending"
              value={stats.pending}
              icon={Clock3}
              accent="bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200"
            />
            <StatCard
              label="Blocked"
              value={stats.blocked}
              icon={UserX}
              accent="bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200"
            />
          </>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-card/95 p-5 shadow-card backdrop-blur dark:border-[#334155] dark:bg-[#1E293B]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full flex-1 lg:max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(event) => {
                setPage(1);
                setSearch(event.target.value);
              }}
              className="w-full rounded-xl border border-border bg-white py-2 pl-9 pr-3 text-sm text-text placeholder:text-slate-400 dark:border-[#334155] dark:bg-[#0F172A] dark:text-slate-100"
            />
          </div>
          <button
            onClick={() => setFiltersOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-text transition hover:border-primary dark:border-[#334155] dark:bg-[#0F172A] dark:text-slate-100"
          >
            <Filter size={16} />
            Filters
          </button>
        </div>
        {filtersOpen && (
          <div className="mt-4 grid gap-3 lg:grid-cols-5">
            <select
              value={ageFilter}
              onChange={(event) => {
                setPage(1);
                setAgeFilter(event.target.value);
              }}
              className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-text dark:border-[#334155] dark:bg-[#0F172A] dark:text-slate-100"
            >
              <option value="all">All Ages</option>
              <option value="0-18">0-18</option>
              <option value="19-25">19-25</option>
              <option value="26-40">26-40</option>
              <option value="40+">40+</option>
            </select>
            <select
              value={statusFilter}
              onChange={(event) => {
                setPage(1);
                setStatusFilter(event.target.value);
              }}
              className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-text dark:border-[#334155] dark:bg-[#0F172A] dark:text-slate-100"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Blocked">Blocked</option>
            </select>
            <select
              value={courseFilter}
              onChange={(event) => {
                setPage(1);
                setCourseFilter(event.target.value);
              }}
              className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-text dark:border-[#334155] dark:bg-[#0F172A] dark:text-slate-100"
            >
              <option value="all">All Courses</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Business">Business</option>
              <option value="Design">Design</option>
              <option value="Engineering">Engineering</option>
            </select>
            <input
              type="date"
              value={enrollmentDate}
              onChange={(event) => {
                setPage(1);
                setEnrollmentDate(event.target.value);
              }}
              className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-text dark:border-[#334155] dark:bg-[#0F172A] dark:text-slate-100"
            />
            <button
              onClick={() => {
                setPage(1);
                setSearch('');
                setAgeFilter('all');
                setStatusFilter('all');
                setCourseFilter('all');
                setEnrollmentDate('');
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm text-slate-600 transition hover:border-primary dark:border-[#334155] dark:text-slate-200"
            >
              <SlidersHorizontal size={16} />
              Reset
            </button>
          </div>
        )}
      </section>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-[#4C1D1D] dark:bg-[#2B1B1B] dark:text-rose-200">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card/95 shadow-card backdrop-blur dark:border-[#334155] dark:bg-[#1E293B]">
        <div className="scroll-area h-[420px] sm:h-[460px] lg:h-[520px] overflow-y-scroll overflow-x-hidden">
          {isLoading ? (
            <div className="p-6">
              <Skeleton className="h-64" />
            </div>
          ) : (
            <StudentTable
              students={filteredStudents}
              onEdit={handleEdit}
              onDelete={(student) => setConfirmTarget(student)}
              onAdd={handleOpenAdd}
              onRowClick={setSelectedStudent}
            />
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border bg-white/70 px-6 py-4 text-sm dark:border-[#334155] dark:bg-[#0F172A]">
          <p className="text-slate-500 dark:text-slate-400">Page {page} of {totalPages}</p>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

 

      <Drawer isOpen={Boolean(selectedStudent)} onClose={() => setSelectedStudent(null)}>
        {selectedStudent && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                {selectedStudent.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-semibold text-text dark:text-slate-100">{selectedStudent.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{selectedStudent.email}</p>
              </div>
            </div>
            <div className="grid gap-3 text-sm text-slate-600 dark:text-slate-300">
              <p><strong>Age:</strong> {selectedStudent.age}</p>
              <p><strong>Status:</strong> {selectedStudent.status}</p>
              <p><strong>Course:</strong> {selectedStudent.course}</p>
              <p><strong>Enrollment:</strong> {toInputDate(selectedStudent.enrollmentDate)}</p>
            </div>
          </div>
        )}
      </Drawer>

      <ConfirmModal
        isOpen={Boolean(confirmTarget)}
        title="Delete student"
        message={`Are you sure you want to delete ${confirmTarget?.name}? This action cannot be undone.`}
        onCancel={() => setConfirmTarget(null)}
        onConfirm={handleDelete}
      />

      <StudentForm
        isOpen={isModalOpen}
        mode={editingStudent ? 'edit' : 'add'}
        initialData={editingStudent}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        loading={actionLoading}
      />

      {actionLoading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/30 text-sm text-white">
          Processing...
        </div>
      )}
    </div>
  );
};

export default Home;
