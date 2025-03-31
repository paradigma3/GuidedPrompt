import { X } from "@phosphor-icons/react";
/**
 * @typedef {Object} ModalWrapperProps
 * @property {import("react").ReactComponentElement} children - The DOM/JSX to render
 * @property {boolean} isOpen - Option that renders the modal
 * @property {string} title - The title of the modal
 * @property {function} onClose - Function to close the modal
 * @property {string} className - Additional classes for the modal content
 * @property {boolean} noPortal - (default: false) Used for creating sub-DOM modals that need to be rendered as a child element instead of a modal placed at the root
 * Note: This can impact the bg-overlay presentation due to conflicting DOM positions so if using this property you should
   double check it renders as desired.
 */

/**
 * @param {ModalWrapperProps} props - ModalWrapperProps to pass
 * @returns {import("react").ReactNode}
 */
export default function ModalWrapper({ children, isOpen, title, onClose, className = "" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className={`relative w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border ${className}`}>
        {title && (
          <div className="relative p-6 border-b rounded-t border-theme-modal-border">
            <div className="w-full flex gap-x-2 items-center">
              <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
                {title}
              </h3>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                type="button"
                className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1 inline-flex items-center hover:bg-theme-modal-border hover:border-theme-modal-border hover:border-opacity-50 border-transparent border"
              >
                <X size={24} weight="bold" className="text-white" />
              </button>
            )}
          </div>
        )}
        <div className="px-7 py-6">
          <div className="space-y-6 max-h-[60vh] pr-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
