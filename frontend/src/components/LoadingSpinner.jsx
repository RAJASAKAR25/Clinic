/** Simple centered loading spinner used during API fetch states */
const LoadingSpinner = ({ message = 'Loading…' }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4" role="status" aria-live="polite">
    <div
      className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"
      aria-hidden="true"
    />
    <p className="text-sm text-slate-500 font-medium">{message}</p>
  </div>
);

export default LoadingSpinner;
