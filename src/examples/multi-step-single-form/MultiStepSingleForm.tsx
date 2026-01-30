import { useState, useMemo, useEffect, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckIcon from "@mui/icons-material/Check";

import { StepperProgress } from "../../components";
import { AccountStep, ProfileStep, AccountTypeStep, CompanyStep } from "./steps";
import {
  type OnboardingData,
  onboardingSchema,
  defaultOnboardingValues,
} from "../../schemas/onboarding.schema";
import { submitOnboarding } from "../../mock/api";

const STORAGE_KEY = "multi-step-form-draft";

// Step field names for validation
type StepFieldName = keyof OnboardingData;

// Step configuration type
interface StepConfig {
  label: string;
  component: React.ComponentType;
  fields: StepFieldName[];
}

/**
 * Pattern 1: Multi-Step Single Form
 *
 * Key concepts demonstrated:
 * - One useForm instance shared across all steps via FormProvider
 * - shouldUnregister: false to preserve values when steps unmount
 * - Step-specific validation using trigger() with field names
 * - Conditional steps (company step only shows for business accounts)
 * - Form persistence to localStorage
 * - Final validation with full schema on submit
 */
export function MultiStepSingleForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Load saved draft from localStorage
  const savedValues = useMemo(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return { ...defaultOnboardingValues, ...JSON.parse(saved) };
      } catch {
        return defaultOnboardingValues;
      }
    }
    return defaultOnboardingValues;
  }, []);

  const form = useForm<OnboardingData>({
    mode: "onTouched", // Validate on first blur, then on change
    shouldUnregister: false, // Critical: preserves values when steps unmount
    defaultValues: savedValues,
    resolver: zodResolver(onboardingSchema),
    // Note: Even with the full schema, trigger(fieldNames) only validates
    // the specified fields - this enables step-by-step validation
  });

  const { watch, trigger, handleSubmit, reset } = form;
  const accountType = watch("accountType");

  // Dynamic steps based on account type
  const steps = useMemo((): StepConfig[] => {
    const baseSteps: StepConfig[] = [
      { label: "Account", component: AccountStep, fields: ["email", "password", "confirmPassword"] },
      { label: "Profile", component: ProfileStep, fields: ["firstName", "lastName", "phone"] },
      { label: "Account Type", component: AccountTypeStep, fields: ["accountType"] },
    ];

    if (accountType === "business") {
      baseSteps.push({
        label: "Company",
        component: CompanyStep,
        fields: ["companyName", "teamSize", "role"],
      });
    }

    return baseSteps;
  }, [accountType]);

  const stepLabels = useMemo(() => steps.map((s) => s.label), [steps]);
  const CurrentStepComponent = steps[currentStep]?.component;
  const isLastStep = currentStep === steps.length - 1;

  // Auto-save to localStorage on form changes
  useEffect(() => {
    const subscription = watch((data) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Validate current step using RHF's trigger method
  const validateCurrentStep = useCallback(async () => {
    const currentStepConfig = steps[currentStep];
    if (!currentStepConfig) return false;

    // trigger() validates specific fields and returns true if valid
    const isValid = await trigger(currentStepConfig.fields);
    return isValid;
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

  const onSubmit = async (data: OnboardingData) => {
    // Final validation with full schema (including cross-field rules)
    const result = onboardingSchema.safeParse(data);

    if (!result.success) {
      // Find which step has the first error
      const firstErrorPath = result.error.issues[0]?.path[0];
      const stepWithError = steps.findIndex((step) =>
        step.fields.includes(firstErrorPath as StepFieldName)
      );
      if (stepWithError !== -1) {
        setCurrentStep(stepWithError);
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await submitOnboarding(result.data);

      if (response.success) {
        localStorage.removeItem(STORAGE_KEY);
        setSubmitResult({
          success: true,
          message: `Account created successfully! ID: ${response.data?.id}`,
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
    localStorage.removeItem(STORAGE_KEY);
    reset(defaultOnboardingValues);
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
              <Typography variant="h5">Welcome aboard!</Typography>
              <Typography color="text.secondary" textAlign="center">
                {submitResult.message}
              </Typography>
              <Button variant="outlined" onClick={handleReset}>
                Start Over
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
          Pattern 1: Single Form
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip label="One useForm" size="small" color="primary" variant="outlined" />
          <Chip label="FormProvider" size="small" color="primary" variant="outlined" />
          <Chip label="trigger() validation" size="small" color="primary" variant="outlined" />
          <Chip label="shouldUnregister: false" size="small" color="primary" variant="outlined" />
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
              <Box sx={{ minHeight: 280, mb: 3 }}>
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
                    {isSubmitting ? "Submitting..." : "Complete"}
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
              Form state is auto-saved to localStorage. Refresh the page to see persistence in action.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
