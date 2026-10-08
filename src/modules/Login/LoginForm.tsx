"use client";

import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { Controller, FormProvider, useForm } from "react-hook-form";
import standaloneSignIn from "@/actions/standalone/standaloneSignIn";
import FormTextField from "@/components/FormTextField";
import FormPasswordField from "@/components/FormPasswordField";
import { FIELD_SX } from "./loginStyles";

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormProps {
  returnTo: string;
}

const LoginForm = ({ returnTo }: LoginFormProps) => {
  const router = useRouter();
  const formMethods = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "" },
  });
  const {
    handleSubmit,
    control,
    setError,
    formState: { isSubmitting },
  } = formMethods;

  const onSubmit = async (data: LoginFormValues) => {
    const signedIn = await standaloneSignIn(data);

    if (!signedIn) {
      (["email", "password"] as const).forEach((field) =>
        setError(field, { message: "Incorrect credentials" }),
      );
      return;
    }

    router.replace(returnTo);
    router.refresh();
  };

  return (
    <FormProvider {...formMethods}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Controller
          name="email"
          control={control}
          rules={{ required: "An email address is required" }}
          render={({ field, fieldState: { error } }) => (
            <FormTextField
              {...field}
              label="Email"
              type="email"
              autoComplete="email"
              error={error}
              sx={FIELD_SX}
              fullWidth
              required
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          rules={{ required: "Your password is required" }}
          render={({ field, fieldState: { error } }) => (
            <FormPasswordField
              {...field}
              label="Password"
              autoComplete="current-password"
              error={error}
              sx={FIELD_SX}
              fullWidth
              required
            />
          )}
        />

        <Button
          type="submit"
          color="secondary"
          loading={isSubmitting}
          fullWidth
        >
          Log in
        </Button>
      </Box>
    </FormProvider>
  );
};

export default LoginForm;
