"use client";

import { useState } from "react";
import { Box, Paper, Button, Select, MenuItem } from "@mui/material";
import OmopGroupedAutocomplete from "./OmopGroupedAutocomplete";

const Selector = () => {
  const options = ["AND", "OR", "Followed By"];
  const [value, setValue] = useState(options[0]);

  return (
    <Box sx={{ color: "white", backgroundColor: "black", borderRadius: 20 }}>
      <Select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        sx={{
          color: "white",
          backgroundColor: "black",
          borderRadius: 20,
          "& .MuiSvgIcon-root": { color: "white" }, // white dropdown arrow
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

const TestPage = () => {
  const [components, setComponents] = useState([0]); // Start with one component

  const addComponent = () => {
    setComponents((prev) => [...prev, prev.length]); // Add a new index
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vp",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={addComponent}
        sx={{ mb: 2 }}
      >
        Add Component
      </Button>
      <Paper
        sx={{
          width: "100%",
          height: "100%",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 15,
          alignItems: "center",
        }}
      >
        {components.map((id, index) => (
          <Box
            key={id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              width: "80%",
              position: "relative",
            }}
          >
            {/* Connector line */}
            {index > 0 && (
              <>
                <Box
                  sx={{
                    position: "absolute",
                    left: "10%",
                    top: "-120px",
                    width: "4px",
                    height: "150px",
                    bgcolor: "black",
                    transform: "translateX(-50%)",
                    zIndex: 0,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    left: "10%",
                    top: "-100px",
                    transform: "translateX(-50%)",
                    zIndex: 0,
                    p: 1,
                  }}
                >
                  <Selector />
                </Box>
              </>
            )}
            <Box sx={{ zIndex: 1 }}>
              <OmopGroupedAutocomplete />
            </Box>
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default TestPage;
