import FormTextField from "@/components/FormTextField";
import Title from "@/components/Title";
import { Box, BoxProps, Button, Stack } from "@mui/material";
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
    formState: { isSubmitting },
  } = formMethods;

  const onSubmit = (data: LoginFormValues) => {
    console.log(data);
  };

  return (
    <FormProvider {...formMethods}>
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
    </FormProvider>
  );
};

export default StandaloneLoginForm;
