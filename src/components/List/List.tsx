import { ListProps } from "@mui/material";
import { List as MuiList } from "@mui/material";
import ListItem, { ListItemType } from "./ListItem";

const List = ({ items, ...props }: ListProps & { items: ListItemType[] }) => {
  // to-do: to implement a compact version
  //const { compact } = useActionMenuSection();
  return (
    <MuiList disablePadding {...props}>
      {items.map((item) => (
        <ListItem key={item.id ?? item.label} {...item} />
      ))}
    </MuiList>
  );
};

export default List;
