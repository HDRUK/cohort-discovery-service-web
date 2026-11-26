import { Suspense } from "react";
import SkeletonFull from "@/components/SkeletonFull";
import { SearchParamsTransitionProvider } from "@/contexts/SearchParamsTransitionContext";
import ConfigurationAdmin from "../components/ConfigurationAdmin";

const AdminConfigurationPage = () => (
  <SearchParamsTransitionProvider>
    <Suspense fallback={<SkeletonFull />}>
      <ConfigurationAdmin />
    </Suspense>
  </SearchParamsTransitionProvider>
);

export default AdminConfigurationPage;
