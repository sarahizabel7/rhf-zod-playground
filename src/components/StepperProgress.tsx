import { Stepper, Step, StepLabel, Box } from "@mui/material";

type StepperProgressProps = {
  steps: string[];
  activeStep: number;
};

/**
 * Visual stepper showing form progress
 */
export function StepperProgress({ steps, activeStep }: StepperProgressProps) {
  return (
    <Box sx={{ width: "100%", mb: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
