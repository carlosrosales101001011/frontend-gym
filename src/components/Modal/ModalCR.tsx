import React, {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import {
  useModalStore,
  type ModalPosition,
  type ModalSize,
} from "@/components/Modal/useModalStore";
import styles from "@/assets/scss/custom/components/modal.module.scss";

// ---------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------

export interface ModalCRProps {
  /** Id único del modal. Si no se pasa, se autogenera. Útil si quieres
   * controlar el modal desde otro componente vía useModalStore. */
  id?: string;
  /** Controla visibilidad de forma controlada (modo controlado). */
  show?: boolean;
  /** Tamaño del modal. */
  size?: ModalSize;
  /** Posición en pantalla. */
  position?: ModalPosition;
  /** Se ejecuta justo cuando el modal pasa a visible. */
  onShow?: () => void;
  /** Se ejecuta justo cuando el modal se oculta (incluye click en backdrop, ESC o botón cerrar). */
  onHide?: () => void;
  /** Cierra al hacer click fuera del contenido. Default: true. */
  closeOnBackdrop?: boolean;
  /** Cierra al presionar ESC. Default: true. */
  closeOnEsc?: boolean;
  /** Muestra el botón "x" en el header automáticamente generado si usas Title sin Header propio. */
  showCloseButton?: boolean;
  /** Clase adicional para el contenedor del modal. */
  className?: string;
  /** Elemento HTML al que se hace el portal. Default: document.body. */
  container?: HTMLElement;
  children: React.ReactNode;
}

interface ModalContextValue {
  close: () => void;
  id: string;
}

const ModalContext = createContext<ModalContextValue | null>(null);

const useModalContext = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error(
      "ModalCR.* debe usarse dentro de <ModalCR>...</ModalCR>"
    );
  }
  return ctx;
};

// ---------------------------------------------------------------
// Subcomponentes
// ---------------------------------------------------------------

const Header: React.FC<{
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}> = ({ children, className, showCloseButton = true }) => {
  const { close } = useModalContext();
  return (
    <div className={`modalcr-header  d-flex align-items-center p-2 ${className ?? ""}`}>
      {showCloseButton && (
        <button
          type="button"
          aria-label="Cerrar"
          className={styles["modalcr-close"]}
          onClick={close}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      <div className="flex-grow-1" style={{fontSize: '15px', minWidth: 0}}>{children}</div>
    </div>
  );
};

const Title: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const { id } = useModalContext();
  return (
    <h2 id={`${id}-title`} className={`${styles["modalcr-title"]} ${className ?? ""} modal-mode-actual`}>
      {children}
    </h2>
  );
};

const Body: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={`${styles["modalcr-body"]} ${className ?? ""}`}>
      {children}
    </div>
  );
};

const Footer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={`${styles["modalcr-footer"]} ${className ?? ""}`}>
      {children}
    </div>
  );
};

// ---------------------------------------------------------------
// Componente raíz
// ---------------------------------------------------------------

const ModalCRBase: React.FC<ModalCRProps> = ({
  id,
  show,
  size = "md",
  position = "top",
  onShow,
  onHide,
  closeOnBackdrop = true,
  closeOnEsc = true,
  className,
  container,
  children,
}) => {
  const autoId = useId();
  const modalId = id ?? autoId;
  const dialogRef = useRef<HTMLDivElement>(null);

  const registerModal = useModalStore((s) => s.registerModal);
  const updateModal = useModalStore((s) => s.updateModal);
  const unregisterModal = useModalStore((s) => s.unregisterModal);
  const closeModal = useModalStore((s) => s.closeModal);
  const storeShow = useModalStore((s) => s.modals[modalId]?.show ?? false);

  const isControlled = typeof show === "boolean";
  const isVisible = isControlled ? show : storeShow;

  // registrar / sincronizar en el store (sirve también para que otros
  // componentes puedan abrir/cerrar este modal por id)
  useEffect(() => {
    registerModal({
      id: modalId,
      show: isControlled ? !!show : false,
      size,
      position,
      closeOnBackdrop,
      closeOnEsc,
      onShow,
      onHide,
    });
    return () => unregisterModal(modalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalId]);

  useEffect(() => {
    updateModal(modalId, { size, position, closeOnBackdrop, closeOnEsc, onShow, onHide });
  }, [modalId, size, position, closeOnBackdrop, closeOnEsc, onShow, onHide, updateModal]);

  // sincroniza estado controlado -> store, y dispara callbacks
  const prevVisible = useRef(isVisible);
  useEffect(() => {
    if (isControlled) {
      updateModal(modalId, { show: !!show });
    }
    if (prevVisible.current !== isVisible) {
      // isVisible ? onShow?.() : onHide?.();
      prevVisible.current = isVisible;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  const handleClose = () => {
    closeModal(modalId);
    if (isControlled) {
      onHide?.();
    }
  };

  // ESC para cerrar
  useEffect(() => {
    if (!isVisible || !closeOnEsc) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, closeOnEsc]);

  // bloquear scroll del body mientras está abierto
  useEffect(() => {
    if (!isVisible) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isVisible]);

  // foco inicial en el contenedor del modal
  useEffect(() => {
    if (isVisible) dialogRef.current?.focus();
  }, [isVisible]);

  if (!isVisible) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnBackdrop) {
      handleClose();
    }
  };

  const content = (
    <div
      className={`${styles["modalcr-backdrop"]} ${styles[`modalcr-backdrop--${position}`]}`}
      onMouseDown={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${modalId}-title`}
        tabIndex={-1}
        className={[
          styles.modalcr,
          styles[`modalcr--${size}`],
          styles[`modalcr--anim-${position}`],
          className,
          'modal-mode-actual'
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span className={styles["modalcr-accent"]} />
        <ModalContext.Provider value={{ close: handleClose, id: modalId }}>
          {children}
        </ModalContext.Provider>
      </div>
    </div>
  );

  return createPortal(content, container ?? document.body);
};

// ---------------------------------------------------------------
// Export compuesto: ModalCR.Header / .Title / .Body / .Footer
// ---------------------------------------------------------------

type ModalCRComponent = React.FC<ModalCRProps> & {
  Header: typeof Header;
  Title: typeof Title;
  Body: typeof Body;
  Footer: typeof Footer;
};

const ModalCR = ModalCRBase as ModalCRComponent;
ModalCR.Header = Header;
ModalCR.Title = Title;
ModalCR.Body = Body;
ModalCR.Footer = Footer;

export default ModalCR;