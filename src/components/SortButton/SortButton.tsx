"use client";

import { SortIcon } from "@/icons/SortIcon";
import PositionedMenu, {
  PositionedMenuItem,
} from "../PositionedMenu/PositionedMenu";

interface SortButtonProps {
  items: PositionedMenuItem[];
  active?: boolean;
}

const SortButton = ({ items, active = false }: SortButtonProps) => {
  return (
    <PositionedMenu isIcon items={items} active={active}>
      <SortIcon />
    </PositionedMenu>
  );
};

export default SortButton;
