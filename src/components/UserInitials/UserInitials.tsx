import { Box } from "@mui/material";
import { User } from "@/types/api";

const UserInitials = ({ user }: { user: User }) => {
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
      {`${user.firstname[0]}${user.lastname[0]}`.toUpperCase()}
    </Box>
  );
};

export default UserInitials;
