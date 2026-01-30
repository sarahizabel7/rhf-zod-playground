import { z } from "zod";

/**
 * Domain Schema - Single Source of Truth
 * This schema describes the complete data contract for onboarding.
 */
export const onboardingSchema = z
  .object({
    // Step 1: Account
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),

    // Step 2: Profile
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^\+?[0-9]{10,14}$/, "Invalid phone number format"),

    // Step 3: Company (conditional)
    accountType: z.enum(["personal", "business"]),
    companyName: z.string().optional(),
    teamSize: z.number().min(1).optional(),
    role: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Cross-field validation: passwords must match
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords do not match",
        code: z.ZodIssueCode.custom,
      });
    }

    // Conditional validation: business accounts require company info
    if (data.accountType === "business") {
      if (!data.companyName || data.companyName.length === 0) {
        ctx.addIssue({
          path: ["companyName"],
          message: "Company name is required for business accounts",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.teamSize || data.teamSize < 1) {
        ctx.addIssue({
          path: ["teamSize"],
          message: "Team size is required for business accounts",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

// Infer TypeScript type from schema
export type OnboardingData = z.infer<typeof onboardingSchema>;

/**
 * Step Schemas - Derived from Domain Schema
 * Using .pick() ensures no duplication and keeps schemas in sync.
 */

// Step 1: Account credentials
export const accountStepSchema = z
  .object({
    email: onboardingSchema.shape.email,
    password: onboardingSchema.shape.password,
    confirmPassword: onboardingSchema.shape.confirmPassword,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type AccountStepData = z.infer<typeof accountStepSchema>;

// Step 2: Profile information
export const profileStepSchema = z.object({
  firstName: onboardingSchema.shape.firstName,
  lastName: onboardingSchema.shape.lastName,
  phone: onboardingSchema.shape.phone,
});

export type ProfileStepData = z.infer<typeof profileStepSchema>;

// Step 3: Account type selection
export const accountTypeStepSchema = z.object({
  accountType: onboardingSchema.shape.accountType,
});

export type AccountTypeStepData = z.infer<typeof accountTypeStepSchema>;

// Step 4: Company information (only for business accounts)
export const companyStepSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  teamSize: z.number().min(1, "Team size must be at least 1"),
  role: z.string().min(1, "Your role is required"),
});

export type CompanyStepData = z.infer<typeof companyStepSchema>;

// Default values for the form
export const defaultOnboardingValues: OnboardingData = {
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  phone: "",
  accountType: "personal",
  companyName: "",
  teamSize: undefined,
  role: "",
};
