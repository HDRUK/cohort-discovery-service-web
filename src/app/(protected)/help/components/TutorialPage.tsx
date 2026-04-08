import { Button, Paper, Typography } from "@mui/material";
import { IFrameWrapper } from "./IFrameWrapper";
import { ArrowBack } from "@mui/icons-material";
import { usePathname } from "next/navigation";
import { getVideoById } from "../[sectionId]/page";
const TutorialPage = ({ tutorialId }: { tutorialId: string }) => {
  const pathname = usePathname();

  const video = getVideoById(tutorialId);
  return (
    <Paper
      sx={{
        backgroundColor: "white",
        border: 1,
        borderWidth: "0.5px",
        borderColor: "text.secondary",
        p: 1,
        my: 2,
      }}
    >
      <Button
        color="secondary"
        variant="outlined"
        sx={{ borderWidth: 0, "&.Mui-hover": { borderWidth: "0px" } }}
        startIcon={<ArrowBack />}
        href={pathname.substring(0, pathname.lastIndexOf("/"))}
      >
        Go back to all tutorials
      </Button>
      <Typography variant="h4" sx={{ px: 1 }}>
        {video?.title}
      </Typography>
      <Typography sx={{ px: 1, pb: 2 }}>{video?.text}</Typography>
      <IFrameWrapper maxWidth="900px">
        <iframe
          loading="lazy"
          title={video?.title}
          src={video?.url}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ border: "0" }}
        ></iframe>
      </IFrameWrapper>
    </Paper>
  );
};

export default TutorialPage;
