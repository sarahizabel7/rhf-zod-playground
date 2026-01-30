/**
 * Mock API - Simulates backend calls
 * This is not the focus of this project, just a simple simulation.
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock submit onboarding data
 */
export async function submitOnboarding<T>(
  data: T
): Promise<ApiResponse<{ id: string }>> {
  console.log("📤 Submitting to backend:", data);

  await delay(1500); // Simulate network latency

  // Simulate occasional failures (10% chance)
  if (Math.random() < 0.1) {
    return {
      success: false,
      error: "Server error. Please try again.",
    };
  }

  // Simulate email already exists error
  if (
    typeof data === "object" &&
    data !== null &&
    "email" in data &&
    (data as { email: string }).email === "taken@example.com"
  ) {
    return {
      success: false,
      error: "This email is already registered.",
    };
  }

  return {
    success: true,
    data: { id: `user_${Date.now()}` },
  };
}

/**
 * Mock save draft (for form-per-step pattern)
 */
export async function saveDraft<T>(
  step: string,
  data: T
): Promise<ApiResponse<{ saved: boolean }>> {
  console.log(`💾 Saving draft for step "${step}":`, data);

  await delay(500);

  // Store in localStorage to simulate persistence
  const drafts = JSON.parse(localStorage.getItem("onboarding-drafts") || "{}");
  drafts[step] = data;
  localStorage.setItem("onboarding-drafts", JSON.stringify(drafts));

  return {
    success: true,
    data: { saved: true },
  };
}

/**
 * Mock load draft
 */
export async function loadDraft<T>(step: string): Promise<ApiResponse<T>> {
  await delay(300);

  const drafts = JSON.parse(localStorage.getItem("onboarding-drafts") || "{}");

  if (drafts[step]) {
    return {
      success: true,
      data: drafts[step] as T,
    };
  }

  return {
    success: false,
    error: "No draft found",
  };
}

/**
 * Clear all drafts
 */
export function clearDrafts(): void {
  localStorage.removeItem("onboarding-drafts");
  localStorage.removeItem("onboarding-form-draft");
  console.log("🗑️ Drafts cleared");
}
