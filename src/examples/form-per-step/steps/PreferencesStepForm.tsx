import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Stack,
  Typography,
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckIcon from "@mui/icons-material/Check";

// This step has its own schema not derived from the main onboarding schema
// demonstrating that each step can be truly independent
const preferencesSchema = z.object({
  newsletter: z.boolean(),
  notifications: z.boolean(),
  theme: z.enum(["light", "dark", "system"]),
  language: z.string().min(1, "Please select a language"),
});

type PreferencesData = z.infer<typeof preferencesSchema>;

type PreferencesStepFormProps = {
  defaultValues: Partial<PreferencesData>;
  onSubmit: (data: PreferencesData) => Promise<void>;
  onBack: () => void;
  isLoading?: boolean;
};

/**
 * Step 3: Preferences (separate form)
 *
 * This step demonstrates:
 * - Independent schema (not derived from main schema)
 * - Custom form controls (checkboxes, selects)
 * - Final submission in form-per-step pattern
 */
export function PreferencesStepForm({
  defaultValues,
  onSubmit,
  onBack,
  isLoading,
}: PreferencesStepFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PreferencesData>({
    resolver: zodResolver(preferencesSchema),
    mode: "onTouched",
    defaultValues: {
      newsletter: false,
      notifications: true,
      theme: "system",
      language: "",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Typography variant="h6" gutterBottom>
          Set your preferences
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Customize your experience. You can change these later.
        </Typography>

        <FormControl component="fieldset">
          <FormLabel component="legend">Notifications</FormLabel>
          <FormGroup>
            <Controller
              name="newsletter"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  }
                  label="Subscribe to newsletter"
                />
              )}
            />
            <Controller
              name="notifications"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  }
                  label="Enable push notifications"
                />
              )}
            />
          </FormGroup>
        </FormControl>

        <Controller
          name="theme"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Theme</InputLabel>
              <Select {...field} label="Theme">
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="system">System default</MenuItem>
              </Select>
            </FormControl>
          )}
        />

        <Controller
          name="language"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.language}>
              <InputLabel>Language</InputLabel>
              <Select {...field} label="Language">
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
                <MenuItem value="de">German</MenuItem>
                <MenuItem value="pt">Portuguese</MenuItem>
              </Select>
              {errors.language && (
                <FormHelperText>{errors.language.message}</FormHelperText>
              )}
            </FormControl>
          )}
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
            color="success"
            disabled={isLoading}
            endIcon={
              isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <CheckIcon />
              )
            }
          >
            {isLoading ? "Completing..." : "Complete Setup"}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
