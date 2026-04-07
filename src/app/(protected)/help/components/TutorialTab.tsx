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

export type Video = {
  id: string;
  title: string;
  text?: string;
  url: string;
  thumbnail?: string;
  categorisation: string;
};

export type VideoLibrarySection = {
  sectionTitle: string;
  videos: Video[];
};

const TutorialTab = ({
  label,
  videoLibrarySection,
}: {
  label: string;
  videoLibrarySection: VideoLibrarySection;
}) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  if (selectedVideo) {
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
          onClick={() => {
            setSelectedVideo(null);
          }}
        >
          Go back to all tutorials
        </Button>
        <Typography variant="h4" sx={{ px: 1 }}>
          {selectedVideo?.title}
        </Typography>
        <Typography sx={{ px: 1, pb: 2 }}>{selectedVideo?.text}</Typography>
        <IFrameWrapper maxWidth="900px">
          <iframe
            loading="lazy"
            title={selectedVideo.title}
            src={selectedVideo.url}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ border: "0" }}
          ></iframe>
        </IFrameWrapper>
      </Paper>
    );
  }
  return (
    <Grid
      container
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
      sx={{ m: 0, p: 0 }}
    >
      {videoLibrarySection.videos.map((v, index) => (
        <Grid key={index} size={{ xs: 2, sm: 4, md: 4 }}>
          <Card variant="outlined" sx={{ p: 1 }}>
            <CardActionArea
              onClick={() => {
                console.log("clicked on a card!"); //TODO: open a modal or replace current page, with the detailed page of this one video
                setSelectedVideo(v);
              }}
            >
              <CardMedia component="img" alt={v.title} image={v.thumbnail} />
              <Box display="flex" flexDirection="row" gap={1}>
                <PlayCircle
                  color="secondary"
                  sx={{ height: "48px", width: "48px" }}
                />
                <Stack>
                  <Typography color="secondary">{v.title}</Typography>
                  <Typography color="secondary">
                    {v.categorisation} 1 min
                  </Typography>
                </Stack>
              </Box>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default TutorialTab;
