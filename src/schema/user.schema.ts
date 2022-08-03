import { object, string, TypeOf } from "zod";

export const createUSerSchema = object({
  body: object({
    firstName: string({
      required_error: "First name is required",
    }),
    lastName: string({
      required_error: "Last name is required",
    }),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password is too short - should be min 6 chars"),
    passwordConfirmation: string({
      required_error: "Password confirmation is required",
    }).min(6, "Password is too short - should be min 6 chars"),
    email: string({
      required_error: "Email is Required",
    }).email("Nor a valid email"),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Password do not Matth",
    path: ["passwordConfirmation"],
  }),
});

export const verifyUserSchema = object({
  params: object({
    id: string(),
    verificationCode: string(),
  }),
});
export const forgotPasswordSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Not a Valid Email"),
  }),
});

export const resetPasswordSchema = object({
  params: object({
    id: string(),
    passwordResetCode: string(),
  }),
  body: object({
    password: string({
      required_error: "Password is required",
    }).min(6, "Password is too short - should be min 6 chars"),
    passwordConfirmation: string({
      required_error: "Password confirmation is required",
    }).min(6, "Password is too short - should be min 6 chars"),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Password do not Matth",
    path: ["passwordConfirmation"],
  }),
});

export type CreateUserInput = TypeOf<typeof createUSerSchema>["body"];
export type VerifyUserInput = TypeOf<typeof verifyUserSchema>["params"];
export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>["body"];
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;
