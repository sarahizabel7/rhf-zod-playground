import { Stack, Typography } from "@mui/material";
import { FormTextField, FormSelect } from "../../../components";
import type { OnboardingData } from "../../../schemas/onboarding.schema";

const teamSizeOptions = [
  { value: 1, label: "Just me" },
  { value: 5, label: "2-5 people" },
  { value: 20, label: "6-20 people" },
  { value: 50, label: "21-50 people" },
  { value: 100, label: "51-100 people" },
  { value: 500, label: "100+ people" },
];

const roleOptions = [
  { value: "founder", label: "Founder / CEO" },
  { value: "executive", label: "Executive" },
  { value: "manager", label: "Manager" },
  { value: "developer", label: "Developer" },
  { value: "designer", label: "Designer" },
  { value: "other", label: "Other" },
];

/**
 * Step 4: Company information (conditional step for business accounts)
 */
export function CompanyStep() {
  return (
    <Stack spacing={3}>
      <Typography variant="h6" gutterBottom>
        Tell us about your company
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        This helps us tailor the experience for your team.
      </Typography>

      <FormTextField<OnboardingData>
        name="companyName"
        label="Company Name"
        autoComplete="organization"
      />

      <FormSelect<OnboardingData>
        name="teamSize"
        label="Team Size"
        options={teamSizeOptions}
      />

      <FormSelect<OnboardingData>
        name="role"
        label="Your Role"
        options={roleOptions}
      />
    </Stack>
  );
}
