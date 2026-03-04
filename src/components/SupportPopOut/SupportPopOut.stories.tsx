import type { Meta, StoryObj } from "@storybook/nextjs";
import SupportPopOut from "./SupportPopOut";

const meta: Meta<typeof SupportPopOut> = {
    component: SupportPopOut,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof SupportPopOut>;

export const Default: Story = {};
