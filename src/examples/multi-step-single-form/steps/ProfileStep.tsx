import { Stack, Typography } from "@mui/material";
import { FormTextField } from "../../../components";
import type { OnboardingData } from "../../../schemas/onboarding.schema";

/**
 * Step 2: Profile information
 */
export function ProfileStep() {
  return (
    <Stack spacing={3}>
      <Typography variant="h6" gutterBottom>
        Tell us about yourself
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        This information will be used for your profile.
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <FormTextField<OnboardingData>
          name="firstName"
          label="First Name"
          autoComplete="given-name"
        />
        <FormTextField<OnboardingData>
          name="lastName"
          label="Last Name"
          autoComplete="family-name"
        />
      </Stack>

      <FormTextField<OnboardingData>
        name="phone"
        label="Phone Number"
        type="tel"
        autoComplete="tel"
        placeholder="+1234567890"
      />
    </Stack>
  );
}
