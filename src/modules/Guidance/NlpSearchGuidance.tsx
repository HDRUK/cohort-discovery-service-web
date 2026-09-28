"use client";

import { Box, Fade, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDefaults } from "@/providers/DefaultProvider";
import { NLP_SEARCH_EXAMPLES } from "@/config/nlpSearchExamples";

const NlpSearchGuidance = () => {
  const { searchSuggestionRotation } = useDefaults();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % NLP_SEARCH_EXAMPLES.length);
    }, searchSuggestionRotation);

    return () => window.clearInterval(id);
  }, [searchSuggestionRotation]);

  return (
    <Box textAlign="center" px={1}>
      <Typography sx={{ mb: 2 }}>
        We&apos;re turning your search into query rules. Once they appear,
        click a rule to view and refine its options here.
      </Typography>

      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        sx={{ mb: 0.5 }}
      >
        Try searching for something like:
      </Typography>

      <Fade key={index} in timeout={400}>
        <Typography fontStyle="italic">
          &ldquo;{NLP_SEARCH_EXAMPLES[index]}&rdquo;
        </Typography>
      </Fade>
    </Box>
  );
};

export default NlpSearchGuidance;
