import { useCallback, useEffect, useRef, useState } from "react";

// ─── Utility Types ─────────────────────────────────────────────────────────────

type Primitive = string | number | boolean | null | undefined;

/** Dot-notation paths for nested objects, e.g. "user.address.city" */
type DotPath<T, Prefix extends string = ""> = T extends Primitive
  ? Prefix
  : T extends Array<infer U>
  ? Prefix | `${Prefix}${Prefix extends "" ? "" : "."}${number}` | DotPath<U, `${Prefix}${Prefix extends "" ? "" : "."}${number}`>
  : {
      [K in keyof T & string]: Prefix extends ""
        ? K | DotPath<T[K], K>
        : `${Prefix}.${K}` | DotPath<T[K], `${Prefix}.${K}`>;
    }[keyof T & string];

/** Value at a dot-notation path */
type PathValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : K extends `${number}`
    ? T extends Array<infer U>
      ? PathValue<U, Rest>
      : never
    : never
  : P extends keyof T
  ? T[P]
  : P extends `${number}`
  ? T extends Array<infer U>
    ? U
    : never
  : never;

type DeepPartial<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : { [K in keyof T]?: DeepPartial<T[K]> };

// ─── Validation ────────────────────────────────────────────────────────────────

type ValidateFn<V = unknown> = (
  value: V,
  formValues: Record<string, unknown>
) => true | string | Promise<true | string>;

export interface RegisterOptions<V = unknown> {
  /** Field is required */
  required?: boolean | string;
  /** Minimum numeric value */
  min?: number | { value: number; message: string };
  /** Maximum numeric value */
  max?: number | { value: number; message: string };
  /** Minimum string/array length */
  minLength?: number | { value: number; message: string };
  /** Maximum string/array length */
  maxLength?: number | { value: number; message: string };
  /** RegExp pattern */
  pattern?: RegExp | { value: RegExp; message: string };
  /** Custom validation fn — return true to pass, a string for the error message */
  validate?: ValidateFn<V> | Record<string, ValidateFn<V>>;
  /** Parse raw string from input before storing */
  setValueAs?: (value: string) => V;
  /** Mark field as disabled — skips validation & excludes from submission */
  disabled?: boolean;
  /** Default value for this field (takes precedence over form-level default) */
  defaultValue?: V;
  /** Called on every value change */
  onChange?: (event: React.ChangeEvent<HTMLElement>) => void;
  /** Called on blur */
  onBlur?: (event: React.FocusEvent<HTMLElement>) => void;
}

export interface FieldError {
  type: string;
  message: string;
}

// ─── Form State ────────────────────────────────────────────────────────────────

export interface FormState<T extends Record<string, unknown>> {
  errors: Partial<Record<DotPath<T>, FieldError>>;
  isSubmitting: boolean;
  isSubmitted: boolean;
  isSubmitSuccessful: boolean;
  isValid: boolean;
  isDirty: boolean;
  isValidating: boolean;
  touchedFields: Partial<Record<DotPath<T>, boolean>>;
  dirtyFields: Partial<Record<DotPath<T>, boolean>>;
  submitCount: number;
}

// ─── Options ───────────────────────────────────────────────────────────────────

export type ValidationMode = "onSubmit" | "onBlur" | "onChange" | "onTouched" | "all";

export interface UseFormOptions<T extends Record<string, unknown>> {
  /** Default values for all fields */
  defaultValues?: DeepPartial<T>;
  /** When to run validation. Default: "onSubmit" */
  mode?: ValidationMode;
  /** When to re-run after first submission. Default: "onChange" */
  reValidateMode?: "onBlur" | "onChange";
  /** Resolver for external validation libs (zod, yup, joi…) */
  resolver?: Resolver<T>;
}

// ─── Resolver (Zod / Yup compatible) ──────────────────────────────────────────

export interface ResolverResult<T extends Record<string, unknown>> {
  values: DeepPartial<T>;
  errors: Partial<Record<DotPath<T>, FieldError>>;
}

