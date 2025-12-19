import type { SpeciesFormData, AddSpeciesResponse, GetSpeciesManagementResponse } from '@/api/apiTypes';

import httpClient from '@/api/axiosSetup';
import { add } from 'date-fns';
import { spec } from 'node:test/reporters';

export const speciesApi = {
    addSpecies: (data: SpeciesFormData) =>
        httpClient.post<AddSpeciesResponse>('/api/manage_species/species-management/new', data, {
            headers: { useAuth: true },
        }),

    getSpeciesManagement: (page: number = 1) =>
        httpClient.get<GetSpeciesManagementResponse>(`/api/manage_species/species-management?page=${page}`, {
            headers: { useAuth: true },
        }),

    updateSpecies: (speciesId: string, data: SpeciesFormData) =>
        httpClient.put<AddSpeciesResponse>(`/api/manage_species/species-management/${speciesId}`, data, {
            headers: { useAuth: true },
        }),

    deleteSpecies: (speciesId: string) =>
        httpClient.delete<{ message: string }>(`/api/manage_species/species-management/${speciesId}`, {
            headers: { useAuth: true },
        }),


};