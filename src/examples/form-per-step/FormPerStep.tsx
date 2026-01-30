import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
  Alert,
  Chip,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { Button } from "@mui/material";

import { StepperProgress } from "../../components";
import {
  AccountStepForm,
  ProfileStepForm,
  PreferencesStepForm,
} from "./steps";
import { saveDraft, loadDraft, submitOnboarding, clearDrafts } from "../../mock/api";

// Centralized store for all step data
type FormData = {
  account?: {
    email: string;
    password: string;
    confirmPassword: string;
  };
  profile?: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  preferences?: {
    newsletter: boolean;
    notifications: boolean;
    theme: "light" | "dark" | "system";
    language: string;
  };
};

const STEPS = ["Account", "Profile", "Preferences"];

/**
 * Pattern 2: Form Per Step
 *
 * Key concepts demonstrated:
 * - Each step has its own useForm instance and zodResolver
 * - Data is saved to backend/storage after each step
 * - Steps are completely independent
 * - Good for non-linear navigation or when steps need immediate persistence
 *
 * Trade-offs:
 * - More boilerplate
 * - State synchronization is more complex
 * - Harder to validate across steps
 */
export function FormPerStep() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(true);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Load saved drafts on mount
  useEffect(() => {
    async function loadAllDrafts() {
      setIsLoadingDrafts(true);
      const [accountResult, profileResult, preferencesResult] = await Promise.all([
        loadDraft<FormData["account"]>("account"),
        loadDraft<FormData["profile"]>("profile"),
        loadDraft<FormData["preferences"]>("preferences"),
      ]);

      setFormData({
        account: accountResult.success ? accountResult.data : undefined,
        profile: profileResult.success ? profileResult.data : undefined,
        preferences: preferencesResult.success ? preferencesResult.data : undefined,
      });
      setIsLoadingDrafts(false);
    }

    loadAllDrafts();
  }, []);

  const handleAccountSubmit = useCallback(async (data: NonNullable<FormData["account"]>) => {
    setIsLoading(true);
    await saveDraft("account", data);
    setFormData((prev) => ({ ...prev, account: data }));
    setCurrentStep(1);
    setIsLoading(false);
  }, []);

  const handleProfileSubmit = useCallback(async (data: NonNullable<FormData["profile"]>) => {
    setIsLoading(true);
    await saveDraft("profile", data);
    setFormData((prev) => ({ ...prev, profile: data }));
    setCurrentStep(2);
    setIsLoading(false);
  }, []);

  const handlePreferencesSubmit = useCallback(async (data: NonNullable<FormData["preferences"]>) => {
    setIsLoading(true);
    await saveDraft("preferences", data);

    const finalData = {
      ...formData.account,
      ...formData.profile,
      ...data,
    };

    const response = await submitOnboarding(finalData);

    if (response.success) {
      clearDrafts();
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

    setIsLoading(false);
  }, [formData]);

  const handleReset = () => {
    clearDrafts();
    setFormData({});
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

  if (isLoadingDrafts) {
    return (
      <Container maxWidth="sm">
        <Card>
          <CardContent>
            <Typography textAlign="center" py={4}>
              Loading saved progress...
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Pattern 2: Form Per Step
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip label="Separate useForm per step" size="small" color="secondary" variant="outlined" />
          <Chip label="zodResolver per step" size="small" color="secondary" variant="outlined" />
          <Chip label="Immediate persistence" size="small" color="secondary" variant="outlined" />
        </Stack>
      </Box>

      <Card>
        <CardContent>
          <StepperProgress steps={STEPS} activeStep={currentStep} />

          {submitResult && !submitResult.success && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {submitResult.message}
            </Alert>
          )}

          <Box sx={{ minHeight: 320 }}>
            {currentStep === 0 && (
              <AccountStepForm
                defaultValues={formData.account || {}}
                onSubmit={handleAccountSubmit}
                isLoading={isLoading}
              />
            )}

            {currentStep === 1 && (
              <ProfileStepForm
                defaultValues={formData.profile || {}}
                onSubmit={handleProfileSubmit}
                onBack={() => setCurrentStep(0)}
                isLoading={isLoading}
              />
            )}

            {currentStep === 2 && (
              <PreferencesStepForm
                defaultValues={formData.preferences || {}}
                onSubmit={handlePreferencesSubmit}
                onBack={() => setCurrentStep(1)}
                isLoading={isLoading}
              />
            )}
          </Box>

          <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: "divider" }}>
            <Typography variant="caption" color="text.secondary">
              Each step saves data immediately. Notice the console logs showing backend calls.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
