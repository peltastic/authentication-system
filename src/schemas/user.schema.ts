import { object, string, ref } from "yup";

export const createUserSchema = object({
  body: object({
    name: string().required("Name is required"),
    password: string()
      .required("Password is required")
      .min(6, "password is too short - min. of six characters")
      .matches(/^[a-zA-Z0-9._,]*$/, "Password can only be latin Letters"),
    passwordConfirmation: string().oneOf(
      [ref("password"), null],
      "Passwords must match"
    ),
    email: string()
      .email("Must be a valid Email")
      .required("Email is required"),
  }),
});

export const createUserSessionSchema = object({
  body: object({
    password: string()
      .required("Password is required")
      .min(6, "password is too short - min. of six characters")
      .matches(/^[a-zA-Z0-9._,]*$/, "Password can only be latin Letters"),
    email: string()
      .email("Must be a valid Email")
      .required("Email is required"),
  }),
});
