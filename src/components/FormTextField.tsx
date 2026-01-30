import { TextField, type TextFieldProps } from "@mui/material";
import {
  useFormContext,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";

type FormTextFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
} & Omit<TextFieldProps, "name">;

/**
 * Reusable TextField connected to React Hook Form via useFormContext
 */
export function FormTextField<T extends FieldValues>({
  name,
  label,
  ...props
}: FormTextFieldProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...props}
          label={label}
          error={!!error}
          helperText={error?.message}
          value={field.value ?? ""}
        />
      )}
    />
  );
}
