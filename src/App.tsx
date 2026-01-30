import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  CardActionArea,
  Stack,
  Chip,
  IconButton,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import GitHubIcon from "@mui/icons-material/GitHub";

import { theme } from "./theme";
import { MultiStepSingleForm } from "./examples/multi-step-single-form/MultiStepSingleForm";
import { FormPerStep } from "./examples/form-per-step/FormPerStep";
import { ConditionalStepsForm } from "./examples/conditional-steps/ConditionalStepsForm";

function HomePage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          RHF + Zod Playground
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Interactive examples of multi-step form patterns with
          React Hook Form and Zod validation
        </Typography>
        <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap>
          <Chip label="React Hook Form" color="primary" />
          <Chip label="Zod" color="secondary" />
          <Chip label="TypeScript" />
          <Chip label="Material UI" />
        </Stack>
      </Box>

      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Choose a Pattern
      </Typography>

      <Stack spacing={3}>
        <Card>
          <CardActionArea component={Link} to="/multi-step-single-form">
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Pattern 1: Single Form, Multiple Steps
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    The most common pattern. One <code>useForm</code> instance shared across all steps
                    via <code>FormProvider</code>. Step validation using <code>trigger()</code>.
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip label="FormProvider" size="small" variant="outlined" />
                    <Chip label="trigger() validation" size="small" variant="outlined" />
                    <Chip label="localStorage persistence" size="small" variant="outlined" />
                    <Chip label="Conditional steps" size="small" variant="outlined" />
                  </Stack>
                </Box>
                <Chip label="Recommended" color="primary" size="small" />
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card>
          <CardActionArea component={Link} to="/form-per-step">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pattern 2: Form Per Step
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Each step has its own <code>useForm</code> instance with <code>zodResolver</code>.
                Data is saved immediately after each step. Good for non-linear flows.
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label="Separate useForm per step" size="small" variant="outlined" />
                <Chip label="zodResolver per step" size="small" variant="outlined" />
                <Chip label="Immediate persistence" size="small" variant="outlined" />
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card>
          <CardActionArea component={Link} to="/conditional-steps">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pattern 3: Conditional Steps
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Steps that appear or disappear based on user selections.
                Uses <code>superRefine</code> for conditional validation rules.
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label="Dynamic step array" size="small" variant="outlined" />
                <Chip label="superRefine validation" size="small" variant="outlined" />
                <Chip label="Adapts to user choices" size="small" variant="outlined" />
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>
      </Stack>

      <Box sx={{ mt: 6, pt: 4, borderTop: 1, borderColor: "divider" }}>
        <Typography variant="h6" gutterBottom>
          Key Concepts Demonstrated
        </Typography>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" color="primary">
              Schema Derivation
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Step schemas are derived from the main domain schema using <code>.pick()</code>,
              <code>.omit()</code>, and <code>.shape</code>. No duplication, no drift.
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="primary">
              shouldUnregister: false
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Critical option that preserves field values when step components unmount.
              Without this, data disappears between steps.
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="primary">
              Validation Mode: onTouched
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Validates on first blur, then on every change. Best UX balance for multi-step forms.
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="primary">
              UX Rule: Never validate what users can't see
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Step validation only checks fields in the current step.
              Cross-field rules apply only on final submission.
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}

function Navigation() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Toolbar>
        {!isHome && (
          <IconButton component={Link} to="/" edge="start" sx={{ mr: 2 }}>
            <HomeIcon />
          </IconButton>
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {isHome ? "RHF + Zod Playground" : "← Back to Examples"}
        </Typography>
        <IconButton
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          edge="end"
        >
          <GitHubIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #0f172a 60%, #172554 100%)",
        }}>
          <Navigation />
          <Box sx={{ py: 4 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/multi-step-single-form" element={<MultiStepSingleForm />} />
              <Route path="/form-per-step" element={<FormPerStep />} />
              <Route path="/conditional-steps" element={<ConditionalStepsForm />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
