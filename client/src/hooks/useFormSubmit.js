import { useState } from 'react';
import toast from 'react-hot-toast';

/**
 * Custom hook that wraps an async API call with loading, success, and error states.
 *
 * @param {Function} submitFn   - Async function that performs the API call
 * @param {Object}   options
 * @param {string}   [options.successMessage]  - Toast message on success
 * @param {Function} [options.onSuccess]        - Callback invoked with response data
 */
const useFormSubmit = (submitFn, options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  /**
   * @param {Object}   data      - Form data to submit
   * @param {Function} [resetFn] - react-hook-form reset(), called on success
   */
  const handleSubmit = async (data, resetFn) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await submitFn(data);
      setIsSuccess(true);

      const msg = response.data?.message || options.successMessage || 'Submitted successfully!';
      toast.success(msg);

      if (resetFn) resetFn();
      if (options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      const errMsg =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        'Something went wrong. Please try again.';

      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  /** Reset success/error state (e.g. when navigating back to try again) */
  const reset = () => {
    setError(null);
    setIsSuccess(false);
  };

  return { isLoading, error, isSuccess, handleSubmit, reset };
};

export default useFormSubmit;
