const ConfirmModal = ({ isOpen, title, message, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl dark:border-[#334155] dark:bg-[#1E293B]">
        <h3 className="text-lg font-semibold text-text dark:text-slate-100">{title}</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
