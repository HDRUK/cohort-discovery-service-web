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
import { usePathname } from "next/navigation";
import { IFrameWrapper } from "./IFrameWrapper";
import { ArrowBack, PlayCircle } from "@mui/icons-material";
import useSearchParams from "@/hooks/useSearchParams";

import { Video } from "../[sectionId]/page";

const TutorialTab = ({ videos }: { videos: Video[] }) => {
  const pathname = usePathname();
  const { getSearchParam, setSearchParam } = useSearchParams("tutorial-id");
  const tutorialId = getSearchParam();

  if (tutorialId) {
    const video = videos.find((v) => v.id === tutorialId);
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
          href={pathname}
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
  }

  return (
    <Grid
      container
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
      sx={{ m: 0, p: 0 }}
    >
      {videos.map((v, index) => (
        <Grid key={index} size={{ xs: 2, sm: 4, md: 4 }}>
          <Card variant="outlined" sx={{ p: 1 }}>
            <CardActionArea
              onClick={() => {
                setSearchParam(v.id);
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
