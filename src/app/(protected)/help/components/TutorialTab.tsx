import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { notFound, usePathname } from "next/navigation";
import { IFrameWrapper } from "./IFrameWrapper";
import { PlayCircle, West } from "@mui/icons-material";
import useSearchParams from "@/hooks/useSearchParams";

import { Video } from "../[sectionId]/page";

const TutorialTab = ({ videos }: { videos: Video[] }) => {
  const pathname = usePathname();
  const { getSearchParam, setSearchParam } = useSearchParams("tutorial-id");
  const tutorialId = getSearchParam();

  if (tutorialId) {
    const video = videos.find((v) => v.id === tutorialId);
    if (!video) {
      return notFound();
    }
    return (
      <Paper
        sx={{
          backgroundColor: "white",
          border: 2,
          borderWidth: "0.5px",
          borderColor: "text.secondary",
          p: 1,
          pt: 2,
          my: 2,
        }}
      >
        <Box display="flex" alignItems={"center"} sx={{ px: 1 }}>
          <West color="secondary" sx={{ width: 14, height: 14, mr: 0.5 }} />
          <Link href={pathname}>Go back to all tutorials</Link>
        </Box>
        <Typography variant="h4" sx={{ px: 1, pb: 1 }}>
          {video.title}
        </Typography>
        <Typography sx={{ px: 1, pb: 2, maxWidth: "700px" }}>
          {video.text}
        </Typography>
        <IFrameWrapper maxWidth="1280px">
          <iframe
            loading="lazy"
            title={video.title}
            src={video.url}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{
              border: "0",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
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
      sx={{ m: 0, p: 0, pt: 2 }}
    >
      {videos.map((v, index) => (
        <Grid key={index} size={{ xs: 2, sm: 4, md: 4 }}>
          <Card variant="outlined" sx={{ p: 1, borderRadius: 2.5 }}>
            <CardActionArea
              onClick={() => {
                setSearchParam(v.id);
              }}
            >
              <CardMedia
                component="img"
                alt={v.title}
                image={v.thumbnail}
                sx={{
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                }}
              />
              <Box display="flex" flexDirection="row" gap={1} sx={{ pt: 1 }}>
                <PlayCircle
                  color="secondary"
                  sx={{ height: "33px", width: "33px" }}
                />
                <Stack>
                  <Typography
                    color="secondary"
                    variant="body2"
                    sx={{ lineHeight: "14px" }}
                  >
                    {v.title}
                  </Typography>
                  <Typography color="secondary" fontSize="12px">
                    {v.categorisation} {/* TODO: add video duration */}
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