export type Resolver<T extends Record<string, unknown>> = (
  values: DeepPartial<T>
) => ResolverResult<T> | Promise<ResolverResult<T>>;

// ─── Return Type ───────────────────────────────────────────────────────────────

export interface UseFormReturn<T extends Record<string, unknown>> {
  /** Register an input field */
  register: <N extends DotPath<T>>(
    name: N,
    options?: RegisterOptions<PathValue<T, N>>
  ) => RegisterReturn;

  /** Handle form submission */
  handleSubmit: (
    onValid: (data: T) => void | Promise<void>,
    onInvalid?: (errors: FormState<T>["errors"]) => void
  ) => (e?: React.FormEvent) => Promise<void>;

  /** Current form state */
  formState: FormState<T>;

  /** Watch one field, an array of fields, or all fields */
  watch: {
    (): DeepPartial<T>;
    <N extends DotPath<T>>(name: N): PathValue<T, N> | undefined;
    <N extends ReadonlyArray<DotPath<T>>>(names: N): { [K in keyof N]: PathValue<T, N[K] & DotPath<T>> | undefined };
  };

  /** Get current values */
  getValues: {
    (): DeepPartial<T>;
    <N extends DotPath<T>>(name: N): PathValue<T, N> | undefined;
  };

  /** Programmatically set a field value */
  setValue: <N extends DotPath<T>>(
    name: N,
    value: PathValue<T, N>,
    options?: { shouldValidate?: boolean; shouldDirty?: boolean; shouldTouch?: boolean }
  ) => void;

  /** Reset the form to default values (or new values) */
  reset: (values?: DeepPartial<T>) => void;

  /** Manually trigger validation */
  trigger: (name?: DotPath<T> | DotPath<T>[]) => Promise<boolean>;

  /** Manually set an error */
  setError: (name: DotPath<T>, error: FieldError) => void;

  /** Clear one, many, or all errors */
  clearErrors: (name?: DotPath<T> | DotPath<T>[]) => void;

  /** Ref to the underlying <form> element */
  formRef: React.RefObject<HTMLFormElement | null>;

  /** Whether every registered field is currently valid */
  isValid: boolean;
}

export interface RegisterReturn {
  name: string;
  ref: (el: HTMLElement | null) => void;
  onChange: (e: React.ChangeEvent<HTMLElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLElement>) => void;
  defaultValue: string;
  disabled?: boolean;
}

// ─── Internal Helpers ──────────────────────────────────────────────────────────

/** Get a nested value using dot notation */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc == null) return undefined;
    return (acc as Record<string, unknown>)[key];
  }, obj);
}

/** Set a nested value using dot notation (mutates a shallow clone) */
function setNestedValue(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): Record<string, unknown> {
  const keys = path.split(".");
  const result = { ...obj };
  let cursor: Record<string, unknown> = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    cursor[key] = Array.isArray(cursor[key])
      ? [...(cursor[key] as unknown[])]
      : { ...(cursor[key] as Record<string, unknown>) };
    cursor = cursor[key] as Record<string, unknown>;
  }

  cursor[keys[keys.length - 1]] = value;
  return result;
}

