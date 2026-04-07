import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { IFrameWrapper } from "./IFrameWrapper";
import { ArrowBack, PlayCircle } from "@mui/icons-material";
import { redirect, usePathname } from "next/navigation";
import { routes } from "@/config/routes";
import { VIDEOS } from "../[sectionId]/page";
const TutorialPage = ({ tutorialId }: { tutorialId: string }) => {
  const pathname = usePathname();

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
        {/* {selectedVideo?.title} */}
        {VIDEOS["1"].videos[0].title}
      </Typography>
      {/* <Typography sx={{ px: 1, pb: 2 }}>{selectedVideo?.text}</Typography>
      <IFrameWrapper maxWidth="900px">
        <iframe
          loading="lazy"
          title={selectedVideo.title}
          src={selectedVideo.url}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ border: "0" }}
        ></iframe>
      </IFrameWrapper> */}
    </Paper>
  );
};

export default TutorialPage;
