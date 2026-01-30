import {
  Stack,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Box,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import { useFormContext, Controller } from "react-hook-form";
import type { OnboardingData } from "../../../schemas/onboarding.schema";

/**
 * Step 3: Account type selection
 * Demonstrates custom form controls with Controller
 */
export function AccountTypeStep() {
  const { control, watch } = useFormContext<OnboardingData>();
  const selectedType = watch("accountType");

  return (
    <Stack spacing={3}>
      <Typography variant="h6" gutterBottom>
        How will you use this?
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Select the type of account that best fits your needs.
      </Typography>

      <Controller
        name="accountType"
        control={control}
        render={({ field }) => (
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Card
              sx={{
                flex: 1,
                border: 2,
                borderColor:
                  selectedType === "personal" ? "primary.main" : "grey.200",
                transition: "border-color 0.2s",
              }}
            >
              <CardActionArea type="button" onClick={() => field.onChange("personal")}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      py: 2,
                    }}
                  >
                    <PersonIcon
                      sx={{
                        fontSize: 48,
                        color:
                          selectedType === "personal"
                            ? "primary.main"
                            : "grey.400",
                        mb: 1,
                      }}
                    />
                    <Typography variant="h6">Personal</Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      textAlign="center"
                    >
                      For individual use and personal projects
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>

            <Card
              sx={{
                flex: 1,
                border: 2,
                borderColor:
                  selectedType === "business" ? "primary.main" : "grey.200",
                transition: "border-color 0.2s",
              }}
            >
              <CardActionArea type="button" onClick={() => field.onChange("business")}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      py: 2,
                    }}
                  >
                    <BusinessIcon
                      sx={{
                        fontSize: 48,
                        color:
                          selectedType === "business"
                            ? "primary.main"
                            : "grey.400",
                        mb: 1,
                      }}
                    />
                    <Typography variant="h6">Business</Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      textAlign="center"
                    >
                      For teams and organizations
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Stack>
        )}
      />
    </Stack>
  );
}
