import { Stack, Typography } from "@mui/material";
import { FormTextField } from "../../../components";
import type { OnboardingData } from "../../../schemas/onboarding.schema";

/**
 * Step 1: Account credentials
 * Uses useFormContext via FormTextField to access the shared form state
 */
export function AccountStep() {
  return (
    <Stack spacing={3}>
      <Typography variant="h6" gutterBottom>
        Create your account
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Enter your email and create a secure password.
      </Typography>

      <FormTextField<OnboardingData>
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
      />

      <FormTextField<OnboardingData>
        name="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
      />

      <FormTextField<OnboardingData>
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        autoComplete="new-password"
        placeholder="Re-enter your password"
      />
    </Stack>
  );
}
