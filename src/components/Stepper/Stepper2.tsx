import React, { useState } from "react";
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
  bgColor?: string;
  currentStep?: number;
  orientation?: "horizontal" | "vertical";
  onChangeStep?: (step: number) => void;
};

export const Stepper2 = ({
  steps,
  currentStep = 0,
  bgColor = "bg-primary",
  orientation = "vertical",
  sinIndex=false,
  sinClickear,
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
    <div
      className={`d-flex ${
        orientation === "vertical" ? "d-flex flex-column" : "d-flex flex-row justify-content-between"
      }`}
    >
      {steps.map((step, index) => {
        const isActive = index === activeStep;
        const isCompleted = index < activeStep;

        return (
          <div
            key={index}
            onClick={() => !sinClickear && handleStep(index)}
            style={{cursor: sinClickear ? 'default' : 'pointer'}}
            className={`d-flex ${isActive ? bgColor : ""} p-2  ${
              orientation === "vertical"
                ? "d-flex align-items-start gap-3"
                : "d-flex flex-column align-items-center flex-fill"
            }`}
          >
            {/* STEP */}
            <div
              className={`d-flex ${
                orientation === "vertical"
                  ? "flex-column align-items-center"
                  : "flex-row align-items-center w-full"
              }`}
            >
              {/* CIRCLE */}
              {
                !sinIndex && (
                  <button
                    className=
                    {`
                      fw-bold d-flex
                      ${
                        isCompleted
                          ? "btn-success"
                          : isActive
                          ? "btn-primary"
                          : "btn-outline-secondary"
                      }
                    `}
                    style={{
                      width: 25,
                      height: 25,
                      fontSize: 14
                    }}
                  >
                    {isCompleted ? <IconCR name="check"/> : index + 1}
                  </button>

                )
              }
            </div>

            {/* CONTENT */}
            <div
              className={
                orientation === "vertical"
                  ? ""
                  : "text-center mt-3"
              }
            >
              <span
                className={
                  isActive ? "text-white mb-1" : "mb-1"
                }
                style={{fontSize: '16px'}}
              >
                {step.title}
              </span>

              {step.description && (
                <small className={` d-block ${isActive ? "text-white" : ""}`}>
                  {step.description}
                </small>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};