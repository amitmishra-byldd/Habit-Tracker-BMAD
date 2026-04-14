import { useUIStore } from "../store/uiStore";

export default function Toast() {
  const {
    showErrorToast,
    errorMessage,
    showSuccessToast,
    successMessage,
    hideError,
    hideSuccess,
  } = useUIStore();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {showErrorToast && (
        <div className="bg-red-600 text-white px-4 py-2 rounded shadow flex items-center gap-2 animate-fade-in">
          <span>{errorMessage}</span>
          <button onClick={hideError} className="ml-2 text-white">
            &times;
          </button>
        </div>
      )}
      {showSuccessToast && (
        <div className="bg-green-600 text-white px-4 py-2 rounded shadow flex items-center gap-2 animate-fade-in">
          <span>{successMessage}</span>
          <button onClick={hideSuccess} className="ml-2 text-white">
            &times;
          </button>
        </div>
      )}
    </div>
  );
}
