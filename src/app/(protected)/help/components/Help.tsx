"use client";

import TabsShell from "@/components/TabsShell";
import OverviewTab from "./OverviewTab";
import Title from "@/components/Title";

const Help = () => {
  return (
    <>
      <Title
        title="General Guidance"
        useSeparator
        subTitle="Query Building Tutorials"
      />{" "}
      {/* Title is fixed, or follows subtab label? */}
      <TabsShell
        tabs={[
          {
            label: "Overview Tutorials",
            page: <OverviewTab />,
          },
          //   {
          //     label: "Query Building Tutorials",
          //     page: <TutorialTab users={existingUsers || []} />,
          //   },
        ]}
      />
    </>
  );
};

export default Help;
