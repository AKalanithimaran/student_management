import { useEffect, useState } from 'react';

const STATUS_OPTIONS = ['Active', 'Pending', 'Blocked'];
const COURSE_OPTIONS = ['Computer Science', 'Business', 'Design', 'Engineering'];

const emptyForm = { name: '', email: '', age: '', status: 'Active', course: '', enrollmentDate: '' };

const StudentForm = ({ isOpen, mode, initialData, onClose, onSubmit, loading }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setForm(initialData || emptyForm);
      setErrors({});
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const validate = () => {
    const nextErrors = {};
    if (!form.name || form.name.trim().length < 2) {
      nextErrors.name = 'Name must be at least 2 characters.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !emailRegex.test(form.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }
    const ageValue = Number(form.age);
    if (!Number.isFinite(ageValue) || ageValue < 1 || ageValue > 120) {
      nextErrors.age = 'Age must be between 1 and 120.';
    }
    if (!form.status || !STATUS_OPTIONS.includes(form.status)) {
      nextErrors.status = 'Select a valid status.';
    }
    if (!form.course || form.course.trim().length < 2) {
      nextErrors.course = 'Course is required.';
    }
    if (!form.enrollmentDate) {
      nextErrors.enrollmentDate = 'Enrollment date is required.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      age: Number(form.age),
      status: form.status,
      course: form.course.trim(),
      enrollmentDate: form.enrollmentDate
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl dark:border-[#334155] dark:bg-[#1E293B]">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text dark:text-slate-100">
            {mode === 'edit' ? 'Edit Student' : 'Add Student'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full border border-border bg-white px-3 py-1 text-sm text-slate-600 hover:bg-slate-50 dark:border-[#334155] dark:bg-[#0F172A] dark:text-slate-200"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="mt-1 w-full rounded-xl border border-border bg-white px-4 py-2 text-sm text-text shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-[#334155] dark:bg-[#0F172A] dark:text-slate-100"
            />
            {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className="mt-1 w-full rounded-xl border border-border bg-white px-4 py-2 text-sm text-text shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-[#334155] dark:bg-[#0F172A] dark:text-slate-100"
            />
            {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Age</label>
            <input
              type="number"
              value={form.age}
              onChange={(event) => setForm({ ...form, age: event.target.value })}
              className="mt-1 w-full rounded-xl border border-border bg-white px-4 py-2 text-sm text-text shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-[#334155] dark:bg-[#0F172A] dark:text-slate-100"
            />
            {errors.age && <p className="mt-1 text-xs text-rose-500">{errors.age}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Status</label>
            <select
              value={form.status}
              onChange={(event) => setForm({ ...form, status: event.target.value })}
              className="mt-1 w-full rounded-xl border border-border bg-white px-4 py-2 text-sm text-text shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-[#334155] dark:bg-[#0F172A] dark:text-slate-100"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {errors.status && <p className="mt-1 text-xs text-rose-500">{errors.status}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Course</label>
            <select
              value={form.course}
              onChange={(event) => setForm({ ...form, course: event.target.value })}
              className="mt-1 w-full rounded-xl border border-border bg-white px-4 py-2 text-sm text-text shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-[#334155] dark:bg-[#0F172A] dark:text-slate-100"
            >
              <option value="">Select course</option>
              {COURSE_OPTIONS.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
            {errors.course && <p className="mt-1 text-xs text-rose-500">{errors.course}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Enrollment Date</label>
            <input
              type="date"
              value={form.enrollmentDate}
              onChange={(event) => setForm({ ...form, enrollmentDate: event.target.value })}
              className="mt-1 w-full rounded-xl border border-border bg-white px-4 py-2 text-sm text-text shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-[#334155] dark:bg-[#0F172A] dark:text-slate-100"
            />
            {errors.enrollmentDate && <p className="mt-1 text-xs text-rose-500">{errors.enrollmentDate}</p>}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-[#334155] dark:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primaryHover disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Saving...' : mode === 'edit' ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
