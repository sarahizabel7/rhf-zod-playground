# RHF + Zod Playground

Interactive examples of multi-step form patterns with **React Hook Form** and **Zod** validation.

## Tech Stack

- React 19 + TypeScript
- Vite
- React Hook Form + @hookform/resolvers
- Zod
- Material UI
- React Router

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Form Patterns Demonstrated

### Pattern 1: Single Form, Multiple Steps (Recommended)

The most common pattern for multi-step forms like onboarding, checkout, and wizards.

**Key Features:**
- One `useForm` instance shared across all steps via `FormProvider`
- `shouldUnregister: false` to preserve values when steps unmount
- Step validation using `trigger()` with specific field names
- Conditional steps based on user selection
- Form persistence to localStorage

**Files:** `src/examples/multi-step-single-form/`

### Pattern 2: Form Per Step

Each step is a completely independent form with its own validation.

**Key Features:**
- Separate `useForm` + `zodResolver` per step
- Data saved immediately after each step
- Good for non-linear flows or when backend needs immediate persistence

**Files:** `src/examples/form-per-step/`

### Pattern 3: Conditional Steps

Steps that appear or disappear based on user selections.

**Key Features:**
- Dynamic step array that changes based on form state
- `superRefine` for conditional validation rules
- Steps adapt to user choices in real-time

**Files:** `src/examples/conditional-steps/`

## Key Concepts

### Schema Derivation

Step schemas are derived from the main domain schema:

```typescript
// Domain schema (single source of truth)
export const onboardingSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string(),
  // ...
});

// Step schema (derived, no duplication)
export const accountStepSchema = onboardingSchema.pick({
  email: true,
  password: true,
});
```

### shouldUnregister: false

Critical option for multi-step forms:

```typescript
const form = useForm({
  shouldUnregister: false, // Preserves values when steps unmount
});
```

### Validation Modes

```typescript
const form = useForm({
  mode: "onTouched", // Best for multi-step: validates on blur, then on change
});
```

| Mode | Behavior |
|------|----------|
| `onSubmit` | Validates only on form submission |
| `onChange` | Validates on every keystroke |
| `onBlur` | Validates when field loses focus |
| `onTouched` | First blur triggers validation, then validates on change |
| `all` | Both blur and change |

### Step Validation with trigger()

```typescript
const stepFields = ["email", "password"];

const handleNext = async () => {
  const isValid = await trigger(stepFields);
  if (isValid) {
    goToNextStep();
  }
};
```

## Project Structure

```
src/
├── components/          # Reusable form components
│   ├── FormTextField.tsx
│   ├── FormSelect.tsx
│   └── StepperProgress.tsx
├── examples/
│   ├── multi-step-single-form/   # Pattern 1
│   ├── form-per-step/            # Pattern 2
│   └── conditional-steps/        # Pattern 3
├── schemas/             # Zod schemas
│   └── onboarding.schema.ts
├── mock/                # Mock API
│   └── api.ts
└── theme/               # MUI theme
    └── index.ts
```

## Resources

- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [@hookform/resolvers](https://github.com/react-hook-form/resolvers)
- [Material UI](https://mui.com/)

## License

MIT
