import { ListItemButton, ListItemText, ListProps } from "@mui/material";
import { List as MuiList } from "@mui/material";

interface ListItem {
  label: string;
  onClick: () => void;
}

const List = ({ items, ...props }: ListProps & { items: ListItem[] }) => {
  return (
    <MuiList disablePadding {...props}>
      {items.map(({ label, onClick }) => (
        <ListItemButton key={label} component="div" onClick={onClick}>
          <ListItemText sx={{ color: "text.primary" }} primary={label} />
        </ListItemButton>
      ))}
    </MuiList>
  );
};

export default List;
