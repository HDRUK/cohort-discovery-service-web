import { Autocomplete, CircularProgress, TextField } from "@mui/material";
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
}

export default function AddressSearch({ onSelect }: AddressSearchProps) {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
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
    <Autocomplete<NominatimResult>
      options={options}
      getOptionLabel={(o) => o.display_name}
      isOptionEqualToValue={(a, b) => a.place_id === b.place_id}
      filterOptions={(x) => x}
      loading={loading}
      inputValue={inputValue}
      onInputChange={(_, v) => setInputValue(v)}
      onChange={(_, result) => {
        if (!result) return;
        onSelect(
          [parseFloat(result.lat), parseFloat(result.lon)],
          result.display_name,
        );
        setInputValue(result.display_name);
        setOptions([]);
      }}
      size="small"
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search by postcode, county or location…"
          slotProps={{
            input: {
              ...params.InputProps,
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
