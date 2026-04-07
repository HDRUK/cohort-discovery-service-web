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
import { redirect } from "next/navigation";
import { routes } from "@/config/routes";

export type Video = {
  id: string;
  title: string;
  text?: string;
  url: string;
  thumbnail?: string;
  categorisation: string;
  href: string;
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
                redirect(v.href);
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
