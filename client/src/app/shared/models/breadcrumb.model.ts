export interface IBreadcrumb extends Array<IItemBreadcrumb> {}

export declare interface IItemBreadcrumb {
	label: string;
	path?: string;
	isLink: boolean;
}
