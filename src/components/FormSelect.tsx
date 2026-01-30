import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  type SelectProps,
} from "@mui/material";
import {
  useFormContext,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";

type Option = {
  value: string | number;
  label: string;
};

type FormSelectProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  options: Option[];
} & Omit<SelectProps, "name">;

/**
 * Reusable Select connected to React Hook Form via useFormContext
 */
export function FormSelect<T extends FieldValues>({
  name,
  label,
  options,
  ...props
}: FormSelectProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth error={!!error}>
          <InputLabel id={`${name}-label`}>{label}</InputLabel>
          <Select
            {...field}
            {...props}
            labelId={`${name}-label`}
            label={label}
            value={field.value ?? ""}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}
