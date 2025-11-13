import { Box } from "@mui/material";
import { User } from "@/types/api";

const UserInitials = ({ user }: { user: User }) => {
  const getInitials = (fullName: string) => {
    if (!fullName) return "";

    const parts = fullName.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(user.name);

  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        bgcolor: "primary.main",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
      }}
    >
      {initials}
    </Box>
  );
};

export default UserInitials;
