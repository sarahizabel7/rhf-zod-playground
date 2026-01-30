import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Stack,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  profileStepSchema,
  type ProfileStepData,
} from "../../../schemas/onboarding.schema";

type ProfileStepFormProps = {
  defaultValues: Partial<ProfileStepData>;
  onSubmit: (data: ProfileStepData) => Promise<void>;
  onBack: () => void;
  isLoading?: boolean;
};

/**
 * Step 2: Profile information (separate form)
 */
export function ProfileStepForm({
  defaultValues,
  onSubmit,
  onBack,
  isLoading,
}: ProfileStepFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileStepData>({
    resolver: zodResolver(profileStepSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Typography variant="h6" gutterBottom>
          Tell us about yourself
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          This information will be used for your profile.
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            {...register("firstName")}
            label="First Name"
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            autoComplete="given-name"
            fullWidth
          />
          <TextField
            {...register("lastName")}
            label="Last Name"
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            autoComplete="family-name"
            fullWidth
          />
        </Stack>

        <TextField
          {...register("phone")}
          label="Phone Number"
          type="tel"
          error={!!errors.phone}
          helperText={errors.phone?.message}
          autoComplete="tel"
          placeholder="+1234567890"
        />

        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            disabled={isLoading}
          >
            Back
          </Button>
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
          >
            {isLoading ? "Saving..." : "Save & Continue"}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
