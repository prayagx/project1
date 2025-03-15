// Analytics utility functions for tracking user interactions

// Define event categories
export enum EventCategory {
  ENGAGEMENT = 'engagement',
  GENERATION = 'generation',
  NAVIGATION = 'navigation',
  CONVERSION = 'conversion',
  PREFERENCE = 'preference'
}

// Track a page view
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
      page_path: url,
    });
  }
};

// Track an event
export const trackEvent = (
  action: string,
  category: EventCategory,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track diet plan generation
export const trackDietPlanGeneration = (
  dietaryPreferences: string[],
  mealFrequency: number,
  planDuration: 'day' | 'week',
  targetCalories: number
) => {
  trackEvent(
    'generate_diet_plan',
    EventCategory.GENERATION,
    `${dietaryPreferences.join(',')} | ${mealFrequency} meals | ${planDuration}`,
    targetCalories
  );
};

// Track form step progression
export const trackFormStep = (stepNumber: number) => {
  trackEvent(
    'progress_form_step',
    EventCategory.ENGAGEMENT,
    `Step ${stepNumber}`,
    stepNumber
  );
};

// Track section navigation
export const trackSectionNavigation = (sectionName: string) => {
  trackEvent(
    'navigate_section',
    EventCategory.NAVIGATION,
    sectionName
  );
};

// Track plan customization
export const trackPlanCustomization = (customizationType: string) => {
  trackEvent(
    'customize_plan',
    EventCategory.ENGAGEMENT,
    customizationType
  );
};

// Track meal selection
export const trackMealSelection = (mealName: string, mealType: string) => {
  trackEvent(
    'select_meal',
    EventCategory.PREFERENCE,
    `${mealType}: ${mealName}`
  );
};

// Track diet plan saves or exports
export const trackPlanExport = (exportType: 'print' | 'save' | 'email' | 'share') => {
  trackEvent(
    'export_plan',
    EventCategory.CONVERSION,
    exportType
  );
};

// Track site features usage
export const trackFeatureUsage = (featureName: string) => {
  trackEvent(
    'use_feature',
    EventCategory.ENGAGEMENT,
    featureName
  );
}; 