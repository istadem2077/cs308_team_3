import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Custom validator to check if the value of the current control matches the value
 * of another control in the same form group.
 * @param controlName The name of the control to match against (e.g., 'password').
 */
export function matchValidator(controlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control.parent;
    if (!formGroup) {
      return null;
    }

    const controlToMatch = formGroup.get(controlName);

    // Only validate if both controls exist and have values
    if (controlToMatch && controlToMatch.value !== control.value) {
      // Set the 'matching' error on the current control
      return { matching: true };
    }

    // If they match, ensure the error is cleared (important for cross-validation)
    if (controlToMatch && controlToMatch.value === control.value && control.errors && control.errors['matching']) {
      delete control.errors['matching'];
      control.updateValueAndValidity({ emitEvent: false });
    }

    return null; // Validation passed
  };
}