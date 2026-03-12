const Drawer = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
      <button aria-label="Close" className="flex-1" onClick={onClose} />
      <div className="h-full w-full max-w-md border-l border-border bg-card p-6 shadow-2xl dark:border-[#334155] dark:bg-[#1E293B]">
        {children}
      </div>
    </div>
  );
};

export default Drawer;
