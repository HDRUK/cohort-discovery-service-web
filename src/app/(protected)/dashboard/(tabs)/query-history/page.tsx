import { ApiSearchParams } from "@/types/api";
import QueryHistoryPage from "../components/QueryHistoryPage";

const DashboardQueryHistoryPage = ({
  searchParams,
}: {
  searchParams: Promise<ApiSearchParams>;
}) => <QueryHistoryPage searchParams={searchParams} />;

export default DashboardQueryHistoryPage;
