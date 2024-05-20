import { Filter } from '@/types/types';

export default function filterCoder(filter: Filter) {
    const filterQuery = [];
    if (filter.positionFilter) {
        filterQuery.push(`position = '${filter.positionFilter}'`);
    }
    if (filter.countryCodeFilter && filter.countryCodeFilter.length > 0) {
        const countryCodes = filter.countryCodeFilter.map((countryCode) => `'${countryCode}'`).join(", ");
        filterQuery.push(`countryCode IN (${countryCodes})`);
    }
    if (filter.statusFilter && filter.statusFilter.length > 0) {
        const statuses = filter.statusFilter.map((status) => `'${status}'`).join(", ");
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
    if (filter.degreeFilter && filter.degreeFilter.length > 0) {
        const degrees = filter.degreeFilter.map((degree) => `'${degree}'`).join(", ");
        filterQuery.push(`highestDegree IN (${degrees})`);
    }
    if (filter.graduationDateFilter !== null) {
        if (filter.graduationDateFilter.min !== null && filter.graduationDateFilter.min.year !== -1) {
            const min = filter.graduationDateFilter.min;
            if (min.month === -1) {
                filterQuery.push(`graduationYear >= ${min.year}`);
            } else {
                filterQuery.push(`(graduationYear > ${min.year} OR (graduationYear = ${min.year} AND graduationMonth >= ${min.month}))`);
            }
        }
        if (filter.graduationDateFilter.max !== null && filter.graduationDateFilter.max.year !== -1 && filter.graduationDateFilter.max.month !== -1) {
            const max = filter.graduationDateFilter.max;
            if (max.month === -1) {
                filterQuery.push(`graduationYear <= ${max.year}`);
            } else {
                filterQuery.push(`(graduationYear < ${max.year} OR (graduationYear = ${max.year} AND graduationMonth <= ${max.month}))`);
            }
        }
    }
    if (filterQuery.length === 0) {
        return "";
    }
    return filterQuery.join(" AND ");
}