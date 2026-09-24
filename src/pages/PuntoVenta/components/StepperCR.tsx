import React from "react";

export interface StepperItem {
    id: string | number;
    title: string;
    subtitle?: string;

    /**
     * Si quieres colocar un icono en vez del número.
     * Ejemplo:
     * icon: <i className="bi bi-credit-card" />
     */
    icon?: React.ReactNode;

    /**
     * Deshabilita el paso.
     */
    disabled?: boolean;

    /**
     * Permite forzar visualmente un paso como completado.
     * Si no se envía, se calcula según activeStep.
     */
    completed?: boolean;
}

interface StepperCRProps {
    steps: StepperItem[];

    /**
     * Índice del paso activo.
     * Empieza desde 0.
     */
    activeStep: number;

    /**
     * Se ejecuta cuando el usuario hace click en un paso.
     */
    onStepChange?: (
        index: number,
        step: StepperItem
    ) => void;

    /**
     * Permite navegar haciendo click en pasos.
     */
    clickable?: boolean;

    /**
     * Permite hacer click solamente
     * en pasos anteriores al actual.
     */
    onlyPreviousClickable?: boolean;

    /**
     * Tamaño del stepper.
     */
    size?: "sm" | "md" | "lg";

    /**
     * Clases adicionales.
     */
    className?: string;
}

const StepperCR: React.FC<StepperCRProps> = ({
    steps,
    activeStep,
    onStepChange,
    clickable = true,
    onlyPreviousClickable = false,
    size = "md",
    className = "",
}) => {

    const handleStepClick = (
        index: number,
        step: StepperItem
    ) => {

        if (!clickable) return;

        if (step.disabled) return;

        if (
            onlyPreviousClickable &&
            index > activeStep
        ) {
            return;
        }

        onStepChange?.(index, step);
    };

    return (
        <div
            className={`
                stepper-cr
                stepper-cr--${size}
                ${className}
            `}
        >
            {steps.map((step, index) => {

                const isActive = index === activeStep;

                const isCompleted =
                    step.completed ??
                    index < activeStep;

                const isDisabled = !!step.disabled;

                const canClick =
                    clickable &&
                    !isDisabled &&
                    (
                        !onlyPreviousClickable ||
                        index <= activeStep
                    );

                return (
                    <React.Fragment key={step.id}>

                        <button
                            type="button"
                            className={`
                                stepper-cr__step
                                ${isActive ? "is-active" : ""}
                                ${isCompleted ? "is-completed" : ""}
                                ${isDisabled ? "is-disabled" : ""}
                                ${canClick ? "is-clickable" : ""}
                            `}
                            onClick={() =>
                                handleStepClick(index, step)
                            }
                            disabled={isDisabled}
                        >

                            <div className="stepper-cr__circle">
                                {step.icon ?? index + 1}
                            </div>

                            <div className="stepper-cr__content">

                                <span className="stepper-cr__title">
                                    {step.title}
                                </span>

                                {step.subtitle && (
                                    <span className="stepper-cr__subtitle">
                                        {step.subtitle}
                                    </span>
                                )}

                            </div>

                        </button>

                        {index < steps.length - 1 && (
                            <div
                                className={`
                                    stepper-cr__line
                                    ${
                                        index < activeStep
                                            ? "is-completed"
                                            : ""
                                    }
                                `}
                            />
                        )}

                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default StepperCR;