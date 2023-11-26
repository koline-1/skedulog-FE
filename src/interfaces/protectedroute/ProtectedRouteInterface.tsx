export interface RequireAuthInterface {
    children: React.ReactNode
    redirectTo?: string;
    returnTo?: string;
    errorMessage?: string;
}

export interface RequireAnonymityInterface {
    children: React.ReactNode
    redirectTo?: string;
    errorMessage?: string;
}