/** Run all rules for a single field and return the first error (if any) */
async function validateField(
  value: unknown,
  options: RegisterOptions,
  allValues: Record<string, unknown>
): Promise<FieldError | null> {
  const {
    required,
    min,
    max,
    minLength,
    maxLength,
    pattern,
    validate,
    disabled,
  } = options;

  if (disabled) return null;

  const isEmpty =
    value === "" || value === null || value === undefined;

  // required
  if (required) {
    if (isEmpty) {
      return {
        type: "required",
        message: typeof required === "string" ? required : "This field is required",
      };
    }
  }

  if (isEmpty) return null;

  const numVal = Number(value);
  const strVal = String(value);

  // min
  if (min !== undefined) {
    const [minVal, minMsg] =
      typeof min === "object" ? [min.value, min.message] : [min, `Minimum value is ${min}`];
    if (numVal < minVal) return { type: "min", message: minMsg };
  }

  // max
  if (max !== undefined) {
    const [maxVal, maxMsg] =
      typeof max === "object" ? [max.value, max.message] : [max, `Maximum value is ${max}`];
    if (numVal > maxVal) return { type: "max", message: maxMsg };
  }

  // minLength
  if (minLength !== undefined) {
    const [minLenVal, minLenMsg] =
      typeof minLength === "object"
        ? [minLength.value, minLength.message]
        : [minLength, `Minimum length is ${minLength}`];
    if (strVal.length < minLenVal) return { type: "minLength", message: minLenMsg };
  }

  // maxLength
  if (maxLength !== undefined) {
    const [maxLenVal, maxLenMsg] =
      typeof maxLength === "object"
        ? [maxLength.value, maxLength.message]
        : [maxLength, `Maximum length is ${maxLength}`];
    if (strVal.length > maxLenVal) return { type: "maxLength", message: maxLenMsg };
  }

  // pattern
  if (pattern !== undefined) {
    const [patternVal, patternMsg] =
      typeof pattern === "object" && !(pattern instanceof RegExp)
        ? [pattern.value, pattern.message]
        : [pattern as RegExp, "Invalid format"];
    if (!patternVal.test(strVal)) return { type: "pattern", message: patternMsg };
  }

  // validate
  if (validate) {
    if (typeof validate === "function") {
      const result = await validate(value, allValues);
      if (result !== true) {
        return { type: "validate", message: result as string };
      }
    } else {
      for (const [ruleName, fn] of Object.entries(validate)) {
        const result = await fn(value, allValues);
        if (result !== true) {
          return { type: ruleName, message: result as string };
        }
      }
    }
  }

  return null;
}

// ─── useForm ───────────────────────────────────────────────────────────────────

