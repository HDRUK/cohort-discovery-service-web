import { ListItemButton, ListItemText, ListProps } from "@mui/material";
import { List as MuiList } from "@mui/material";

interface ListItem {
  label: string;
  onClick: () => void;
}

const List = ({
  items,
  disabled = false,
  ...props
}: ListProps & { items: ListItem[]; disabled?: boolean }) => {
  // to-do: to implement a compact version
  //const { compact } = useActionMenuSection();
  return (
    <MuiList disablePadding {...props}>
      {items.map(({ label, onClick }) => (
        <ListItemButton
          disabled={disabled}
          key={label}
          component="div"
          onClick={onClick}
        >
          <ListItemText sx={{ color: "text.primary" }} primary={label} />
        </ListItemButton>
      ))}
    </MuiList>
  );
};

export default List;
