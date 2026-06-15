export interface DatatablesResponse {
    data: any[];
    // draw: number;
    // recordsTotal: number;
    // recordsFiltered: number;
    meta: {
        last_page: number;
        page: number;
        pageSize: number;
        total: number;
    };
}
