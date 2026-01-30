import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Stack,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  accountStepSchema,
  type AccountStepData,
} from "../../../schemas/onboarding.schema";

type AccountStepFormProps = {
  defaultValues: Partial<AccountStepData>;
  onSubmit: (data: AccountStepData) => Promise<void>;
  isLoading?: boolean;
};

/**
 * Step 1: Account credentials (separate form)
 *
 * Each step is its own form with:
 * - Its own useForm instance
 * - Its own zodResolver for validation
 * - Immediate submission/save on "Next"
 */
export function AccountStepForm({
  defaultValues,
  onSubmit,
  isLoading,
}: AccountStepFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountStepData>({
    resolver: zodResolver(accountStepSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Typography variant="h6" gutterBottom>
          Create your account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Enter your email and create a secure password.
        </Typography>

        <TextField
          {...register("email")}
          label="Email"
          type="email"
          error={!!errors.email}
          helperText={errors.email?.message}
          autoComplete="email"
        />

        <TextField
          {...register("password")}
          label="Password"
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message}
          autoComplete="new-password"
        />

        <TextField
          {...register("confirmPassword")}
          label="Confirm Password"
          type="password"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          autoComplete="new-password"
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          endIcon={
            isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <ArrowForwardIcon />
            )
          }
          sx={{ alignSelf: "flex-end" }}
        >
          {isLoading ? "Saving..." : "Save & Continue"}
        </Button>
      </Stack>
    </form>
  );
}
