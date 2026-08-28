import {
  Autocomplete,
  CircularProgress,
  InputAdornment,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useRef, useState } from "react";
import type { LatLngTuple } from "leaflet";

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface AddressSearchProps {
  onSelect: (position: LatLngTuple, address: string) => void;
  /** Displayed in the input, e.g. an address or "lat, lon" after a pin drop. */
  value?: string;
}

export default function AddressSearch({
  onSelect,
  value = "",
}: AddressSearchProps) {
  const [inputValue, setInputValue] = useState(value);
  const [options, setOptions] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // A pin drop or saved value syncs the input without it being a search
  // query — skip the next fetch so we don't hit Nominatim with "51.5, -0.1".
  const skipNextFetch = useRef(false);

  useEffect(() => {
    skipNextFetch.current = true;
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    const query = inputValue.trim();
    if (query.length < 3) {
      setOptions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          q: query,
          format: "json",
          limit: "5",
          countrycodes: "gb",
        });
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?${params}`,
          { headers: { "User-Agent": "project-daphne-web" } },
        );
        const data: NominatimResult[] = await res.json();
        setOptions(data);
      } catch {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue]);

  return (
    <Autocomplete<NominatimResult, false, false, true>
      options={options}
      getOptionLabel={(o) => (typeof o === "string" ? o : o.display_name)}
      isOptionEqualToValue={(a, b) => a.place_id === b.place_id}
      filterOptions={(x) => x}
      loading={loading}
      freeSolo
      inputValue={inputValue}
      onInputChange={(_, v) => setInputValue(v)}
      onChange={(_, result) => {
        if (!result || typeof result === "string") return;
        onSelect(
          [parseFloat(result.lat), parseFloat(result.lon)],
          result.display_name,
        );
        setInputValue(result.display_name);
        setOptions([]);
      }}
      size="small"
      forcePopupIcon={false}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search by address, postcode or location…"
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <>
                  {loading && <CircularProgress size={16} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
}
