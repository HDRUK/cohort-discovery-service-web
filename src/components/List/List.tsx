import { ListProps } from "@mui/material";
import { List as MuiList } from "@mui/material";
import ListItem, { ListItemType } from "./ListItem";
import { SectionHeader } from "./SectionHeader";

type ListGroupItem = {
  id?: string;
  label: string;
  items: ListItemType[];
};

type ListEntry = ListItemType | ListGroupItem;

const isGroup = (x: ListEntry): x is ListGroupItem => "items" in x;

const List = ({
  items,
  bulleted = false,
  sx,
  ...props
}: ListProps & { items: ListEntry[]; bulleted?: boolean }) => {
  // to-do: to implement a compact version
  //const { compact } = useActionMenuSection();
  return (
    <MuiList
      disablePadding
      component={bulleted ? "ul" : "div"}
      sx={{
        ...(bulleted && {
          listStyleType: "disc",
          pl: 4,
          "& .MuiListItem-root": { display: "list-item" },
        }),
        ...sx,
      }}
      {...props}
    >
      {items.map((entry, index) => {
        if (isGroup(entry)) {
          if (entry.items.length < 1) return;
          return (
            <li key={entry.id ?? entry.label ?? index}>
              <MuiList disablePadding>
                <SectionHeader>{entry.label}</SectionHeader>

                {entry.items.map((item) => (
                  <ListItem key={item.id ?? item.label} {...item} />
                ))}
              </MuiList>
            </li>
          );
        } else {
          return <ListItem key={entry.id ?? entry.label ?? index} {...entry} />;
        }
      })}
    </MuiList>
  );
};

export default List;
