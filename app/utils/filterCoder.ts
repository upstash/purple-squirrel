import { Filter } from "@/types";

export default function filterCoder(filter: Filter) {
  const filterQuery = [];
  if (filter.countryCodeFilter && filter.countryCodeFilter.length > 0) {
    const countryCodes = filter.countryCodeFilter
      .map((countryCode) => `'${countryCode}'`)
      .join(", ");
    filterQuery.push(`countryCode IN (${countryCodes})`);
  }
  if (filter.statusFilter && filter.statusFilter.length > 0) {
    const statuses = filter.statusFilter
      .map((status) => `'${status}'`)
      .join(", ");
    filterQuery.push(`status IN (${statuses})`);
  }
  if (filter.starsFilter != null && filter.starsFilter != -1) {
    filterQuery.push(`stars >= ${filter.starsFilter}`);
  }
  if (filter.yoeFilter) {
    if (filter.yoeFilter.min !== null && filter.yoeFilter.min !== -1) {
      filterQuery.push(`yoe >= ${filter.yoeFilter.min}`);
    }
    if (filter.yoeFilter.max !== null && filter.yoeFilter.max !== -1) {
      filterQuery.push(`yoe <= ${filter.yoeFilter.max}`);
    }
  }
  if (filterQuery.length === 0) {
    return "";
  }
  return filterQuery.join(" AND ");
}
