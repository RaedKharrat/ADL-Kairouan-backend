declare const _default: (() => {
    jwtSecret: string;
    jwtExpiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
    bcryptRounds: number;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    jwtSecret: string;
    jwtExpiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
    bcryptRounds: number;
}>;
export default _default;
