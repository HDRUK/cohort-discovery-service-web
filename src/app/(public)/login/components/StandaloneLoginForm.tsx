import standaloneSignIn from "@/actions/standalone/standaloneSignIn";
import FormTextField from "@/components/FormTextField";
import Title from "@/components/Title";
import { useNotify } from "@/providers/NotifyProvider";
import { Box, BoxProps, Button, Paper, Stack } from "@mui/material";
import { Controller, FormProvider, useForm } from "react-hook-form";

type LoginFormValues = {
  email: string;
  password: string;
};

interface StandaloneLoginFormProps extends BoxProps {
  onCancel?: () => void;
}

const StandaloneLoginForm = ({
  sx,
  onCancel,
  ...props
}: StandaloneLoginFormProps) => {
  const notify = useNotify();
  const formMethods = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const {
    handleSubmit,
    control,
    reset,
    setError,
    formState: { isSubmitting },
  } = formMethods;

  const onSubmit = async (data: LoginFormValues) => {
    const result = await standaloneSignIn(data);
    if (!result) {
      const fields: (keyof LoginFormValues)[] = ["email", "password"];
      fields.forEach((item) =>
        setError(item, { message: "Incorrect credentials" }),
      );
      return;
    }
    notify.success("Logged in!");
  };

  return (
    <FormProvider {...formMethods}>
      <Paper sx={{ p: 2 }}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          {...props}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            ...sx,
          }}
        >
          <Title title="Login" />
          <Controller
            name="email"
            control={control}
            rules={{ required: "An email address is required" }}
            render={({ field, fieldState: { error } }) => (
              <FormTextField
                {...field}
                label="Email"
                type="email"
                error={error}
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
              <FormTextField
                {...field}
                type="password"
                label="Password"
                error={error}
                fullWidth
                required
              />
            )}
          />

          <Stack direction="row" spacing={1} justifyContent="space-between">
            <Button
              type="button"
              onClick={() => {
                onCancel?.();
                reset();
              }}
              disabled={isSubmitting}
              variant="contained"
              sx={{ bgcolor: "background.default", color: "text.primary" }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="outlined" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </FormProvider>
  );
};

export default StandaloneLoginForm;
