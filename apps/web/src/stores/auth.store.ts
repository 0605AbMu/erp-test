import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Roles, type UserResponse } from "@erp-test/shared"
import { jwtDecode } from "jwt-decode"

interface AuthState {
    userId: number | null;
    user: UserResponse | null;
    accessToken: string | null;
    roles: Roles[];

    isAuthenticated: boolean;

    setUser: (user: UserResponse) => void;
    setToken: (token: string) => void;
    logout: () => void;
    hasRole: (roles: string[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            userId: null,
            user: null,
            accessToken: null,
            isAuthenticated: false,
            roles: [],

            setUser: (user) => set({ user }),
            setToken: (token) => {
                const decoded = jwtDecode(token);
                set({ accessToken: token, isAuthenticated: true, userId: Number(decoded.sub), roles: (decoded as any).roles })
            },
            logout: () => {
                set({ isAuthenticated: false, accessToken: null, user: null, userId: null, roles: [] });
            },

            hasRole: (roles) => {
                if (!get().isAuthenticated) {
                    return false;
                }

                const rolesState = get().roles;

                return roles.every(x => rolesState.includes(x as any));
            }
        }),
        {
            name: 'auth',
            partialize: (state) => ({
                accessToken: state.accessToken,
                isAuthenticated: state.isAuthenticated
            })
        },
    ),
);