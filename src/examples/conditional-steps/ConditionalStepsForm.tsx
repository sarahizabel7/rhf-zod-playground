import { useState, useMemo, useCallback } from "react";
import { useForm, FormProvider, useFormContext, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Box,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
  TextField,
  Button,
  Alert,
  Chip,
  CircularProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckIcon from "@mui/icons-material/Check";

import { StepperProgress } from "../../components";
import { submitOnboarding } from "../../mock/api";

/**
 * Schema with conditional validation using superRefine
 */
const eventRegistrationSchema = z
  .object({
    // Step 1: Basic Info
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email"),

    // Step 2: Attendance Type
    attendanceType: z.enum(["in-person", "virtual", "hybrid"]),

    // Step 3: In-person details (conditional)
    dietaryRestrictions: z.string().optional(),
    tshirtSize: z.enum(["xs", "s", "m", "l", "xl", "xxl"]).optional(),

    // Step 4: Virtual details (conditional)
    timezone: z.string().optional(),
    platformPreference: z.enum(["zoom", "meet", "teams"]).optional(),

    // Step 5: Additional info (always shown)
    howDidYouHear: z.string().min(1, "Please tell us how you heard about us"),
  })
  .superRefine((data, ctx) => {
    // Conditional validation based on attendance type
    if (data.attendanceType === "in-person" || data.attendanceType === "hybrid") {
      if (!data.dietaryRestrictions) {
        ctx.addIssue({
          path: ["dietaryRestrictions"],
          message: "Please specify dietary restrictions (or 'None')",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.tshirtSize) {
        ctx.addIssue({
          path: ["tshirtSize"],
          message: "T-shirt size is required for in-person attendees",
          code: z.ZodIssueCode.custom,
        });
      }
    }

    if (data.attendanceType === "virtual" || data.attendanceType === "hybrid") {
      if (!data.timezone) {
        ctx.addIssue({
          path: ["timezone"],
          message: "Timezone is required for virtual attendance",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.platformPreference) {
        ctx.addIssue({
          path: ["platformPreference"],
          message: "Please select your preferred platform",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

type EventRegistrationData = z.infer<typeof eventRegistrationSchema>;

// Step field names for validation
type StepFieldName = keyof EventRegistrationData;

// Step configuration type
interface StepConfig {
  label: string;
  component: React.ComponentType;
  fields: StepFieldName[];
}

// Step Components
function BasicInfoStep() {
  const { register, formState: { errors } } = useFormContext<EventRegistrationData>();

  return (
    <Stack spacing={3}>
      <Typography variant="h6">Basic Information</Typography>
      <Typography variant="body2" color="text.secondary">
        Let's start with your contact details.
      </Typography>

      <TextField
        {...register("name")}
        label="Full Name"
        error={!!errors.name}
        helperText={errors.name?.message}
      />

      <TextField
        {...register("email")}
        label="Email"
        type="email"
        error={!!errors.email}
        helperText={errors.email?.message}
      />
    </Stack>
  );
}

function AttendanceTypeStep() {
  const { control, formState: { errors } } = useFormContext<EventRegistrationData>();

  return (
    <Stack spacing={3}>
      <Typography variant="h6">How will you attend?</Typography>
      <Typography variant="body2" color="text.secondary">
        Your selection determines which information we need next.
      </Typography>

      <Controller
        name="attendanceType"
        control={control}
        render={({ field }) => (
          <FormControl error={!!errors.attendanceType}>
            <FormLabel>Attendance Type</FormLabel>
            <RadioGroup {...field} value={field.value || ""}>
              <FormControlLabel
                value="in-person"
                control={<Radio />}
                label="In-Person — I'll be there physically"
              />
              <FormControlLabel
                value="virtual"
                control={<Radio />}
                label="Virtual — I'll join online"
              />
              <FormControlLabel
                value="hybrid"
                control={<Radio />}
                label="Hybrid — Some days in-person, some virtual"
              />
            </RadioGroup>
            {errors.attendanceType && (
              <FormHelperText>{errors.attendanceType.message}</FormHelperText>
            )}
          </FormControl>
        )}
      />

      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>Conditional Steps Demo:</strong> Based on your selection, different
          steps will appear. Try selecting each option to see how the form adapts.
        </Typography>
      </Alert>
    </Stack>
  );
}

function InPersonStep() {
  const { register, control, formState: { errors } } = useFormContext<EventRegistrationData>();

  return (
    <Stack spacing={3}>
      <Typography variant="h6">In-Person Details</Typography>
      <Typography variant="body2" color="text.secondary">
        We need a few more details for your on-site experience.
      </Typography>

      <TextField
        {...register("dietaryRestrictions")}
        label="Dietary Restrictions"
        placeholder="e.g., Vegetarian, Vegan, None"
        error={!!errors.dietaryRestrictions}
        helperText={errors.dietaryRestrictions?.message}
      />

      <Controller
        name="tshirtSize"
        control={control}
        render={({ field }) => (
          <FormControl error={!!errors.tshirtSize}>
            <FormLabel>T-Shirt Size</FormLabel>
            <RadioGroup {...field} value={field.value || ""} row>
              {(["xs", "s", "m", "l", "xl", "xxl"] as const).map((size) => (
                <FormControlLabel
                  key={size}
                  value={size}
                  control={<Radio />}
                  label={size.toUpperCase()}
                />
              ))}
            </RadioGroup>
            {errors.tshirtSize && (
              <FormHelperText>{errors.tshirtSize.message}</FormHelperText>
            )}
          </FormControl>
        )}
      />
    </Stack>
  );
}

function VirtualStep() {
  const { register, control, formState: { errors } } = useFormContext<EventRegistrationData>();

  return (
    <Stack spacing={3}>
      <Typography variant="h6">Virtual Attendance Details</Typography>
      <Typography variant="body2" color="text.secondary">
        Help us optimize your online experience.
      </Typography>

      <TextField
        {...register("timezone")}
        label="Your Timezone"
        placeholder="e.g., America/New_York, Europe/London"
        error={!!errors.timezone}
        helperText={errors.timezone?.message}
      />

      <Controller
        name="platformPreference"
        control={control}
        render={({ field }) => (
          <FormControl error={!!errors.platformPreference}>
            <FormLabel>Preferred Platform</FormLabel>
            <RadioGroup {...field} value={field.value || ""}>
              <FormControlLabel value="zoom" control={<Radio />} label="Zoom" />
              <FormControlLabel value="meet" control={<Radio />} label="Google Meet" />
              <FormControlLabel value="teams" control={<Radio />} label="Microsoft Teams" />
            </RadioGroup>
            {errors.platformPreference && (
              <FormHelperText>{errors.platformPreference.message}</FormHelperText>
            )}
          </FormControl>
        )}
      />
    </Stack>
  );
}

function AdditionalInfoStep() {
  const { register, formState: { errors } } = useFormContext<EventRegistrationData>();

  return (
    <Stack spacing={3}>
      <Typography variant="h6">Almost Done!</Typography>
      <Typography variant="body2" color="text.secondary">
        One last question before we wrap up.
      </Typography>

      <TextField
        {...register("howDidYouHear")}
        label="How did you hear about this event?"
        multiline
        rows={3}
        error={!!errors.howDidYouHear}
        helperText={errors.howDidYouHear?.message}
        placeholder="Social media, friend referral, newsletter, etc."
      />
    </Stack>
  );
}

const defaultValues: EventRegistrationData = {
  name: "",
  email: "",
  attendanceType: "in-person",
  dietaryRestrictions: "",
  tshirtSize: undefined,
  timezone: "",
  platformPreference: undefined,
  howDidYouHear: "",
};

/**
 * Pattern 3: Conditional Steps
 *
 * Key concepts demonstrated:
 * - Steps that appear/disappear based on user selection
 * - Schema with superRefine for conditional validation
 * - Dynamic step array based on form state
 * - Validation adapts to current step configuration
 */
export function ConditionalStepsForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const form = useForm<EventRegistrationData>({
    mode: "onTouched",
    shouldUnregister: false,
    defaultValues,
    resolver: zodResolver(eventRegistrationSchema),
  });

  const { watch, trigger, handleSubmit, reset } = form;
  const attendanceType = watch("attendanceType");

  // Build dynamic steps based on attendance type
  const steps = useMemo((): StepConfig[] => {
    const baseSteps: StepConfig[] = [
      {
        label: "Basic Info",
        component: BasicInfoStep,
        fields: ["name", "email"],
      },
      {
        label: "Attendance",
        component: AttendanceTypeStep,
        fields: ["attendanceType"],
      },
    ];

    // Add conditional steps based on attendance type
    if (attendanceType === "in-person") {
      baseSteps.push({
        label: "In-Person",
        component: InPersonStep,
        fields: ["dietaryRestrictions", "tshirtSize"],
      });
    } else if (attendanceType === "virtual") {
      baseSteps.push({
        label: "Virtual",
        component: VirtualStep,
        fields: ["timezone", "platformPreference"],
      });
    } else if (attendanceType === "hybrid") {
      // Hybrid gets both steps!
      baseSteps.push({
        label: "In-Person",
        component: InPersonStep,
        fields: ["dietaryRestrictions", "tshirtSize"],
      });
      baseSteps.push({
        label: "Virtual",
        component: VirtualStep,
        fields: ["timezone", "platformPreference"],
      });
    }

    // Always end with additional info
    baseSteps.push({
      label: "Finish",
      component: AdditionalInfoStep,
      fields: ["howDidYouHear"],
    });

    return baseSteps;
  }, [attendanceType]);

  const stepLabels = useMemo(() => steps.map((s) => s.label), [steps]);
  const CurrentStepComponent = steps[currentStep]?.component;
  const isLastStep = currentStep === steps.length - 1;

  // Adjust current step if it's now out of bounds (e.g., user changed attendance type)
  const safeCurrentStep = Math.min(currentStep, steps.length - 1);
  if (safeCurrentStep !== currentStep) {
    setCurrentStep(safeCurrentStep);
  }

  const validateCurrentStep = useCallback(async () => {
    const currentStepConfig = steps[currentStep];
    if (!currentStepConfig) return false;
    return await trigger(currentStepConfig.fields);
  }, [currentStep, steps, trigger]);

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data: EventRegistrationData) => {
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await submitOnboarding(data);

      if (response.success) {
        setSubmitResult({
          success: true,
          message: `Registration complete! Confirmation ID: ${response.data?.id}`,
        });
      } else {
        setSubmitResult({
          success: false,
          message: response.error || "Something went wrong",
        });
      }
    } catch {
      setSubmitResult({
        success: false,
        message: "Network error. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    reset(defaultValues);
    setCurrentStep(0);
    setSubmitResult(null);
  };

  if (submitResult?.success) {
    return (
      <Container maxWidth="sm">
        <Card>
          <CardContent>
            <Stack spacing={3} alignItems="center" py={4}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  bgcolor: "success.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckIcon sx={{ fontSize: 40, color: "white" }} />
              </Box>
              <Typography variant="h5">You're registered!</Typography>
              <Typography color="text.secondary" textAlign="center">
                {submitResult.message}
              </Typography>
              <Button variant="outlined" onClick={handleReset}>
                Register Another
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Pattern 3: Conditional Steps
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip label="Dynamic steps" size="small" color="success" variant="outlined" />
          <Chip label="superRefine validation" size="small" color="success" variant="outlined" />
          <Chip label="Steps change based on selection" size="small" color="success" variant="outlined" />
        </Stack>
      </Box>

      <Card>
        <CardContent>
          <StepperProgress steps={stepLabels} activeStep={currentStep} />

          {submitResult && !submitResult.success && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {submitResult.message}
            </Alert>
          )}

          <FormProvider {...form}>
            <Box>
              <Box sx={{ minHeight: 300, mb: 3 }}>
                {CurrentStepComponent && <CurrentStepComponent />}
              </Box>

              <Stack direction="row" spacing={2} justifyContent="space-between">
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={handleBack}
                  disabled={currentStep === 0 || isSubmitting}
                >
                  Back
                </Button>

                {isLastStep ? (
                  <Button
                    type="button"
                    variant="contained"
                    disabled={isSubmitting}
                    onClick={handleSubmit(onSubmit)}
                    endIcon={
                      isSubmitting ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <CheckIcon />
                      )
                    }
                  >
                    {isSubmitting ? "Submitting..." : "Complete Registration"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}
              </Stack>
            </Box>
          </FormProvider>

          <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: "divider" }}>
            <Typography variant="caption" color="text.secondary">
              Select different attendance types in Step 2 to see how the form adapts.
              Hybrid adds both in-person and virtual steps!
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
