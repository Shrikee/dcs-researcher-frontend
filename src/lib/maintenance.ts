const raw = import.meta.env.VITE_MAINTENANCE_MODE;
export const IS_MAINTENANCE = raw === 'true' || raw === '1';