export function useForm<T extends Record<string, unknown>>(
  options: UseFormOptions<T> = {}
): UseFormReturn<T> {
  const {
    defaultValues = {} as DeepPartial<T>,
    mode = "onSubmit",
    reValidateMode = "onChange",
    resolver,
  } = options;

  // ── Internal refs (not reactive, but stable across renders) ──────────────
  const valuesRef = useRef<Record<string, unknown>>(
    defaultValues as Record<string, unknown>
  );
  const defaultValuesRef = useRef<Record<string, unknown>>(
    defaultValues as Record<string, unknown>
  );
  const registeredFields = useRef<Map<string, RegisterOptions>>(new Map());
  const fieldRefs = useRef<Map<string, HTMLElement | null>>(new Map());
  const formRef = useRef<HTMLFormElement | null>(null);
  const isSubmittedRef = useRef(false);

  // ── Reactive state ────────────────────────────────────────────────────────
  const [formState, setFormState] = useState<FormState<T>>({
    errors: {},
    isSubmitting: false,
    isSubmitted: false,
    isSubmitSuccessful: false,
    isValid: true,
    isDirty: false,
    isValidating: false,
    touchedFields: {},
    dirtyFields: {},
    submitCount: 0,
  });

  // Snapshot of values used by watch()
  const [watchSnapshot, setWatchSnapshot] = useState<Record<string, unknown>>(
    defaultValues as Record<string, unknown>
  );

  // ── Helpers ────────────────────────────────────────────────────────────────

  const updateFormState = useCallback(
    (patch: Partial<FormState<T>>) => {
      setFormState((prev) => ({ ...prev, ...patch }));
    },
    []
  );

  const getInputValue = useCallback(
    (el: HTMLElement, opts: RegisterOptions): unknown => {
      const input = el as HTMLInputElement;
      // Si no es un elemento DOM real (ej: evento sintético de react-select)
      if (!(el instanceof HTMLElement)) {
        const synthetic = el as unknown as { value: unknown; type?: string };
        if (synthetic.type === "number") return Number(synthetic.value);
        return synthetic.value;
      }
      if (input.type === "checkbox") return input.checked;
      if (input.type === "number") return input.value === "" ? "" : Number(input.value);
      if (input.type === "radio") return input.checked ? input.value : undefined;
      if (opts.setValueAs) return opts.setValueAs(input.value);
      return input.value;
    },
    []
  );

  const computeIsDirty = useCallback(
    (values: Record<string, unknown>): boolean => {
      const defaults = defaultValuesRef.current;
      for (const [name] of registeredFields.current) {
        const current = getNestedValue(values, name);
        const original = getNestedValue(defaults, name);
        if (current !== original) return true;
      }
      return false;
    },
    []
  );

  // ── Validation ─────────────────────────────────────────────────────────────

  const validateAll = useCallback(
    async (
      values: Record<string, unknown>
    ): Promise<Partial<Record<string, FieldError>>> => {
      if (resolver) {
        const result = await resolver(values as DeepPartial<T>);
        return result.errors as Partial<Record<string, FieldError>>;
      }

      const errors: Partial<Record<string, FieldError>> = {};

      await Promise.all(
        [...registeredFields.current.entries()].map(async ([name, opts]) => {
          const value = getNestedValue(values, name);
          const error = await validateField(value, opts, values);
          if (error) errors[name] = error;
        })
      );

      return errors;
    },
    [resolver]
  );

  const validateSingleField = useCallback(
    async (name: string): Promise<FieldError | null> => {
      const opts = registeredFields.current.get(name);
      if (!opts) return null;

      if (resolver) {
        const result = await resolver(valuesRef.current as DeepPartial<T>);
        return (result.errors as Record<string, FieldError>)[name] ?? null;
      }

      const value = getNestedValue(valuesRef.current, name);
      return validateField(value, opts, valuesRef.current);
    },
    [resolver]
  );

  // ── Register ───────────────────────────────────────────────────────────────

  const register = useCallback(
    <N extends DotPath<T>>(
      name: N,
      opts: RegisterOptions<PathValue<T, N>> = {}
    ): RegisterReturn => {
      // Merge field-level defaultValue into valuesRef on first register
      if (opts.defaultValue !== undefined && getNestedValue(valuesRef.current, name as string) === undefined) {
        valuesRef.current = setNestedValue(valuesRef.current, name as string, opts.defaultValue);
        defaultValuesRef.current = setNestedValue(defaultValuesRef.current, name as string, opts.defaultValue);
        setWatchSnapshot({ ...valuesRef.current });
      }
      registeredFields.current.set(name as string, opts as RegisterOptions);
      const ref = (el: HTMLElement | null) => {
        fieldRefs.current.set(name as string, el);

        if (el) {
          // Pre-populate existing DOM element with the current stored value
          const stored = getNestedValue(valuesRef.current, name as string);
          const input = el as HTMLInputElement;

          if (input.type === "checkbox") {
            input.checked = Boolean(stored);
          } else if (stored !== undefined && stored !== null) {
            input.value = String(stored);
          }
        }
      };

      const onChange = async (e: React.ChangeEvent<HTMLElement>) => {
        const value = getInputValue(e.currentTarget, opts as RegisterOptions);
        valuesRef.current = setNestedValue(valuesRef.current, name as string, value);

        const isDirty = computeIsDirty(valuesRef.current);
        const dirtyFields = {
          ...formState.dirtyFields,
          [name]: getNestedValue(valuesRef.current, name as string) !== getNestedValue(defaultValuesRef.current, name as string),
        };
        // Trigger validation depending on mode
        const shouldValidate =
          mode === "onChange" ||
          mode === "all" ||
          (isSubmittedRef.current && reValidateMode === "onChange");

        let newErrors = formState.errors;

        if (shouldValidate) {
          const error = await validateSingleField(name as string);
          const updated = { ...formState.errors };
          if (error) {
            updated[name as keyof typeof updated] = error;
          } else {
            delete updated[name as keyof typeof updated];
          }
          newErrors = updated;
        }

        setWatchSnapshot({ ...valuesRef.current });
        updateFormState({
          isDirty,
          dirtyFields: dirtyFields as FormState<T>["dirtyFields"],
          errors: newErrors,
          isValid: Object.keys(newErrors).length === 0,
        });

        opts.onChange?.(e);
      };

      const onBlur = async (e: React.FocusEvent<HTMLElement>) => {
        const shouldValidate =
          mode === "onBlur" ||
          mode === "onTouched" ||
          mode === "all" ||
          (isSubmittedRef.current && reValidateMode === "onBlur");

        const touchedFields = { ...formState.touchedFields, [name]: true };

        let newErrors = formState.errors;

        if (shouldValidate) {
          const error = await validateSingleField(name as string);
          const updated = { ...formState.errors };
          if (error) {
            updated[name as keyof typeof updated] = error;
          } else {
            delete updated[name as keyof typeof updated];
          }
          newErrors = updated;
        }

        updateFormState({
          touchedFields: touchedFields as FormState<T>["touchedFields"],
          errors: newErrors,
          isValid: Object.keys(newErrors).length === 0,
        });

        opts.onBlur?.(e);
      };

      return {
        name: name as string,
          defaultValue: (getNestedValue(valuesRef.current, name as string) as string) ?? "",
        ref,
        onChange,
        onBlur,
        ...(opts.disabled !== undefined && { disabled: opts.disabled }),
      };
    },
     
    [computeIsDirty, getInputValue, validateSingleField, updateFormState, mode, reValidateMode]
  );

  // ── handleSubmit ───────────────────────────────────────────────────────────

  const handleSubmit = useCallback(
    (
      onValid: (data: T) => void | Promise<void>,
      onInvalid?: (errors: FormState<T>["errors"]) => void
    ) =>
      async (e?: React.FormEvent) => {
        e?.preventDefault();

        updateFormState({ isSubmitting: true, isValidating: true });

        const errors = await validateAll(valuesRef.current);
        const isValid = Object.keys(errors).length === 0;

        isSubmittedRef.current = true;
        updateFormState({
          isValidating: false,
          errors: errors as FormState<T>["errors"],
          isValid,
          submitCount: formState.submitCount + 1,
          isSubmitted: true,
        });

        try {
          if (isValid) {
            await onValid(valuesRef.current as T);
            updateFormState({ isSubmitSuccessful: true, isSubmitting: false });
          } else {
            onInvalid?.(errors as FormState<T>["errors"]);
            updateFormState({ isSubmitSuccessful: false, isSubmitting: false });
          }
        } catch {
          updateFormState({ isSubmitSuccessful: false, isSubmitting: false });
        }
      },
    [formState.submitCount, validateAll, updateFormState]
  );

  // ── watch ──────────────────────────────────────────────────────────────────

  const watch = useCallback(
    (...args: unknown[]) => {
      if (args.length === 0) return watchSnapshot as DeepPartial<T>;

      const [nameOrNames] = args;
      if (Array.isArray(nameOrNames)) {
        return nameOrNames.map((n) => getNestedValue(watchSnapshot, n));
      }
      return getNestedValue(watchSnapshot, nameOrNames as string);
    },
    [watchSnapshot]
  ) as UseFormReturn<T>["watch"];

  // ── getValues ──────────────────────────────────────────────────────────────

  const getValues = useCallback(
    (...args: unknown[]) => {
      if (args.length === 0) return valuesRef.current as DeepPartial<T>;
      return getNestedValue(valuesRef.current, args[0] as string);
    },
    []
  ) as UseFormReturn<T>["getValues"];

  // ── setValue ───────────────────────────────────────────────────────────────

  const setValue = useCallback(
    <N extends DotPath<T>>(
      name: N,
      value: PathValue<T, N>,
      opts: { shouldValidate?: boolean; shouldDirty?: boolean; shouldTouch?: boolean } = {}
    ) => {
      valuesRef.current = setNestedValue(valuesRef.current, name as string, value);

      // Sync DOM
      const el = fieldRefs.current.get(name as string) as HTMLInputElement | null;
      if (el) {
        if (el.type === "checkbox") el.checked = Boolean(value);
        else el.value = String(value ?? "");
      }

      const patch: Partial<FormState<T>> = {};

      if (opts.shouldDirty !== false) {
        patch.isDirty = computeIsDirty(valuesRef.current);
        patch.dirtyFields = {
          ...formState.dirtyFields,
          [name]: value !== getNestedValue(defaultValuesRef.current, name as string),
        } as FormState<T>["dirtyFields"];
      }

      if (opts.shouldTouch) {
        patch.touchedFields = {
          ...formState.touchedFields,
          [name]: true,
        } as FormState<T>["touchedFields"];
      }

      setWatchSnapshot({ ...valuesRef.current });

      if (opts.shouldValidate) {
        validateSingleField(name as string).then((error) => {
          const updated = { ...formState.errors };
          if (error) updated[name as keyof typeof updated] = error;
          else delete updated[name as keyof typeof updated];
          updateFormState({ ...patch, errors: updated, isValid: Object.keys(updated).length === 0 });
        });
      } else {
        updateFormState(patch);
      }
    },
    [formState, computeIsDirty, validateSingleField, updateFormState]
  );

  // ── reset ──────────────────────────────────────────────────────────────────

  const reset = useCallback(
    (values?: DeepPartial<T>) => {
      const next = (values ?? defaultValuesRef.current) as Record<string, unknown>;
      valuesRef.current = next;
      if (values) defaultValuesRef.current = next;

      // Sync all DOM elements
      for (const [name, el] of fieldRefs.current) {
        if (!el) continue;
        const input = el as HTMLInputElement;
        const val = getNestedValue(next, name);
        if (input.type === "checkbox") input.checked = Boolean(val);
        else input.value = String(val ?? "");
      }

      isSubmittedRef.current = false;
      setWatchSnapshot({ ...next });
      setFormState({
        errors: {},
        isSubmitting: false,
        isSubmitted: false,
        isSubmitSuccessful: false,
        isValid: true,
        isDirty: false,
        isValidating: false,
        touchedFields: {},
        dirtyFields: {},
        submitCount: 0,
      });
    },
    []
  );

  // ── trigger ────────────────────────────────────────────────────────────────

  const trigger = useCallback(
    async (name?: DotPath<T> | DotPath<T>[]): Promise<boolean> => {
      updateFormState({ isValidating: true });

      let errors: Partial<Record<string, FieldError>>;

      if (!name) {
        errors = await validateAll(valuesRef.current);
      } else {
        const names = (Array.isArray(name) ? name : [name]) as string[];
        errors = { ...formState.errors as Record<string, FieldError> };

        await Promise.all(
          names.map(async (n) => {
            const error = await validateSingleField(n);
            if (error) errors[n] = error;
            else delete errors[n];
          })
        );
      }

      const isValid = Object.keys(errors).length === 0;
      updateFormState({
        isValidating: false,
        errors: errors as FormState<T>["errors"],
        isValid,
      });

      return isValid;
    },
    [formState.errors, validateAll, validateSingleField, updateFormState]
  );

  // ── setError / clearErrors ─────────────────────────────────────────────────

  const setError = useCallback(
    (name: DotPath<T>, error: FieldError) => {
      const updated = { ...formState.errors, [name]: error };
      updateFormState({ errors: updated, isValid: false });
    },
    [formState.errors, updateFormState]
  );

  const clearErrors = useCallback(
    (name?: DotPath<T> | DotPath<T>[]) => {
      if (!name) {
        updateFormState({ errors: {}, isValid: true });
        return;
      }
      const names = (Array.isArray(name) ? name : [name]) as string[];
      const updated = { ...formState.errors };
      names.forEach((n) => delete updated[n as keyof typeof updated]);
      updateFormState({ errors: updated, isValid: Object.keys(updated).length === 0 });
    },
    [formState.errors, updateFormState]
  );

  // ── Unregister on unmount (optional cleanup) ───────────────────────────────

  useEffect(() => {
    return () => {
      registeredFields.current.clear();
      fieldRefs.current.clear();
    };
  }, []);

  // ── Return ─────────────────────────────────────────────────────────────────

  return {
    register,
    handleSubmit,
    formState,
    watch,
    getValues,
    setValue,
    reset,
    trigger,
    setError,
    clearErrors,
    formRef,
    isValid: Object.keys(formState.errors).length === 0,
  };
}