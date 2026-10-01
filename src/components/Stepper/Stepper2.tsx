import React, { useState } from "react";
import classNames from "classnames";
import IconCR from "@/components/Icons/IconCR";

type Step = {
  title: string;
  description?: string;
  content?: React.ReactNode;
};

type StepperProps = {
  steps: Step[];
  sinIndex?: boolean;
  sinClickear?: boolean;
  /** Solo se puede volver a pasos anteriores (o al actual) haciendo click, no adelantarse */
  soloAnterioresClickeables?: boolean;
  currentStep?: number;
  orientation?: "horizontal" | "vertical";
  onChangeStep?: (step: number) => void;
};

/**
 * Pasos numerados unidos por una línea: el actual en primary, los completados con check y los
 * pendientes atenuados. Estilos en _Stepper2.scss (respetan el modo claro/nocturno).
 */
export const Stepper2 = ({
  steps,
  currentStep = 0,
  orientation = "vertical",
  sinIndex = false,
  sinClickear,
  soloAnterioresClickeables = false,
  onChangeStep,
}: StepperProps) => {
  const [internalStep, setInternalStep] = useState(currentStep);

  const activeStep = onChangeStep ? currentStep : internalStep;

  const handleStep = (index: number) => {
    if (onChangeStep) {
      onChangeStep(index);
    } else {
      setInternalStep(index);
    }
  };

  return (
    <div className={`stepper2 stepper2--${orientation}`}>
      {steps.map((step, index) => {
        const isActive = index === activeStep;
        const isCompleted = index < activeStep;
        const clickeable = !sinClickear && (!soloAnterioresClickeables || index <= activeStep);

        return (
          <div
            key={index}
            onClick={() => clickeable && handleStep(index)}
            className={classNames("stepper2__paso", {
              "stepper2__paso--activo": isActive,
              "stepper2__paso--completado": isCompleted,
              "stepper2__paso--clickeable": clickeable,
            })}
          >
            {!sinIndex && (
              <span className="stepper2__circulo">
                {isCompleted ? <IconCR name="check" size={12} /> : index + 1}
              </span>
            )}
            <div className="stepper2__texto">
              <div className="stepper2__titulo">{step.title}</div>
              {step.description && <small className="stepper2__descripcion">{step.description}</small>}
            </div>
          </div>
        );
      })}
    </div>
  );
};
