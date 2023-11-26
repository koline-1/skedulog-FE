export interface MenuInterface {
    key: string;
    text?: string;
    link?: string;
    children?: MenuInterface[];
}