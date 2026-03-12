import { MoreHorizontal, UserRoundPlus } from 'lucide-react';
import { useState } from 'react';
import Badge from './Badge.jsx';

const StudentTable = ({ students, onEdit, onDelete, onAdd, onRowClick }) => {
  const [menuOpen, setMenuOpen] = useState(null);
  const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toISOString().split('T')[0];
  };

  if (!students.length) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-slate-500 shadow-card dark:border-[#334155] dark:bg-[#1E293B]">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <UserRoundPlus size={22} />
        </div>
        <p className="text-base font-semibold text-text dark:text-slate-100">No students yet</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Add your first student to get started.</p>
        {onAdd && (
          <button
            onClick={onAdd}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primaryHover"
          >
            Add Student
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card dark:border-[#334155] dark:bg-[#1E293B]">
      <table className="w-full text-left text-sm">
        <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 shadow-sm dark:bg-[#0F172A] dark:text-slate-300">
          <tr>
            <th className="px-5 py-4">Student</th>
            <th className="px-5 py-4">Age</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Course</th>
            <th className="px-5 py-4">Enrolled</th>
            <th className="px-5 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr
              key={student._id}
              className="cursor-pointer border-t border-slate-100 transition hover:bg-slate-50 dark:border-[#22314a] dark:hover:bg-[#0F172A]"
              onClick={() => onRowClick?.(student)}
            >
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {student.name?.charAt(0)?.toUpperCase() || 'S'}
                  </div>
                  <div>
                    <p className="font-semibold text-text dark:text-slate-100">{student.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{student.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{student.age}</td>
              <td className="px-5 py-4">
                <Badge variant={student.status?.toLowerCase()}>{student.status}</Badge>
              </td>
              <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{student.course}</td>
              <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                {formatDate(student.enrollmentDate)}
              </td>
              <td className="px-5 py-4 text-right">
                <div className="relative inline-flex" onClick={(event) => event.stopPropagation()}>
                  <button
                    onClick={() => setMenuOpen(menuOpen === student._id ? null : student._id)}
                    className="inline-flex items-center justify-center rounded-full border border-border bg-white p-2 text-slate-500 hover:text-primary dark:border-[#334155] dark:bg-[#0F172A] dark:text-slate-300"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                  {menuOpen === student._id && (
                    <div className="absolute right-0 top-10 z-10 w-32 rounded-xl border border-border bg-white p-1 shadow-lg dark:border-[#334155] dark:bg-[#1E293B]">
                      <button
                        onClick={() => {
                          setMenuOpen(null);
                          onEdit(student);
                        }}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-[#22314a]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setMenuOpen(null);
                          onDelete(student);
                        }}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm text-danger hover:bg-rose-50 dark:hover:bg-[#2B1B1B]"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
